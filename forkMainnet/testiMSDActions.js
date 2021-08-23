const { expect } = require("chai");
const BN = require("bn.js");
const { ethers } = require("hardhat");
const allContractAddresses = require("../config/contractAddresses.js");

const MAX = ethers.constants.MaxUint256;
const BASE = ethers.utils.parseEther("1");
const ZERO = ethers.BigNumber.from("0");

let USX, EUR, xBTC, xETH;
let iMUSX, iMEUR, iMxBTC, iMxETH;
let iUSX, iEUR, ixBTC, ixETH;
let DF, iDF;
let MSDs = [];
let iMSDs = [];

let network = "mainnet";
let mainnetContractAddresses = allContractAddresses[network];
// Following account has deposited DF, and borrow some USDC, USDT.
let mocker = "0x36edB08a0C566E5f3054e91B32520a0A2e5ad699";
// Following account to can repay for others and liquidate account.
let repayer = "0x2d3Efbe93cC1CD4748242a9Ef7B9807Bfc29dAaC";
// Mock owner to set price
let ownerAddress = "0xbD206d0677BEf61f3abA309f84473fCF5C44C880";
let controllerAddress = "0x8B53Ab2c0Df3230EA327017C91Eb909f815Ad113";

let contractExecutor, liquidator, owner;
let controller;

let USXAddress = mainnetContractAddresses["xusd_msd"]["token"];
let EURAddress = mainnetContractAddresses["xeur_msd"]["token"];
let xBTCAddress = mainnetContractAddresses["xbtc_gp"]["token"];
let xETHAddress = mainnetContractAddresses["xeth_gp"]["token"];
let dfAddress = mainnetContractAddresses["df"]["token"];

let iMUSXAddress = mainnetContractAddresses["xusd_msd"]["iToken"];
let iMEURAddress = mainnetContractAddresses["xeur_msd"]["iToken"];
let iMxBTCAddress = mainnetContractAddresses["xbtc_gp"]["iToken"];
let iMxETHAddress = mainnetContractAddresses["xeth_gp"]["iToken"];
let iDFAddress = mainnetContractAddresses["df"]["iToken"];

let iUSXAddress = mainnetContractAddresses["xusd"]["iToken"];
let iEURAddress = mainnetContractAddresses["xeur"]["iToken"];
let ixBTCAddress = mainnetContractAddresses["xbtc"]["iToken"];
let ixETHAddress = mainnetContractAddresses["xeth"]["iToken"];

async function impersonatedAccount(address) {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [address],
    });
}

async function stopImpersonatingAccount(address) {
    await hre.network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: [address],
    });
}

async function initContract() {
    USX = await ethers.getContractAt("MSD", USXAddress);
    EUR = await ethers.getContractAt("MSD", EURAddress);
    xBTC = await ethers.getContractAt("MSD", xBTCAddress);
    xETH = await ethers.getContractAt("MSD", xETHAddress);
    df = await ethers.getContractAt("Token", dfAddress);
    MSDs.push(USX);
    MSDs.push(EUR);
    MSDs.push(xBTC);
    MSDs.push(xETH);

    iMUSX = await ethers.getContractAt("iMSD", iMUSXAddress);
    iMEUR = await ethers.getContractAt("iMSD", iMEURAddress);
    iMxBTC = await ethers.getContractAt("iMSD", iMxBTCAddress);
    iMxETH = await ethers.getContractAt("iMSD", iMxETHAddress);
    iMSDs.push(iMUSX);
    iMSDs.push(iMEUR);
    iMSDs.push(iMxBTC);
    iMSDs.push(iMxETH);

    iUSX = await ethers.getContractAt("iToken", iUSXAddress);
    iEUR = await ethers.getContractAt("iToken", iEURAddress);
    ixBTC = await ethers.getContractAt("iToken", ixBTCAddress);
    ixETH = await ethers.getContractAt("iToken", ixETHAddress);
    iDF = await ethers.getContractAt("iToken", iDFAddress);

    controller = await ethers.getContractAt("Controller", controllerAddress);
}


describe("Simulate all actions in iMSD contract of general pool", function () {
    before(async function () {
        await initContract();
    });

    it("Borrow and repay MSD token", async function () {
        let borrowAmount = ethers.utils.parseEther("0.1");
        let repayAmount = ethers.utils.parseEther("0.01");
        await impersonatedAccount(mocker);
        contractExecutor = await ethers.provider.getSigner(mocker);
        console.log("executor address is: ", contractExecutor._address);
        let iDFBalance = await iDF.balanceOf(mocker);
        console.log("iDFBalance", iDFBalance.toString());

        let alliMTokensLength = iMSDs.length;
        for (let i = 0; i < alliMTokensLength; i++) {
            let iMToken = iMSDs[i];
            let MSD = MSDs[i];
            console.log("MSD address is: ", MSD.address);

            let beforeUserMSDBalance = await MSD.balanceOf(mocker);
            console.log("Before borrowing MSD, user balance is: ", beforeUserMSDBalance.toString());

            await iMToken.connect(contractExecutor).borrow(borrowAmount);

            let afterUserMSDBalance = await MSD.balanceOf(mocker);
            console.log("After borrowing MSD, user balance is:  ", afterUserMSDBalance.toString(), "\n");

            await MSD.connect(contractExecutor).approve(iMToken.address, MAX);
            await iMToken.connect(contractExecutor).repayBorrow(repayAmount);
            let afterRepayUserMSDBalance = await MSD.balanceOf(mocker);
            console.log("After repaying MSD, user balance is:   ", afterRepayUserMSDBalance.toString(), "\n");
        }

        await stopImpersonatingAccount(mocker);
    });

    it("Repay borrow for others", async function () {
        let borrowAmount = ethers.utils.parseEther("0.1");
        let repayAmount = ethers.utils.parseEther("0.05");
        await impersonatedAccount(repayer);
        liquidator = await ethers.provider.getSigner(repayer);
        console.log("executor address is: ", liquidator._address);

        let alliMTokensLength = iMSDs.length;
        for (let i = 0; i < alliMTokensLength; i++) {
            let iMToken = iMSDs[i];
            let MSD = MSDs[i];

            let beforeUserMSDBalance = await MSD.balanceOf(liquidator._address);
            console.log("Before borrowing MSD, user balance is: ", beforeUserMSDBalance.toString());

            await iMToken.connect(liquidator).borrow(borrowAmount);

            let afterUserMSDBalance = await MSD.balanceOf(liquidator._address);
            console.log("After borrowing MSD, user balance is:  ", afterUserMSDBalance.toString(), "\n");

            await MSD.connect(liquidator).approve(iMToken.address, MAX);
            await iMToken.connect(liquidator).repayBorrowBehalf(mocker, repayAmount);
            let afterRepayUserMSDBalance = await MSD.balanceOf(liquidator._address);
            console.log("After repaying MSD for others, liquidator balance is:   ", afterRepayUserMSDBalance.toString());

            let afterRepayBorrowUserMSDBalance = await iMToken.borrowBalanceStored(mocker);
            console.log("After repaying MSD, user balance is:   ", afterRepayBorrowUserMSDBalance.toString(), "\n");
        }
        await stopImpersonatingAccount(repayer);
    });

    it("Liquidate borrow", async function () {
        let liquidateAmount = ethers.utils.parseEther("0.01");
        // Mock owner account to set collateral fator to zero.
        await impersonatedAccount(ownerAddress);
        owner = await ethers.provider.getSigner(ownerAddress);

        // Cause executor deposited DF, so set collateral factor of DF as 0 to make liquidation.
        await controller.connect(owner)._setCollateralFactor(iDF.address, ZERO);
        let iDFDetails = await controller.markets(iDF.address);
        console.log("iDF collateral factor is: ", iDFDetails.collateralFactorMantissa.toString());
        expect(iDFDetails.collateralFactorMantissa).to.equal(ZERO);
        await stopImpersonatingAccount(ownerAddress);

        // Liquidate
        await impersonatedAccount(repayer);
        let alliMTokensLength = iMSDs.length;
        for (let i = 0; i < alliMTokensLength; i++) {
            let iMToken = iMSDs[i];
            let MSD = MSDs[i];

            let beforeUserMSDBorrowedBalance = await iMToken.borrowBalanceStored(mocker);
            console.log("Before liquidating MSD, user borrowed balance is:  ", beforeUserMSDBorrowedBalance.toString());
            let beforeiDFBalance = await iDF.balanceOf(liquidator._address);
            console.log("Before liquidating MSD, liquidator iDF balance is: ", beforeiDFBalance.toString());

            await iMToken.connect(liquidator).liquidateBorrow(mocker, liquidateAmount, iDF.address);

            let afterUserMSDBorrowedBalance = await iMToken.borrowBalanceStored(mocker);
            console.log("After  liquidating MSD, user borrowed balance is:  ", afterUserMSDBorrowedBalance.toString());
            let afteriDFBalance = await iDF.balanceOf(liquidator._address);
            console.log("After liquidating MSD, liquidator iDF balance is:  ", afteriDFBalance.toString(), "\n");

        }
        await stopImpersonatingAccount(repayer);
    });
});
