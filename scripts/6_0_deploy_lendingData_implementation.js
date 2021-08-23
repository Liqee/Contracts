const { network } = require("hardhat");

const { deployLendingData } = require("../test/helpers/fixtures.js");
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

let ethPrice, btcPrice;

// !!! This contract does not belong to iToken protocol !!!
// So it can be deployed manually.
async function deployLendingDataContract(
  controllerAddress,
  iUSDCAddress,
  blocksPerYear
) {
  console.log("\nWhen deploys lending data contract");
  let lendingDataContract;
  let lendingDataContractAddr = commonConfigs.lendingData;
  let lendingDataImplementation = commonConfigs.lendingDataImplementation;
  let constructorArguments = [controllerAddress, iUSDCAddress];

  if (controllerAddress && iUSDCAddress && !lendingDataContractAddr) {
    console.log("\ndeploy lending data contract");
    lendingDataContract = await deployLendingData(
      controllerAddress,
      iUSDCAddress,
      blocksPerYear,
      lendingDataImplementation,
      constructorArguments
    );
  } else {
    console.log("\nlending data contract has been deployed");
    let lendingDataFactory = await ethers.getContractFactory("LendingDataV2");
    lendingDataContract = lendingDataFactory.attach(lendingDataContractAddr);
  }
  return lendingDataContract;
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

  let iUSDCContract = contractAddresses["usdc"].iToken;
  if (!iUSDCContract) {
    console.log("Do not get a valid iUSDC contract address!");
    return;
  }

  let blocksPerYear = commonConfigs.blocksPerYear;
  if (!blocksPerYear) {
    console.log("Do not get a valid blocks per year!");
    return;
  }

  // deploy lendingData, this contrat only for the front-end!!!
  let lendingData = await deployLendingDataContract(
    controllerAddress,
    iUSDCContract,
    blocksPerYear
  );
  console.log("lending data", lendingData.address, "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
