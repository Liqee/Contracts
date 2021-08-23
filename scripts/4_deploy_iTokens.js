const { network } = require("hardhat");

const {
    deployiETH,
    deployiToken,
    deployiMSD,
    setConfigForiToken,
} = require("../test/helpers/fixtures.js");
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

async function deployiTokenContract(reserveConfig, asset, controllerAddress, interestModelAddress, iTokenAddress, configs) {
    console.log("\nDeploy iToken for ", asset);
    let iTokenContract;

    if (!iTokenAddress) {
        if (asset == "eth") {
            console.log("\nPrepare to deploy the iETH contract");
            iTokenContract = (await deployiETH(
                reserveConfig.iTokenName,
                reserveConfig.iTokenSymbol,
                controllerAddress,
                interestModelAddress
            )).iETH;
            console.log("deploy iETH contract done!");
        } else if (reserveConfig.interestModelType == "fixedInterestModel") {
            iTokenContract = await deployiMSD(
                reserveConfig.iTokenName,
                reserveConfig.iTokenSymbol,
                contractAddresses[asset].token,
                controllerAddress,
                interestModelAddress,
                configs.msdController,
                configs.imsdImplementation
            );
            console.log("deploy iMSD contract done!");
        } else {
            console.log("\nPrepare to deploy the iToken contract");
            iTokenContract = (await deployiToken(
                contractAddresses[asset].token,
                reserveConfig.iTokenName,
                reserveConfig.iTokenSymbol,
                controllerAddress,
                interestModelAddress,
                configs.iTokenImplementation
            )).iToken;
        }
    } else {
        if (asset == "eth") {
            console.log("iETH contract has been deployed");
            let iETHFactory = await ethers.getContractFactory("iETH");
            iTokenContract = iETHFactory.attach(iTokenAddress);
        } else if (reserveConfig.interestModelType == "fixedInterestModel") {
            console.log("iMSD contract has been deployed");
            let iMSDFactory = await ethers.getContractFactory("iMSD");
            iTokenContract = iMSDFactory.attach(iTokenAddress);
        } else {
            console.log(asset, " iToken contract has been deployed");
            let iTokenFactory = await ethers.getContractFactory("iToken");
            iTokenContract = iTokenFactory.attach(iTokenAddress);
        }
    }
    return iTokenContract;
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

    let nonStableInterestModel = commonConfigs.nonStableInterestModel;
    if (!nonStableInterestModel) {
        console.log("Do not get a valid non-stablecoin interest model contract address!");
        return;
    }
    let stableInterestModel = commonConfigs.stableInterestModel;
    if (!stableInterestModel) {
        console.log("Do not get a valid stablecoin interest model contract address!");
        return;
    }
    let fixedInterestModel = commonConfigs.fixedInterestModel;
    if (!fixedInterestModel) {
        console.log("Do not get a valid fixed interest model contract address!");
        return;
    }
    let iTokenImplementation = commonConfigs.iTokenImplementation;
    if (!iTokenImplementation) {
        console.log("Do not get a valid iToken implementation contract address!");
        return;
    }
    let imsdImplementation = commonConfigs.imsdImplementation;
    if (!imsdImplementation) {
        console.log("Do not get a valid iMSD implementation contract address!");
        return;
    }

    for (index in assetsToDeploy) {
        let asset = (assetsToDeploy[index]).toLowerCase();
        // check the token to deploy whether is valid or not.
        if (!contractAddresses.hasOwnProperty(asset)) {
            console.log("\n Please set token address for underlying: ", asset, "\n");
            continue;
        }
        let assetConfig = allReservesConfigs[currentNet][asset];

        // get corresponding interest mdoel contract of this iToken
        let interestModelAddress;
        let modelType = assetConfig.interestModelType;
        if (modelType == "stableInterestModel") {
            interestModelAddress = stableInterestModel;
        } else if (modelType == "nonStableInterestModel") {
            interestModelAddress = nonStableInterestModel;
        } else if (modelType == "fixedInterestModel") {
            interestModelAddress = fixedInterestModel;
        } else {
            console.log("!!!----------------------!!!")
            console.log("Please check for interest model type of this iToken", asset);
            return;
        }

        let iTokenAddress = contractAddresses[asset].iToken;
        // deploy iToken contract
        let iToken = await deployiTokenContract(assetConfig, asset, controllerAddress, interestModelAddress, iTokenAddress, commonConfigs);
        console.log(asset, "iToken address is: ", iToken.address, "\n");

        // if (modelType != "fixedInterestModel") {
        //     // set config for iToken
        //     await setConfigForiToken(
        //         iToken,
        //         assetConfig.reserveRatio,
        //         assetConfig.flashloanFeeRatio,
        //         assetConfig.protocolFeeRatio
        //     );

        //     console.log("double check the setting values: \n");
        //     let reserveRatio = await iToken.reserveRatio();
        //     console.log("contract reserve ratio is: ", await formatToHumanReadable(reserveRatio));
        //     let flashloanFeeRatio = await iToken.flashloanFeeRatio();
        //     console.log("contract flashloan fee ratio is: ", await formatToHumanReadable(flashloanFeeRatio));
        //     let protocolFeeRatio = await iToken.protocolFeeRatio();
        //     console.log("contract protocol fee ratio is: ", await formatToHumanReadable(protocolFeeRatio));
        // }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
