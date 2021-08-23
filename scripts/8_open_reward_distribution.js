const { network } = require("hardhat");

const { formatTokenAmount, formatToHumanReadable, parseTokenAmount, txWait } = require("../test/helpers/utils.js");

const allContractAddresses = require("../config/contractAddresses.js");
const allReservesConfigs = require("../config/reservesConfigs.js");
const allCommonConfigs = require("../config/commonConfig.js");
const { constants } = require("ethers");

const currentNet = network.name;
console.log("current network is: ", currentNet);
console.log("all supports tokens", allContractAddresses[currentNet]);

let commonConfigs = allCommonConfigs[currentNet];
let contractAddresses = allContractAddresses[currentNet];

let deployer;
let tx;


async function main() {
    [deployer] = await ethers.getSigners();
    console.log("\nDeploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");


    let rewardDistributorAddress = commonConfigs.rewardDistributor;
    if (!rewardDistributorAddress) {
        console.log("Do not get a valid rewardDistributor contract address!");
        return;
    }
    console.log("\nreward distribution contract has been deployed");
    let rewardDistributionFactory = await ethers.getContractFactory("RewardDistributor");
    let rewardDistributor = rewardDistributionFactory.attach(rewardDistributorAddress);
    console.log("rewardDistributor address is: ", rewardDistributor.address, "\n");

    let rewardToken = commonConfigs.rewardToken;
    if (!rewardToken) {
        console.log("\nDo not get a valid reward token address!");
        return;
    }
    let rewardSpeed = commonConfigs.rewardSpeed;
    if (!rewardSpeed) {
        console.log("\nDo not get a valid distribute speed!");
        return;
    }
    rewardSpeed = ethers.utils.parseEther(rewardSpeed);

    let currentRewardToken = await rewardDistributor.rewardToken();
    if (currentRewardToken != rewardToken) {
        console.log("\ngoing to set reward token");
        tx = await rewardDistributor._setRewardToken(rewardToken);
        await txWait(currentNet, tx);
    }

    let currentState = await rewardDistributor.paused();
    console.log("\ncurrent distributor contract has been paused: ", currentState);

    let currentGlobalDistributionSpeed = await rewardDistributor.globalDistributionSpeed();
    if (currentGlobalDistributionSpeed.toString() != rewardSpeed.toString()) {
        console.log("\ngoing to set distribute speed");
        if (!currentState) {
            // unpause distributor and then set distribute speed.
            tx = await rewardDistributor._unpause(rewardSpeed);
            await txWait(currentNet, tx);
        } else {
            // set distribute speed
            tx = await rewardDistributor._setGlobalDistributionSpeed(rewardSpeed);
            await txWait(currentNet, tx);
        }
    }

    console.log("\nDouble check");
    currentRewardToken = await rewardDistributor.rewardToken();
    console.log("\nreward token in distributor contract is: ", currentRewardToken);
    currentGlobalDistributionSpeed = await rewardDistributor.globalDistributionSpeed();
    console.log("\ndistribute speed in distributor contract is: ", await formatToHumanReadable(currentGlobalDistributionSpeed));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
