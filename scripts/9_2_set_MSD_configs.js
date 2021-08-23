/**
 * This script will do the following setting:
 * 1) Add xUSD tokens to MSD Controller's token list.
 * 2) Set MSD Controller as the only minter of the MSD token.
 * 3) Set borrow rate for iMSD token.
 * 4) Set supply rate for xMSDS token.
 */

const { network } = require("hardhat");
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
let tx;


async function main() {
    [deployer] = await ethers.getSigners();
    console.log("\nDeploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

    // get msd controller contract
    let msdControllerAddress = commonConfigs.msdController;
    if (!msdControllerAddress) {
        console.log("Do not get a valid msd controller contract address!");
        return;
    }
    console.log("\nMSD controller contract has been deployed");
    let msdControllerFactory = await ethers.getContractFactory("MSDController");
    let msdController = msdControllerFactory.attach(msdControllerAddress);
    console.log("msd controller address is: ", msdController.address, "\n");

    // get fixed interest model contract
    let fixedInterestModelAddress = commonConfigs.fixedInterestModel;
    if (!fixedInterestModelAddress) {
        console.log("Do not get a valid fixed interest model contract address!");
        return;
    }
    let fixedInterestModelFactory = await ethers.getContractFactory("FixedInterestRateModel");
    let fixedInterestModel = fixedInterestModelFactory.attach(fixedInterestModelAddress);
    console.log("fixed interest model contract address is: ", fixedInterestModel.address, "\n");


    for (index in assetsToDeploy) {
        let asset = (assetsToDeploy[index]).toLowerCase();
        let assetConfig = allReservesConfigs[currentNet][asset];
        // check the token to deploy whether is valid or not.
        if (!contractAddresses.hasOwnProperty(asset)) {
            console.log("\n Please set token address config: ", asset, "\n");
            continue;
        }

        let msdTokenAddress = contractAddresses[asset].token;
        if (!msdTokenAddress) {
            console.log("\nDo not get a valid MSD token address", asset);
            return;
        }
        let msdTokenFactory = await ethers.getContractFactory("MSD");
        let msdToken = msdTokenFactory.attach(msdTokenAddress);

        let imsdTokenAddress = contractAddresses[asset].iToken;
        if (!imsdTokenAddress) {
            console.log("\nDo not get a valid iToken address", asset);
            return;
        }
        let iTokenFactory = await ethers.getContractFactory("iToken");
        let iToken = iTokenFactory.attach(imsdTokenAddress);

        let msdsTokenAddress = contractAddresses[asset].MSDS;
        if (!msdsTokenAddress) {
            console.log("\nDo not get a valid MSDS token address", asset);
            return;
        }
        let msdsTokenFactory = await ethers.getContractFactory("MSDS");
        let msdsToken = msdsTokenFactory.attach(msdsTokenAddress);

        // Add MSD tokens to MSD Controller's token list
        console.log("\ngoing to set MSD minter")
        tx = await msdController._addMSD(msdTokenAddress, [imsdTokenAddress, msdsTokenAddress]);
        await txWait(currentNet, tx);
        console.log(asset, " minters in MSD controller are: ", await msdController.getMSDMinters(msdTokenAddress), "\n");

        // Add MSD controller as the only minter
        console.log("\ngoing to set MSD controller as only minter");
        tx = await msdToken._addMinter(msdControllerAddress);
        await txWait(currentNet, tx);
        console.log(asset, " minters in MSD token are:      ", await msdToken.getMinters(), "\n");

        // set borrow rate for iMSD token
        let currentBorrowRate = await fixedInterestModel.borrowRatesPerBlock(imsdTokenAddress);
        let actualBorrowRate = (ethers.utils.parseEther(assetConfig.borrowRate)).div((ethers.BigNumber.from((commonConfigs.blocksPerYear).toString())));
        if (currentBorrowRate.toString() != actualBorrowRate.toString()) {
            console.log("\nset borrow rate for iMSD token");
            console.log("iMSD current borrow rate is:  ", currentBorrowRate.toString());
            console.log("iMSD to write borrow rate is: ", actualBorrowRate.toString());
            tx = await fixedInterestModel._setBorrowRate(imsdTokenAddress, actualBorrowRate);
            await txWait(currentNet, tx);
            console.log("after setting, iMSD current borrow rate is: ", actualBorrowRate.toString());
        }

        // set supply rate for iMSD token
        let currentSupplyRate = await fixedInterestModel.supplyRatesPerBlock(msdsTokenAddress);
        let actualSupplyRate = (ethers.utils.parseEther(assetConfig.supplyRate)).div(ethers.BigNumber.from((commonConfigs.blocksPerYear).toString()));
        if (currentSupplyRate.toString() != actualSupplyRate.toString()) {
            console.log("\nset suppply rate for iMSD token");
            console.log("MSDS current supply rate is:  ", currentSupplyRate.toString());
            console.log("MSDS to write supply rate is: ", actualSupplyRate.toString());
            tx = await fixedInterestModel._setSupplyRate(msdsTokenAddress, actualSupplyRate);
            await txWait(currentNet, tx);
            console.log("after setting, MSDS current supply rate is: ", actualSupplyRate.toString());
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
