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
  baseTokenAddr,
  blocksPerYear,
  implementationAddress
) {
  console.log("\nWhen deploys lending data contract");
  let lendingDataContract;
  let lendingDataContractAddr = commonConfigs.lendingData;

  if (controllerAddress && baseTokenAddr && !lendingDataContractAddr) {
    console.log("\ndeploy lending data contract");
    lendingDataContract = await deployLendingData(
      controllerAddress,
      baseTokenAddr,
      blocksPerYear,
      implementationAddress
    );
  } else {
    console.log("\nlending data contract has been deployed");
    let lendingDataFactory = await ethers.getContractFactory("LendingData");
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

  let baseTokenContract = contractAddresses["xusd_sp"].iToken;
  if (!baseTokenContract) {
    console.log("Do not get a valid USX contract address!");
    return;
  }

  let blocksPerYear = commonConfigs.blocksPerYear;
  if (!blocksPerYear) {
    console.log("Do not get a valid blocks per year!");
    return;
  }

  let lendingDataContractImplementation =
    commonConfigs.lendingDataImplementation;
  if (!lendingDataContractImplementation) {
    console.log("Do not get a valid lending data implementation address!");
    return;
  }

  // deploy lendingData, this contrat only for the front-end!!!
  let lendingData = await deployLendingDataContract(
    controllerAddress,
    baseTokenContract,
    blocksPerYear,
    lendingDataContractImplementation
  );
  console.log("lending data", lendingData.address, "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
