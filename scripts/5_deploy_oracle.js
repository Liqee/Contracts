const { network } = require("hardhat");

const { deployOracle } = require("../test/helpers/fixtures.js");
const { formatToHumanReadable, txWait } = require("../test/helpers/utils.js");

const allContractAddresses = require("../config/contractAddresses.js");
const allReservesConfigs = require("../config/reservesConfigs.js");
const allCommonConfigs = require("../config/commonConfig.js");

const currentNet = network.name;
console.log("current network is: ", currentNet);
console.log("all supports tokens", allContractAddresses[currentNet]);

let commonConfigs = allCommonConfigs[currentNet];
let contractAddresses = allContractAddresses[currentNet];
const assetsToDeploy = JSON.parse(process.env.ASSETS);

let deployer;
let oracle;

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

    if (network == "mainnet") {
      return oracleContract;
    }
  } else {
    console.log("\noracle contract has been deployed");
    let oracleFactory = await ethers.getContractFactory("PriceOracle");
    oracleContract = oracleFactory.attach(oracleAddress);

    return oracleContract;
  }

  // set oracle in the controller contract.
  // !!!NOTICE: It is dangerous to replace oracle contract directly, before setting,
  // the oracle must has the correct prices of all supported assets.
  console.log("\ngoing to set oracle in the controller");
  tx = await controllerContract._setPriceOracle(oracleContract.address);
  await txWait(currentNet, tx);
  console.log("finish to set oracle in the controller");
  return oracleContract;
}

// only expects to feed price for testnet.
// if current net is mainnet, expect to set current valid price by off-line.
async function setOraclePrice(assetsToFeedPrice) {
  let autualFeedingPrices = [];
  let iTokenContracts = [];

  let iTokenContract;
  let autualFeedingPrice;
  let tokenDecimals;
  let basicPrice;

  for (index in assetsToFeedPrice) {
    let asset = assetsToFeedPrice[index].toLowerCase();
    // check the token to deploy whether is valid or not.
    if (!contractAddresses.hasOwnProperty(asset)) {
      console.log("\n Please set token address for underlying: ", asset, "\n");
      continue;
    }
    let iTokenAddress = contractAddresses[asset].iToken;
    if (!iTokenAddress) {
      console.log("\nCan not get a valid iToken address", asset);
      return;
    }

    let iTokenFactory = await ethers.getContractFactory("iToken");
    iTokenContract = iTokenFactory.attach(iTokenAddress);

    tokenDecimals = await iTokenContract.decimals();
    if (
      asset == "usdc" ||
      asset == "usdt" ||
      asset == "dai" ||
      asset == "busd"
    ) {
      // set price for basic token: iUSDC.
      // it should be $1.
      basicPrice = ethers.utils.parseEther("1");
    } else if (asset == "eth") {
      basicPrice = ethers.utils.parseEther("277");
    } else if (asset == "wbtc") {
      basicPrice = ethers.utils.parseEther("49000");
    } else if (asset == "atom") {
      basicPrice = ethers.utils.parseEther("19");
    } else if (asset == "fil") {
      basicPrice = ethers.utils.parseEther("42");
    } else if (asset == "dot") {
      basicPrice = ethers.utils.parseEther("37");
    } else if (asset == "ada") {
      basicPrice = ethers.utils.parseEther("1.14");
    } else if (asset == "uni") {
      basicPrice = ethers.utils.parseEther("31");
    } else if (asset == "eth_token") {
      basicPrice = ethers.utils.parseEther("1800");
    } else if (asset == "df") {
      basicPrice = ethers.utils.parseEther("0.35");
    } else if (asset == "goldx") {
      basicPrice = ethers.utils.parseEther("55");
    } else {
      // expect set price for MSD Token.
      basicPrice = ethers.utils.parseEther("1");
    }
    autualFeedingPrice = basicPrice.mul(
      ethers.BigNumber.from(10).pow(18 - tokenDecimals)
    );

    iTokenContracts.push(iTokenAddress);
    autualFeedingPrices.push(autualFeedingPrice);
  }

  // sets price.
  console.log("\ngoing to set price");
  let poster = await oracle.poster();
  console.log("\ncurrent oracle poster is: ", poster);
  let currentAccount = deployer.address;
  console.log("\ncurrent account is: ", currentAccount);

  // ensure current account is the poster
  if (poster != currentAccount) {
    console.log("\nSet current account as the oracle poster");
    tx = await oracle._setPoster(currentAccount);
    await txWait(currentNet, tx);
  }

  // set price
  tx = await oracle
    .connect(deployer)
    .setPrices(iTokenContracts, autualFeedingPrices);
  await txWait(currentNet, tx);

  // reback to original state
  let currentPoster = await oracle.poster();
  if (currentPoster != poster) {
    console.log("\nReset oracle poster");
    tx = await oracle._setPoster(poster);
    await txWait(currentNet, tx);
  }

  console.log("finish to set price");
}

async function main() {
  [deployer] = await ethers.getSigners();
  console.log("\nDeploying contracts with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.getBalance()).toString(),
    "\n"
  );

  let controllerAddress = commonConfigs.controller;
  if (!controllerAddress) {
    console.log("Do not get a valid controller contract address!");
    return;
  }
  let controllerFactory = await ethers.getContractFactory("Controller");
  let controller = controllerFactory.attach(controllerAddress);

  // deploy oracle contract and set oracle in the controller contract.
  oracle = await deployOracleContract(allCommonConfigs, currentNet, controller);
  console.log("\noracle:", oracle.address);

  console.log("\nDouble check");
  let actualOracle = await controller.priceOracle();
  console.log("oracle address in controller contract", actualOracle);

  // !!! ------ NOTICE ------ !!!
  // No matter which network to deploy oracle contract,
  // must set the price of the USDC, but should notice the token decimals,
  // it should be `usdcPrice*10**(36-usdcDecimals)`,
  // such as `1*10**(36-6)`.
  // !!! ------ NOTICE ------ !!!
  if (currentNet != "mainnet") {
    // when deploy contracts at a test net, set price directly.
    await setOraclePrice(assetsToDeploy);
  }

  console.log("\nDouble check iToken price");
  for (index in assetsToDeploy) {
    let asset = assetsToDeploy[index].toLowerCase();
    // check the token to deploy whether is valid or not.

    let iTokenAddress = contractAddresses[asset].iToken;
    let price = await oracle.getUnderlyingPrice(iTokenAddress);
    console.log(asset, "iToken price: ", price.toString());
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
