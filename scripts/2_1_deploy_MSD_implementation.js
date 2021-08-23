const { network } = require("hardhat");

const {
    deployMSD,
} = require("../test/helpers/fixtures.js");

const allContractAddresses = require("../config/contractAddresses.js");
const allReservesConfigs = require("../config/reservesConfigs.js");
const allCommonConfigs = require("../config/commonConfig.js");

const currentNet = network.name;
console.log("current network is: ", currentNet);

let contractAddresses = allContractAddresses[currentNet];
let commonConfigs = allCommonConfigs[currentNet];
let deployer;

let toDeployMSDTokens = ['xusd_msd'];

// Use this script to deploy MSD tokens, after deploying, add token address in config.
async function main() {
    [deployer] = await ethers.getSigners();
    console.log("\nDeploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

    // deploy MSD tokens.
    for (index in toDeployMSDTokens) {
        let msdToken = (toDeployMSDTokens[index]).toLowerCase();
        // check the token to deploy whether is valid or not.
        if (!contractAddresses.hasOwnProperty(msdToken)) {
            console.log("\n Please set token address for underlying: ", msdToken, "\n");
            continue;
        }
        let assetConfig = allReservesConfigs[currentNet][msdToken];

        let msdTokenAddress = (contractAddresses[msdToken]).token;
        if (!msdTokenAddress) {
            console.log("\nDeploy a new MSD token", msdToken);

            let MSD = await deployMSD(assetConfig.msdTokenName, assetConfig.msdTokenSymbol, assetConfig.decimals, commonConfigs.msdImplementation);
            console.log(msdToken, "address is: ", MSD.address);
        } else {
            console.log("\n", msdToken, "has been deployed!");
            console.log(msdToken, "address is: ", msdTokenAddress);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
