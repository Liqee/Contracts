/**
 * This script will do the following setting:
 * 1) Add tokens to market in controller.
 * 2) Set price swaing in oracle.
 * 3) Set guardian in controller.
 */


const { network } = require("hardhat");

const { formatTokenAmount, formatToHumanReadable, parseTokenAmount, txWait } = require("../test/helpers/utils.js");

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

async function addToMarket(controllerContract, iToken, reserveConfig) {
    let collateralFactor = ethers.utils.parseEther(reserveConfig.collateralFactor.toString());
    let borrowFactor = ethers.utils.parseEther(reserveConfig.borrowFactor.toString());
    let supplyCapacity = await parseTokenAmount(iToken, reserveConfig.supplyCapacity);
    let borrowCapacity = await parseTokenAmount(iToken, reserveConfig.borrowCapacity);
    let distributionFactor = ethers.utils.parseEther(reserveConfig.distributionFactor.toString());
    tx = await controllerContract._addMarket(
        iToken.address,
        collateralFactor,
        borrowFactor,
        supplyCapacity,
        borrowCapacity,
        distributionFactor
    );

    await txWait(currentNet, tx);
    console.log("finish to add asset to market\n");

    if (reserveConfig.interestModelType != "fixedInterestModel") {
        console.log("\ndouble check the setting data");
        let tokenMarkets = await controllerContract.markets(iToken.address);
        console.log("contract collateral factor is: ", await formatToHumanReadable(tokenMarkets.collateralFactorMantissa));
        console.log("contract borrow factor is:     ", await formatToHumanReadable(tokenMarkets.borrowFactorMantissa));
        console.log("contract supply cap is:        ", await formatTokenAmount(iToken, tokenMarkets.supplyCapacity));
        console.log("contract borrow cacp is:       ", await formatTokenAmount(iToken, tokenMarkets.borrowCapacity), "\n");
    }
}

async function main() {
    [deployer] = await ethers.getSigners();
    console.log("\nDeploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

    let maxSwingTokens = [];
    let maxSwings = [];

    let controllerAddress = commonConfigs.controller;
    if (!controllerAddress) {
        console.log("Do not get a valid controller contract address!");
        return;
    }
    console.log("\nController contract has been deployed");
    let controllerFactory = await ethers.getContractFactory("Controller");
    let controller = controllerFactory.attach(controllerAddress);
    console.log("controller address is: ", controller.address, "\n");

    let oracleAddress = commonConfigs.oracle;
    if (!oracleAddress) {
        console.log("Do not get a valid oracle contract address!");
        return;
    }
    let oracleFactory = await ethers.getContractFactory("PriceOracle");
    let oracle = oracleFactory.attach(oracleAddress);
    console.log("oracle address is: ", oracle.address, "\n");

    // add token to the controller,
    // !!! when deploys contracts for the mainnet, should feed prices by off-line at first.!!!
    if (currentNet == "mainnet" && !commonConfigs.oracle) {
        console.log("\nPlease set oracle address in the config.");
        return;
    }

    // Add to market
    for (index in assetsToDeploy) {
        let asset = (assetsToDeploy[index]).toLowerCase();
        let assetConfig = allReservesConfigs[currentNet][asset];
        // check the token to deploy whether is valid or not.
        if (!contractAddresses.hasOwnProperty(asset)) {
            console.log("\n Please set token address config: ", asset, "\n");
            continue;
        }

        let iTokenAddress = contractAddresses[asset].iToken;
        if (!iTokenAddress) {
            console.log("\nDo not get a valid iToken address", asset);
            return;
        }
        let iTokenFactory = await ethers.getContractFactory("iToken");
        let iToken = iTokenFactory.attach(iTokenAddress);

        let tokenPriceSwing = await oracle.maxSwings(iTokenAddress);
        let defaultMaxSwing = await oracle.maxSwing();
        let priceSwing = assetConfig.priceSwing;
        let actualPriceSwing = ethers.utils.parseEther(priceSwing.toString());

        if ((tokenPriceSwing.toString() == 0 &&  defaultMaxSwing.toString() != actualPriceSwing.toString()) || tokenPriceSwing.toString() != actualPriceSwing.toString()) {
            console.log(asset, "priceSwing is", priceSwing);
            maxSwingTokens.push(iTokenAddress);
            maxSwings.push(actualPriceSwing);
        }

        let hasAdded = await controller.hasiToken(iTokenAddress);
        if (!hasAdded) {
            console.log("going to add", asset, "to the market");
            await addToMarket(controller, iToken, assetConfig);
        } else {
            console.log(asset, "has already been added to the market\n");
        }
    }

    // Set price swing
    tx = await oracle._setMaxSwingForAssetBatch(maxSwingTokens, maxSwings);
    await txWait(currentNet, tx);

    console.log("\nDouble check asset max swing");
    for (index in assetsToDeploy) {
        let asset = (assetsToDeploy[index]).toLowerCase();
        let iTokenAddress = contractAddresses[asset].iToken;
        let actualTokenPriceSwing = await oracle.maxSwings(iTokenAddress);
        console.log(asset, "actualTokenPriceSwing", await formatToHumanReadable(actualTokenPriceSwing));
    }

    // Set contract guardian.
    let guardian = commonConfigs.guardian;
    if (currentNet == 'mainnet' && !guardian) {
        console.log("\nPlease provide a guardian address for mainnet contract");
        return;
    }
    guardian = guardian ? guardian : deployer.address;
    let currentGuardian = await controller.pauseGuardian();
    if (currentGuardian.toString() == ethers.constants.AddressZero) {
        console.log("\nset guardian in controller contract");
        tx = await controller._setPauseGuardian(guardian);
        await txWait(currentNet, tx);
    }

    console.log("\ncontract guardian is: ", await controller.pauseGuardian());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
