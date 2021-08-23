const { network } = require("hardhat");

const {
    deployRewardDistributor,
} = require("../test/helpers/fixtures.js");
const { txWait } = require("../test/helpers/utils.js");

const allContractAddresses = require("../config/contractAddresses.js");
const allReservesConfigs = require("../config/reservesConfigs.js");
const allCommonConfigs = require("../config/commonConfig.js");


const currentNet = network.name;
console.log("current network is: ", currentNet);
console.log("all supports tokens", allContractAddresses[currentNet]);

let commonConfigs = allCommonConfigs[currentNet];

let deployer;
let rewardDistributor;

async function deployReward(controller, rewardDistributorAddress) {
    let rewardDistributorContract;

    if (!rewardDistributorAddress) {
        console.log("\nPrepare to deploy the reward distribution contract");
        rewardDistributorContract = (await deployRewardDistributor(controller)).rewardDistributor;
        // // Only deploy contract implementation
        // let RewardDistributorV2 = await ethers.getContractFactory("RewardDistributorV2");
        // let rewardDistributorContract = await RewardDistributorV2.deploy();

        // await rewardDistributorContract.deployed();

        // tx = await rewardDistributorContract.initialize(controller.address);
        // await txWait(currentNet, tx);
    } else {
        console.log("\nReward distribution contract has been deployed");
        let rewardDistributorFactory = await ethers.getContractFactory("RewardDistributor");
        rewardDistributorContract = rewardDistributorFactory.attach(rewardDistributorAddress);
    }
    return rewardDistributorContract;
}


async function main() {
    [deployer] = await ethers.getSigners();
    console.log("\nDeploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

    let controllerAddress = commonConfigs.controller;
    if (!controllerAddress) {
        console.log("Do not get a valid controller contract address!");
        return;
    }
    console.log("\nController contract has been deployed");
    let controllerFactory = await ethers.getContractFactory("Controller");
    let controller = controllerFactory.attach(controllerAddress);
    console.log("controller address is: ", controller.address, "\n");

    // deploy distribution contract.
    rewardDistributor = await deployReward(controller, commonConfigs.rewardDistributor);
    console.log("rewardDistributor", rewardDistributor.address);

    console.log("\nDouble check");
    let actualController = await rewardDistributor.controller();
    console.log("controller address in reward contract", actualController);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
