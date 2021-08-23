const { network } = require("hardhat");

const {
    fixtureDeployNonStablecoinInterestRateModel,
    fixtureDeployStablecoinInterestRateModel,
    deployFixedInterestRateModel,
} = require("../test/helpers/fixtures.js");

const allContractAddresses = require("../config/contractAddresses.js");
const allCommonConfigs = require("../config/commonConfig.js");

const currentNet = network.name;
console.log("current network is: ", currentNet);
console.log("all supports tokens", allContractAddresses[currentNet]);

let commonConfigs = allCommonConfigs[currentNet];

let deployer;
let modelType;

async function deployInterestModelContract(modelType, interestModelAddress) {
    let interestModelContract;
    if (modelType == "nonStable") {
        if (!interestModelAddress) {
            console.log("\nDeploy nonstable interest model contract");
            let threshold = "0.05";
            interestModelContract = await fixtureDeployNonStablecoinInterestRateModel(threshold);
        } else {
            console.log("\nNonstable interest model contract has been deployed");
            let interestRateModelFactory = await ethers.getContractFactory("StandardInterestRateModel");
            interestModelContract = interestRateModelFactory.attach(interestModelAddress);
        }
    } else if (modelType == "stable") {
        if (!interestModelAddress) {
            console.log("\nDeploy stable interest model contract");
            interestModelContract = await fixtureDeployStablecoinInterestRateModel();
        } else {
            console.log("\nStable interest model contract has been deployed");
            let interestRateModelFactory = await ethers.getContractFactory("StandardInterestRateModel");
            interestModelContract = interestRateModelFactory.attach(interestModelAddress);
        }
    } else if (modelType == "fixed") {
        if (!interestModelAddress) {
            console.log("\nDeploy fixed interest model contract");
            interestModelContract = await deployFixedInterestRateModel();
        } else {
            console.log("\nFixed interest model contract has been deployed");
            let interestRateModelFactory = await ethers.getContractFactory("FixedInterestRateModel");
            interestModelContract = interestRateModelFactory.attach(interestModelAddress);
        }
    }

    return interestModelContract;
}


async function main() {
    [deployer] = await ethers.getSigners();
    console.log("\nDeploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

    // means this is not a stable interest model contract.
    modelType = "nonStable";
    let nonStableInterestModel = await deployInterestModelContract(modelType, commonConfigs.nonStableInterestModel);
    console.log("Non-stable interest model contract is: ", nonStableInterestModel.address);

    // means this is a stable interest model contract.
    modelType = "stable";
    let stableInterestModel = await deployInterestModelContract(modelType, commonConfigs.stableInterestModel);
    console.log("Stable interest model contract is: ", stableInterestModel.address);

    // means this is a fixed interest model contract.
    modelType = "fixed";
    let fixedInterestModel = await deployInterestModelContract(modelType, commonConfigs.fixedInterestModel);
    console.log("Fixed interest model contract is: ", fixedInterestModel.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
