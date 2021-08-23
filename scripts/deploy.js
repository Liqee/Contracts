require("dotenv").config();
const { network } = require("hardhat");
const hre = require("hardhat");
const { createFixtureLoader } = waffle;

const {
  deployiETH,
  deployiToken,
  deployRewardDistributor,
  fixtureDeployController,
  fixtureDeployInterestRateModel,
  fixtureDeployStablecoinInterestRateModel,
  fixtureDeployNonStablecoinInterestRateModel,
  deployOracle,
  deployLendingData,
} = require("../test/helpers/fixtures.js");
const { sleep, parseTokenAmount } = require("../test/helpers/utils.js");
// Use ethers provider instead of waffle's default MockProvider
const loadFixture = createFixtureLoader([], ethers.provider);
const allContractAddresses = require("../config/contractAddresses.js");
const allReservesConfigs = require("../config/reservesConfigs.js");
const allCommonConfigs = require("../config/commonConfig.js");
const assetsToDeploy = JSON.parse(process.env.ASSETS);

const currentNet = network.name;
let sleepTime = currentNet == "mainnet" ? 13000 : 5000;
console.log("current network is: ", currentNet);
console.log("all supports tokens", allContractAddresses[currentNet]);

let commonConfigs = allCommonConfigs[currentNet];
let contractAddresses = allContractAddresses[currentNet];
let deployer;
let blockSleep = 2;

async function prepareConfig() {
  if (!allContractAddresses.hasOwnProperty(currentNet)) {
    console.log(
      "Please set contract address config in the file `contractAddress.js` for the network ",
      currentNet
    );
    process.exit(1);
  }

  if (!allCommonConfigs.hasOwnProperty(currentNet)) {
    console.log(
      "Please set config in the file `commonConfig.js` for the network ",
      currentNet
    );
    process.exit(1);
  }
}

let interestModel;
let controller;
let rewardDistributor;
let iETH, iToken, iUSDC;
let iTokens = [];
let stableInterestModel, nonStableInterestModel;
let tx;

async function deployControllerContract(
  controllerAddress,
  closeFactor,
  liquidationIncentive
) {
  let controllerContract;

  if (!controllerAddress) {
    console.log("\nPrepare to deploy the controller contract");
    controllerContract = (await fixtureDeployController()).controller;

    // set close factor
    console.log("going to set close factor: ", closeFactor);
    tx = await controllerContract._setCloseFactor(
      ethers.utils.parseEther(closeFactor)
    );
    if (network.name != "hardhat") {
      await sleep(sleepTime);
      await tx.wait(blockSleep);
    }
    console.log("finish to set close factor\n");

    // set liquidation incentive
    console.log("going to set liquidation incentive", liquidationIncentive);
    tx = await controllerContract._setLiquidationIncentive(
      ethers.utils.parseEther(liquidationIncentive)
    );
    if (network.name != "hardhat") {
      await sleep(sleepTime);
      await tx.wait(blockSleep);
    }
    console.log("finish to set liquidation incentive\n");
  } else {
    console.log("\nController contract has been deployed");
    let controllerFactory = await ethers.getContractFactory("Controller");
    controllerContract = controllerFactory.attach(controllerAddress);
  }
  return controllerContract;
}

async function deployReward(rewardDistributorAddress) {
  let rewardDistributorContract;

  if (!rewardDistributorAddress) {
    console.log("\nPrepare to deploy the reward distribution contract");
    rewardDistributorContract = (await deployRewardDistributor(controller))
      .rewardDistributor;
  } else {
    console.log("\nReward distribution contract has been deployed");
    let rewardDistributorFactory = await ethers.getContractFactory(
      "RewardDistributor"
    );
    rewardDistributorContract = rewardDistributorFactory.attach(
      rewardDistributorAddress
    );
  }
  return rewardDistributorContract;
}

async function deployInterestModelContract(asset, interestModelFactory) {
  let interestModelContract;

  if (!interestModelFactory) {
    console.log("\nPrepare to deploy the interest model contract");

    if (asset == "eth") {
      let threshold = "0.05";
      interestModelContract = await fixtureDeployNonStablecoinInterestRateModel(
        threshold
      );
    } else {
      interestModelContract = await fixtureDeployStablecoinInterestRateModel();
    }
  } else {
    console.log("\nInterest model contract has been deployed");
    let interestRateModelFactory = await ethers.getContractFactory(
      "StandardInterestRateModel"
    );
    interestModelContract = interestRateModelFactory.attach(
      interestModelFactory.interestModel
    );
  }

  return interestModelContract;
}

async function deployiTokenContract(
  reserveConfig,
  asset,
  controllerAddress,
  interestModelAddress,
  iTokenAddress,
  iTokenImplementationAddr
) {
  console.log("\nDeploy iToken for ", asset);
  let iTokenContract;

  if (!iTokenAddress) {
    if (asset == "eth") {
      console.log("\nPrepare to deploy the iETH contract");
      iTokenContract = (
        await deployiETH(
          reserveConfig.iTokenName,
          reserveConfig.iTokenSymbol,
          controllerAddress,
          interestModelAddress,
          reserveConfig.reserveRatio,
          reserveConfig.flashloanFeeRatio,
          reserveConfig.protocolFeeRatio
        )
      ).iETH;
      console.log("deploy iETH contract done!");
    } else {
      console.log("\nPrepare to deploy the iToken contract");
      iTokenContract = (
        await deployiToken(
          contractAddresses[asset].token,
          reserveConfig.iTokenName,
          reserveConfig.iTokenSymbol,
          controllerAddress,
          interestModelAddress,
          reserveConfig.reserveRatio,
          reserveConfig.flashloanFeeRatio,
          reserveConfig.protocolFeeRatio,
          iTokenImplementationAddr
        )
      ).iToken;
    }
  } else {
    if (asset == "eth") {
      console.log("iETH contract has been deployed");
      let iETHFactory = await ethers.getContractFactory("iETH");
      iTokenContract = iETHFactory.attach(iTokenAddress);
    } else {
      console.log(asset, " iToken contract has been deployed");
      let iTokenFactory = await ethers.getContractFactory("iToken");
      iTokenContract = iTokenFactory.attach(iTokenAddress);
    }
  }
  return iTokenContract;
}

async function deployOracleContract(
  commonConfigs,
  network,
  controllerContract
) {
  let oracleContract;
  let poster;
  let oracleAddress = commonConfigs[network].oracle;
  if (network == "mainnet") {
    poster = commonConfigs.poster ? commonConfigs.poster : deployer.address;
  } else {
    poster = deployer.address;
  }
  let maxSwing = commonConfigs.maxSwing;

  if (!oracleAddress) {
    console.log("\nPrepare to deploy the oracle contract");
    oracleContract = await deployOracle(poster, maxSwing);

    // set oracle in the controller contract.
    console.log("\ngoing to set oracle in the controller");
    tx = await controllerContract._setPriceOracle(oracleContract.address);
    if (network.name != "hardhat") {
      await sleep(sleepTime);
      await tx.wait(blockSleep);
    }
    console.log("finish to set oracle in the controller");
  } else {
    console.log("\noracle contract has been deployed");
    let oracleFactory = await ethers.getContractFactory("PriceOracle");
    oracleContract = oracleFactory.attach(oracleAddress);
  }
  return oracleContract;
}

// !!! This contract does not belong to iToken protocol !!!
// So it can be deployed manually.
async function deployLendingDataContract() {
  console.log("\nWhen deploys lending data contract");
  let lendingDataContract;

  let controllerContract = commonConfigs.controller
    ? commonConfigs.controller
    : controller.address;
  console.log("controller contract is:", controllerContract);
  let lendingDataContractAddr = commonConfigs.lendingData;
  let iUSDCContract = contractAddresses["usdc"].iToken
    ? contractAddresses["usdc"].iToken
    : iUSDC;
  console.log("iUSDC contract is:", iUSDCContract);
  let iETHContract = contractAddresses["eth"].iToken
    ? contractAddresses["eth"].iToken
    : iETH.address;
  console.log("iETH contract is:", iETHContract);

  if (
    controllerContract &&
    iUSDCContract &&
    iETHContract &&
    !lendingDataContractAddr
  ) {
    console.log("\ndeploy lending data contract");
    lendingDataContract = await deployLendingData(
      controllerContract,
      iUSDCContract,
      iETHContract
    );
  } else if (!controllerContract) {
    console.log("\nCan not find controller contract!");
    process.exit(1);
  } else if (!iUSDCContract) {
    console.log("\nCan not find iUSDC contract!");
    process.exit(1);
  } else if (!iETHContract) {
    console.log("\nCan not find iETH contract!");
    process.exit(1);
  } else {
    console.log("\nlending data contract has been deployed");
    let lendingDataFactory = await ethers.getContractFactory("LendingData");
    lendingDataContract = lendingDataFactory.attach(lendingDataContractAddr);
  }
  return lendingDataContract;
}

async function addToMarket(controllerContract, iToken, reserveConfig) {
  let collateralFactor = ethers.utils.parseEther(
    reserveConfig.collateralFactor.toString()
  );
  let borrowFactor = ethers.utils.parseEther(
    reserveConfig.borrowFactor.toString()
  );
  let supplyCapacity = await parseTokenAmount(
    iToken,
    reserveConfig.supplyCapacity
  );
  let borrowCapacity = await parseTokenAmount(
    iToken,
    reserveConfig.borrowCapacity
  );
  let distributionFactor = ethers.utils.parseEther(
    reserveConfig.distributionFactor.toString()
  );
  tx = await controllerContract._addMarket(
    iToken.address,
    collateralFactor,
    borrowFactor,
    supplyCapacity,
    borrowCapacity,
    distributionFactor
  );
  if (network.name != "hardhat") {
    await sleep(sleepTime);
    await tx.wait(blockSleep);
  }
  console.log("finish to add asset to market");
  console.log("double check the setting data");
  let tokenMarkets = await controller.markets(iToken.address);
  console.log(
    "contract collateral factor is: ",
    tokenMarkets.collateralFactorMantissa.toString()
  );
  console.log(
    "contract borrow factor is:     ",
    tokenMarkets.borrowFactorMantissa.toString()
  );
  console.log(
    "contract supply cap is:        ",
    tokenMarkets.supplyCapacity.toString()
  );
  console.log(
    "contract borrow cacp is:       ",
    tokenMarkets.borrowCapacity.toString(),
    "\n"
  );
}

// only expects to feed price for testnet.
async function setOraclePrice(currentNet) {
  // if current net is mainnet, expect to set current valid price by off-line.
  if (currentNet == "mainnet") {
    console.log("expect to feed price off-line");
    return;
  }
  let autualFeedingPrices = [];
  let iTokenContracts = [];
  for (index in iTokens) {
    let iToken = iTokens[index];
    if (iToken.address == iUSDC) {
      // set price for basic token: iUSDC.
      // it should be $1.
      let tokenDecimals = await iToken.decimals();
      let basicPrice = ethers.utils.parseEther("1");
      const autualFeedingPrice = basicPrice.mul(
        ethers.BigNumber.from(10).pow(18 - tokenDecimals)
      );
      tx = await oracle.connect(deployer).setPrice(iUSDC, autualFeedingPrice);

      if (network.name != "hardhat") {
        await tx.wait(blockSleep);
      }
    }
    iTokenContracts.push(iToken.address);
    const decimals = await iToken.decimals();

    // assumes current price is $1590, that is 1 ETH = 1590 USDC.
    const feedingPrice = ethers.utils.parseEther("1590");
    const autualFeedingPrice = feedingPrice.mul(
      ethers.BigNumber.from(10).pow(18 - decimals)
    );
    autualFeedingPrices.push(autualFeedingPrice);
  }
  // sets price.
  console.log("\ngoing to set price");
  tx = await oracle
    .connect(deployer)
    .setPrices(iTokenContracts, autualFeedingPrices);
  if (network.name != "hardhat") {
    await tx.wait(blockSleep);
  }
  console.log("finish to set price");
}

async function main() {
  await prepareConfig();

  [deployer] = await ethers.getSigners();
  console.log("\nDeploying contracts with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.getBalance()).toString(),
    "\n"
  );

  // deploy controller contract and then set close factor and liquidation incentive
  controller = await deployControllerContract(
    commonConfigs.controller,
    allReservesConfigs.closeFactor,
    allReservesConfigs.liquidationIncentive
  );
  console.log("controller", controller.address);

  // deploy distribution contract.
  rewardDistributor = await deployReward(commonConfigs.rewardDistributor);
  console.log("rewardDistributor", rewardDistributor.address);

  for (index in assetsToDeploy) {
    let asset = assetsToDeploy[index].toLowerCase();
    // check the token to deploy whether is valid or not.
    if (!contractAddresses.hasOwnProperty(asset)) {
      console.log("\n Please set token address for underlying: ", asset, "\n");
      continue;
    }
    let assetConfig = allReservesConfigs[asset];
    // deploy interest contract and iToken contract.
    let interestModelFactory = false;
    console.log("\n deploy interest model for ", asset);
    let iTokenAddress = contractAddresses[asset].iToken;
    if (asset == "eth") {
      let iETHModelType = assetConfig.interestModelType;
      if (iETHModelType) {
        console.log("non-stable interest model has been deployed");
        let ethInterestModelAddress = commonConfigs.nonStableInterestModel;
        let ethInterestModelFactory = await ethers.getContractFactory(
          "StandardInterestRateModel"
        );
        interestModel = ethInterestModelFactory.attach(ethInterestModelAddress);
      } else {
        // for iETH, deploy a new interest model contract, and it is called `nonStableInterestModel`
        interestModel = await deployInterestModelContract(
          asset,
          interestModelFactory
        );
      }
      nonStableInterestModel = interestModel;
      console.log("interest rate model", interestModel.address);
      // for iETH, deploy a new iToken implementation.
      iETH = await deployiTokenContract(
        assetConfig,
        asset,
        controller.address,
        interestModel.address,
        iTokenAddress,
        commonConfigs.iETHImplementation
      );
      iTokens.push(iETH);
      console.log("iETH", iETH.address);
    } else {
      let modelType = assetConfig.interestModelType;
      console.log("modelType", modelType);
      if (modelType) {
        if (modelType == "stableInterestModel") {
          if (stableInterestModel) {
            interestModel = stableInterestModel;
          } else {
            console.log("stable interest model has been deployed");
            let stableInterestModelAddress = commonConfigs.stableInterestModel;
            let stableInterestModelFactory = await ethers.getContractFactory(
              "StablecoinInterestRateModel"
            );
            interestModel = stableInterestModelFactory.attach(
              stableInterestModelAddress
            );
          }
        } else {
          if (nonStableInterestModel) {
            interestModel = nonStableInterestModel;
          } else {
            console.log("non-stable interest model has been deployed");
            let nonStableInterestModelAddress =
              commonConfigs.nonStableInterestModel;
            let nonStableInterestModelFactory = await ethers.getContractFactory(
              "StandardInterestRateModel"
            );
            interestModel = nonStableInterestModelFactory.attach(
              nonStableInterestModelAddress
            );
          }
        }
      } else {
        interestModel = await deployInterestModelContract(
          asset,
          interestModelFactory
        );
        if (asset == "usdc") {
          stableInterestModel = interestModel;
        }
      }
      console.log("interest rate model", interestModel.address);
      // deploy iToken
      iToken = await deployiTokenContract(
        assetConfig,
        asset,
        controller.address,
        interestModel.address,
        iTokenAddress,
        commonConfigs.iTokenImplementation
      );
      if (asset == "usdc") {
        iUSDC = iToken.address;
      }
      iTokens.push(iToken);
      console.log("iToken", iToken.address, "\n");
    }
  }

  // deploy oracle contract and set oracle in the controller contract.
  oracle = await deployOracleContract(allCommonConfigs, currentNet, controller);
  console.log("\noracle:", oracle.address);

  if (currentNet != "mainnet") {
    // when deploy contracts at a test net, set price directly.
    await setOraclePrice(currentNet, assetsToDeploy);
  }

  // deploy lendingData, this contrat only for the front-end!!!
  lendingData = await deployLendingDataContract();
  console.log("lending data", lendingData.address, "\n");

  // add token to the controller,
  // !!! when deploys contracts for the mainnet, should feed prices by off-line at first.!!!
  if (currentNet == "mainnet" && !commonConfigs.oracle) {
    console.log("\nPlease set oracle address in the config.");
    return;
  }
  for (index in assetsToDeploy) {
    let asset = assetsToDeploy[index].toLowerCase();
    let assetConfig = allReservesConfigs[asset];
    // check the token to deploy whether is valid or not.
    if (!contractAddresses.hasOwnProperty(asset)) {
      console.log("\n Please set token address config: ", asset, "\n");
      continue;
    }

    // set max swing for asset separately in oracle.
    let priceSwing = ethers.utils.parseEther(assetConfig.priceSwing.toString());
    let tokenPriceSwing = await oracle.maxSwings(iTokens[index].address);

    if (tokenPriceSwing.toString() == 0) {
      console.log(
        "set",
        asset,
        "price swing as ",
        assetConfig.priceSwing,
        "\n"
      );
      tx = await oracle._setMaxSwingForAsset(
        iTokens[index].address,
        priceSwing
      );
      if (network.name != "hardhat") {
        await tx.wait(blockSleep);
      }
    }

    let hasAdded = await controller.hasiToken(iTokens[index].address);
    if (!hasAdded) {
      console.log("going to add", asset, "to the market");
      await addToMarket(controller, iTokens[index], assetConfig);
    } else {
      console.log(asset, "has already been added to the market\n");
    }
  }

  console.log("\nController:    ", controller.address);
  console.log("PriceOracle :    ", oracle.address);
  console.log("LendingData :    ", lendingData.address, "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
