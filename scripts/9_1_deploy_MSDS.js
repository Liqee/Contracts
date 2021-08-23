const { network } = require("hardhat");

const {
    deployMSDS,
} = require("../test/helpers/fixtures.js");
const { txWait } = require("../test/helpers/utils.js");

const allContractAddresses = require("../config/contractAddresses.js");
const allReservesConfigs = require("../config/reservesConfigs.js");
const allCommonConfigs = require("../config/commonConfig.js");

const currentNet = network.name;
console.log("current network is: ", currentNet);
console.log("all supports tokens", allContractAddresses[currentNet]);

let commonConfigs = allCommonConfigs[currentNet];
let contractAddresses = allContractAddresses[currentNet];
const assetsToDeploy = JSON.parse(process.env.MSDs);

let deployer;

async function deployMSDSContract(assetConfig, asset, msdController, fixedInterestModel, msdsAddress, commonConfigs) {
    console.log("\nDeploy MSDS for ", asset);
    let msdsContract;

    if (!msdsAddress) {
        console.log("\nPrepare to deploy the MSDS contract: ", asset);
        msdsContract = await deployMSDS(
            assetConfig.name,
            assetConfig.symbol,
            (contractAddresses[asset]).token,
            fixedInterestModel,
            msdController.address,
            commonConfigs.msdsImplementation
        );
    } else {
        console.log(asset, "MSDS contract has been deployed");
        let MSDSFactory = await ethers.getContractFactory("MSDS");
        msdsContract = MSDSFactory.attach(msdsAddress);
    }
    return msdsContract;
}


async function main() {
    [deployer] = await ethers.getSigners();
    console.log("\nDeploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

    let fixedInterestModel = commonConfigs.fixedInterestModel;
    if (!fixedInterestModel) {
        console.log("Do not get a valid fixed interest model contract address!");
        return;
    }

    let msdControllerAddress = commonConfigs.msdController;
    if (!msdControllerAddress) {
        console.log("Do not get a valid msd controller contract address!");
        return;
    }
    console.log("\nMSD controller contract has been deployed");
    let msdControllerFactory = await ethers.getContractFactory("MSDController");
    let msdController = msdControllerFactory.attach(msdControllerAddress);
    console.log("msd controller address is: ", msdController.address, "\n");

    for (index in assetsToDeploy) {
        let asset = (assetsToDeploy[index]).toLowerCase();
        // check the token to deploy whether is valid or not.
        if (!contractAddresses.hasOwnProperty(asset)) {
            console.log("\n Please set token address for underlying: ", asset, "\n");
            continue;
        }
        let assetConfig = allReservesConfigs[currentNet][asset];

        let msdsAddress = contractAddresses[asset].MSDS;
        // deploy MSD Saving Rate contract
        let msdsToken = await deployMSDSContract(assetConfig, asset, msdController, fixedInterestModel, msdsAddress, commonConfigs);
        console.log(asset, "MSDS contract address is: ", msdsToken.address, "\n");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
