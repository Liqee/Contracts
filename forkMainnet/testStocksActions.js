const { expect } = require("chai");
const BN = require("bn.js");
const { ethers } = require("hardhat");
const allContractAddresses = require("../config/contractAddresses.js");

const MAX = ethers.constants.MaxUint256;
const BASE = ethers.utils.parseEther("1");
const ZERO = ethers.BigNumber.from("0");

let USX, EUR;
let iMUSX, iMEUR;
let iUSX, iEUR;
let DF, iDF;
let stockUSX, stockEUX;
let xTSLA, xAPPL, xAMZN, xCOIN;
let ixTSLA, ixAPPL, ixAMZN, ixCOIN;
let MSDs = [];
let iMSDs = [];
let iTokens = [];
let collateralMSDs = [];
let iCollateralTokens = [];

let network = "mainnet";
let mainnetContractAddresses = allContractAddresses[network];
// Following account has deposited DF, and borrow some USDC, USDT.
let mocker = "0x36edB08a0C566E5f3054e91B32520a0A2e5ad699";
// Following account to can repay for others and liquidate account.
let repayer = "0x2d3Efbe93cC1CD4748242a9Ef7B9807Bfc29dAaC";
// Mock controller owner of the stock pool to set collateral factor
let ownerAddress = "0x6F43161E3A56501ea14B2901132A4d9F0945E179";
let controllerAddress = "0x3bA6e5e5dF88b9A88B2c19449778A4754170EA17";
let oracleAddress = "0x34BAf46eA5081e3E49c29fccd8671ccc51e61E79";

const marketOpenTime = 48600; // 21:30 UTC+8
const marketEndTime = 14400; // 04:00 UTC+8
const period = 86400; // 60*60*24

let contractExecutor, liquidator, owner;
let controller, oracle;

let USXAddress = mainnetContractAddresses["xusd_msd"]["token"];
let EURAddress = mainnetContractAddresses["xeur_msd"]["token"];
let dfAddress = mainnetContractAddresses["df"]["token"];

let iMUSXAddress = mainnetContractAddresses["xusd_msd"]["iToken"];
let iMEURAddress = mainnetContractAddresses["xeur_msd"]["iToken"];
let iDFAddress = mainnetContractAddresses["df"]["iToken"];

let stockUSXAddress = mainnetContractAddresses["xusd_sp"]["iToken"];
let stockEUXAddress = mainnetContractAddresses["xeur_sp"]["iToken"];

let xTSLAAddress = mainnetContractAddresses["xtsla_msd"]["token"];
let xAPPLAddress = mainnetContractAddresses["xappl_msd"]["token"];
let xAMZNAddress = mainnetContractAddresses["amazon_msd"]["token"];
let xCOINAddress = mainnetContractAddresses["coinbase_msd"]["token"];

let ixTSLAAddress = mainnetContractAddresses["xtsla_msd"]["iToken"];
let ixAPPLAddress = mainnetContractAddresses["xappl_msd"]["iToken"];
let ixAMZNAddress = mainnetContractAddresses["amazon_msd"]["iToken"];
let ixCOINAddress = mainnetContractAddresses["coinbase_msd"]["iToken"];

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

async function increaseBlock(blockNumber) {
  await hre.network.provider.request({
    method: "evm_mine",
    params: [],
  });
}

async function increaseTime(time) {
  await hre.network.provider.request({
    method: "evm_setNextBlockTimestamp",
    params: [time],
  });
}

async function initContract() {
  USX = await ethers.getContractAt("MSD", USXAddress);
  EUR = await ethers.getContractAt("MSD", EURAddress);
  df = await ethers.getContractAt("Token", dfAddress);
  collateralMSDs.push(USX);
  collateralMSDs.push(EUR);

  iMUSX = await ethers.getContractAt("iMSD", iMUSXAddress);
  iMEUR = await ethers.getContractAt("iMSD", iMEURAddress);
  iCollateralTokens.push(iMUSX);
  iCollateralTokens.push(iMEUR);

  stockUSX = await ethers.getContractAt("iToken", stockUSXAddress);
  stockEUX = await ethers.getContractAt("iToken", stockEUXAddress);
  iTokens.push(stockUSX);
  iTokens.push(stockEUX);

  xTSLA = await ethers.getContractAt("MSD", xTSLAAddress);
  xAPPL = await ethers.getContractAt("MSD", xAPPLAddress);
  xAMZN = await ethers.getContractAt("MSD", xAMZNAddress);
  xCOIN = await ethers.getContractAt("MSD", xCOINAddress);
  MSDs.push(xTSLA);
  MSDs.push(xAPPL);
  MSDs.push(xAMZN);
  MSDs.push(xCOIN);

  ixTSLA = await ethers.getContractAt("iMSD", ixTSLAAddress);
  ixAPPL = await ethers.getContractAt("iMSD", ixAPPLAddress);
  ixAMZN = await ethers.getContractAt("iMSD", ixAMZNAddress);
  ixCOIN = await ethers.getContractAt("iMSD", ixCOINAddress);
  iMSDs.push(ixTSLA);
  iMSDs.push(ixAPPL);
  iMSDs.push(ixAMZN);
  iMSDs.push(ixCOIN);

  controller = await ethers.getContractAt("Controller", controllerAddress);
  oracle = await ethers.getContractAt("StatusOracle", oracleAddress);
}

describe("Simulate all actions in iMSD contract of stock pool", function () {
  before(async function () {
    await initContract();
  });

  it("Borrow USX and EUX to deposit in the stock pool", async function () {
    let borrowAmount = ethers.utils.parseEther("5000");
    await impersonatedAccount(mocker);
    contractExecutor = await ethers.provider.getSigner(mocker);
    console.log("executor address is: ", contractExecutor._address);

    let allCollateralLength = iCollateralTokens.length;
    for (let i = 0; i < allCollateralLength; i++) {
      let iMToken = iCollateralTokens[i];
      let MSD = collateralMSDs[i];
      let iToken = iTokens[i];

      let beforeBorrowMSDBalance = await MSD.balanceOf(
        contractExecutor._address
      );
      console.log(
        "Before borrowing, user msd balance is:",
        beforeBorrowMSDBalance.toString()
      );
      await iMToken.connect(contractExecutor).borrow(borrowAmount);
      await MSD.connect(contractExecutor).approve(iToken.address, MAX);

      let afterBorrowMSDBalance = await MSD.balanceOf(
        contractExecutor._address
      );
      console.log(
        "After borrowing, user msd balance is: ",
        afterBorrowMSDBalance.toString(),
        "\n"
      );
    }
  });

  it("Deposit USX and EUX as collateral", async function () {
    let supplyAmount = ethers.utils.parseEther("4500");
    let withdrawAmount = ethers.utils.parseEther("100");

    let alliTokensLength = iTokens.length;
    for (let i = 0; i < alliTokensLength; i++) {
      let MSD = collateralMSDs[i];
      let iToken = iTokens[i];

      let beforeMintMSDBalance = await MSD.balanceOf(contractExecutor._address);
      console.log(
        "before minting, MSD balance is:      ",
        beforeMintMSDBalance.toString()
      );
      let beforeMintiTokenBalance = await iToken.balanceOf(
        contractExecutor._address
      );
      console.log(
        "before minting, iToken balance is:   ",
        beforeMintiTokenBalance.toString()
      );
      await iToken
        .connect(contractExecutor)
        .mint(contractExecutor._address, supplyAmount);
      let afterMintMSDBalance = await MSD.balanceOf(contractExecutor._address);
      console.log(
        "after  minting, MSD balance is:      ",
        afterMintMSDBalance.toString()
      );
      let afterMintiTokenBalance = await iToken.balanceOf(
        contractExecutor._address
      );
      console.log(
        "after  minting, iToken balance is:   ",
        afterMintiTokenBalance.toString()
      );

      await iToken
        .connect(contractExecutor)
        .redeem(contractExecutor._address, withdrawAmount);
      let afterRedeemMSDBalance = await MSD.balanceOf(
        contractExecutor._address
      );
      console.log(
        "after  redeeming, MSD balance is:    ",
        afterRedeemMSDBalance.toString()
      );
      let afterReddemiTokenBalance = await iToken.balanceOf(
        contractExecutor._address
      );
      console.log(
        "after  redeeming, iToken balance is: ",
        afterReddemiTokenBalance.toString()
      );

      await iToken
        .connect(contractExecutor)
        .redeemUnderlying(contractExecutor._address, withdrawAmount);
      let afterRedeemUnderlyingMSDBalance = await MSD.balanceOf(
        contractExecutor._address
      );
      console.log(
        "Redeem underlying, MSD balance is:   ",
        afterRedeemUnderlyingMSDBalance.toString()
      );
      let afterRedeemUnderlyingiTokenBalance = await iToken.balanceOf(
        contractExecutor._address
      );
      console.log(
        "Redeem underlying, iToken balance is:",
        afterRedeemUnderlyingiTokenBalance.toString()
      );

      await controller.connect(contractExecutor).enterMarkets([iToken.address]);
      let enterMarkets = await controller.getEnteredMarkets(
        contractExecutor._address
      );
      console.log("User has collateral is: ", enterMarkets.length, "\n");
      // await oracle.status.getAssetPriceStatus
    }
  });

  it("Borrow and repay MSD token when market is open", async function () {
    let mockPassedTime = 0;
    let currentTime = Date.parse(new Date()) / 1000;
    let relativeTime = currentTime % period;
    console.log("Related time is: ", relativeTime.toString());
    let marketIsOpen = await oracle.getAssetPriceStatus(ixTSLA.address);
    console.log("Market is open: ", marketIsOpen);
    if (!marketIsOpen) {
      mockPassedTime = marketOpenTime - relativeTime;
      await increaseTime(mockPassedTime + currentTime + 60);
      await increaseBlock(100);
    }

    // let n = await ethers.provider.getBlockNumber()
    // let block = await ethers.provider.getBlock(n)
    // console.log("time stamp", block.timestamp);

    marketIsOpen = await oracle.getAssetPriceStatus(ixTSLA.address);
    console.log("Market is open: ", marketIsOpen);
    expect(marketIsOpen).to.equal(true);

    let borrowAmount = ethers.utils.parseEther("0.1");
    let repayAmount = ethers.utils.parseEther("0.01");

    let alliMSDTokenLength = iMSDs.length;
    for (let i = 0; i < alliMSDTokenLength; i++) {
      let iMSD = iMSDs[i];
      let MSD = MSDs[i];

      let beforeBorrowUserMSDTokenBalance = await MSD.balanceOf(mocker);
      console.log(
        "Before borrowing MSD, user MSD balance is:       ",
        beforeBorrowUserMSDTokenBalance.toString()
      );
      let beforeBorrowUserBorrowediTokenBalance = await iMSD.borrowBalanceStored(
        mocker
      );
      console.log(
        "Before borrowing MSD, user borrowed balance is:  ",
        beforeBorrowUserBorrowediTokenBalance.toString()
      );

      await iMSD.connect(contractExecutor).borrow(borrowAmount);

      let afterBorrowUserMSDTokenBalance = await MSD.balanceOf(mocker);
      console.log(
        "After borrowing MSD, user MSD balance is:        ",
        afterBorrowUserMSDTokenBalance.toString()
      );
      let afterBorrowUserBorrowediTokenBalance = await iMSD.borrowBalanceStored(
        mocker
      );
      console.log(
        "After borrowing MSD, user borrowed balance is:   ",
        afterBorrowUserBorrowediTokenBalance.toString()
      );

      await MSD.connect(contractExecutor).approve(iMSD.address, MAX);
      await iMSD.connect(contractExecutor).repayBorrow(repayAmount);

      let afterRepayedUserMSDTokenBalance = await MSD.balanceOf(mocker);
      console.log(
        "After repay borrow MSD, user MSD balance is:     ",
        afterRepayedUserMSDTokenBalance.toString()
      );
      let afterRepayedUserBorrowediTokenBalance = await iMSD.borrowBalanceStored(
        mocker
      );
      console.log(
        "After repay borrow MSD, user borrowed balance is:",
        afterRepayedUserBorrowediTokenBalance.toString(),
        "\n"
      );
    }
  });

  it("Repay borrow for others", async function () {
    let transferAmount = ethers.utils.parseEther("0.03");
    let repayAmount = ethers.utils.parseEther("0.01");

    let alliMSDTokenLength = iMSDs.length;
    for (let i = 0; i < alliMSDTokenLength; i++) {
      let MSD = MSDs[i];

      await MSD.connect(contractExecutor).transfer(repayer, transferAmount);
    }

    await stopImpersonatingAccount(mocker);
    await impersonatedAccount(repayer);
    liquidator = await ethers.provider.getSigner(repayer);

    for (let j = 0; j < alliMSDTokenLength; j++) {
      let iMSD = iMSDs[j];
      let MSD = MSDs[j];

      let beforeRepayBorrowLiquidatorMSDTokenBalance = await MSD.balanceOf(
        liquidator._address
      );
      console.log(
        "Before repay borrow MSD, liquidator MSD balance is: ",
        beforeRepayBorrowLiquidatorMSDTokenBalance.toString()
      );
      let beforeRepayBorrowUserBorrowediTokenBalance = await iMSD.borrowBalanceStored(
        mocker
      );
      console.log(
        "Before repay borrow MSD, user borrowed balance is:  ",
        beforeRepayBorrowUserBorrowediTokenBalance.toString()
      );

      console.log(
        "Going to repay borrow amount:                       ",
        repayAmount.toString()
      );
      await MSD.connect(liquidator).approve(iMSD.address, MAX);
      await iMSD.connect(liquidator).repayBorrowBehalf(mocker, repayAmount);

      let afterRepayBorrowLiquidatorMSDTokenBalance = await MSD.balanceOf(
        liquidator._address
      );
      console.log(
        "After repay borrow MSD, liquidator MSD balance is:  ",
        afterRepayBorrowLiquidatorMSDTokenBalance.toString()
      );
      let afterRepayBorrowUserBorrowediTokenBalance = await iMSD.borrowBalanceStored(
        mocker
      );
      console.log(
        "After repay borrow MSD, user borrowed balance is:   ",
        afterRepayBorrowUserBorrowediTokenBalance.toString(),
        "\n"
      );
    }
    await stopImpersonatingAccount(repayer);
  });

  it("Liquidate borrow", async function () {
    let liquidateAmount = ethers.utils.parseEther("0.001");
    // Mock owner account to set collateral fator to zero.
    await impersonatedAccount(ownerAddress);
    owner = await ethers.provider.getSigner(ownerAddress);

    // Cause executor deposited DF, so set collateral factor of DF as 0 to make liquidation.
    await controller
      .connect(owner)
      ._setCollateralFactor(stockUSX.address, ZERO);
    await controller
      .connect(owner)
      ._setCollateralFactor(stockEUX.address, ZERO);
    let stockUSXDetails = await controller.markets(stockUSX.address);
    console.log(
      "stockUSX collateral factor is: ",
      stockUSXDetails.collateralFactorMantissa.toString()
    );
    expect(stockUSXDetails.collateralFactorMantissa).to.equal(ZERO);
    await stopImpersonatingAccount(ownerAddress);

    // Liquidate
    await impersonatedAccount(repayer);
    let alliMTokensLength = iMSDs.length;
    for (let i = 0; i < alliMTokensLength; i++) {
      let iMSD = iMSDs[i];

      let beforeUserMSDBorrowedBalance = await iMSD.borrowBalanceStored(mocker);
      console.log(
        "Before liquidating MSD, user borrowed balance is:       ",
        beforeUserMSDBorrowedBalance.toString()
      );
      let beforeiDFBalance = await stockUSX.balanceOf(liquidator._address);
      console.log(
        "Before liquidating MSD, liquidator stockUSX balance is: ",
        beforeiDFBalance.toString()
      );

      await iMSD
        .connect(liquidator)
        .liquidateBorrow(mocker, liquidateAmount, stockUSX.address);

      let afterUserMSDBorrowedBalance = await iMSD.borrowBalanceStored(mocker);
      console.log(
        "After  liquidating MSD, user borrowed balance is:       ",
        afterUserMSDBorrowedBalance.toString()
      );
      let afteriUSXBalance = await stockUSX.balanceOf(liquidator._address);
      console.log(
        "After liquidating MSD, liquidator stockUSX balance is:  ",
        afteriUSXBalance.toString()
      );

      let beforeiEUXBalance = await stockEUX.balanceOf(liquidator._address);
      console.log(
        "Before liquidating MSD, liquidator stockEUX balance is: ",
        beforeiEUXBalance.toString()
      );

      await iMSD
        .connect(liquidator)
        .liquidateBorrow(mocker, liquidateAmount, stockEUX.address);

      afterUserMSDBorrowedBalance = await iMSD.borrowBalanceStored(mocker);
      console.log(
        "After  liquidating MSD, user borrowed balance is:       ",
        afterUserMSDBorrowedBalance.toString()
      );
      let afteriEUXBalance = await stockEUX.balanceOf(liquidator._address);
      console.log(
        "After liquidating MSD, liquidator stockEUX balance is:  ",
        afteriEUXBalance.toString(),
        "\n"
      );
    }
    await stopImpersonatingAccount(repayer);
  });

  it("Borrow and repay MSD token when market is closed", async function () {
    let collateralFactor = ethers.utils.parseEther("0.8");
    await impersonatedAccount(ownerAddress);
    owner = await ethers.provider.getSigner(ownerAddress);

    // Cause executor deposited DF, so set collateral factor of DF as 0 to make liquidation.
    await controller
      .connect(owner)
      ._setCollateralFactor(stockUSX.address, collateralFactor);
    await controller
      .connect(owner)
      ._setCollateralFactor(stockEUX.address, collateralFactor);
    let stockUSXDetails = await controller.markets(stockUSX.address);
    console.log(
      "stockUSX collateral factor is: ",
      stockUSXDetails.collateralFactorMantissa.toString()
    );
    expect(stockUSXDetails.collateralFactorMantissa).to.equal(collateralFactor);
    await stopImpersonatingAccount(ownerAddress);

    let mockPassedTime = 0;
    let currentTime = Date.parse(new Date()) / 1000;
    let relativeTime = currentTime % period;
    console.log("Related time is: ", relativeTime.toString());
    let marketIsOpen = await oracle.getAssetPriceStatus(ixTSLA.address);
    console.log("Market is open: ", marketIsOpen);
    if (marketIsOpen) {
      mockPassedTime = (marketEndTime + period - relativeTime) % period;
      await increaseTime(mockPassedTime + currentTime + 60);
      await increaseBlock(100);
    }

    // let n = await ethers.provider.getBlockNumber()
    // let block = await ethers.provider.getBlock(n)
    // console.log("time stamp", block.timestamp);

    marketIsOpen = await oracle.getAssetPriceStatus(ixTSLA.address);
    console.log("Market is open: ", marketIsOpen);
    expect(marketIsOpen).to.equal(false);

    let borrowAmount = ethers.utils.parseEther("0.001");
    let repayAmount = ethers.utils.parseEther("0.0001");

    await impersonatedAccount(mocker);
    contractExecutor = await ethers.provider.getSigner(mocker);

    let alliMSDTokenLength = iMSDs.length;
    for (let i = 0; i < alliMSDTokenLength; i++) {
      let iMSD = iMSDs[i];
      let MSD = MSDs[i];

      await expect(
        iMSD.connect(contractExecutor).borrow(borrowAmount)
      ).to.be.revertedWith("Invalid price to calculate account equity");

      let afterBorrowUserMSDTokenBalance = await MSD.balanceOf(mocker);
      console.log(
        "After borrowing MSD, user MSD balance is:        ",
        afterBorrowUserMSDTokenBalance.toString()
      );
      let afterBorrowUserBorrowediTokenBalance = await iMSD.borrowBalanceStored(
        mocker
      );
      console.log(
        "After borrowing MSD, user borrowed balance is:   ",
        afterBorrowUserBorrowediTokenBalance.toString()
      );

      await MSD.connect(contractExecutor).approve(iMSD.address, MAX);
      await iMSD.connect(contractExecutor).repayBorrow(repayAmount);

      let afterRepayedUserMSDTokenBalance = await MSD.balanceOf(mocker);
      console.log(
        "After repay borrow MSD, user MSD balance is:     ",
        afterRepayedUserMSDTokenBalance.toString()
      );
      let afterRepayedUserBorrowediTokenBalance = await iMSD.borrowBalanceStored(
        mocker
      );
      console.log(
        "After repay borrow MSD, user borrowed balance is:",
        afterRepayedUserBorrowediTokenBalance.toString(),
        "\n"
      );
    }
  });

  it("Should be able to repay borrow for others when market is closed", async function () {
    let transferAmount = ethers.utils.parseEther("0.03");
    let repayAmount = ethers.utils.parseEther("0.01");

    let alliMSDTokenLength = iMSDs.length;
    for (let i = 0; i < alliMSDTokenLength; i++) {
      let MSD = MSDs[i];

      await MSD.connect(contractExecutor).transfer(repayer, transferAmount);
    }

    await stopImpersonatingAccount(mocker);
    await impersonatedAccount(repayer);
    liquidator = await ethers.provider.getSigner(repayer);

    for (let j = 0; j < alliMSDTokenLength; j++) {
      let iMSD = iMSDs[j];
      let MSD = MSDs[j];

      let beforeRepayBorrowLiquidatorMSDTokenBalance = await MSD.balanceOf(
        liquidator._address
      );
      console.log(
        "Before repay borrow MSD, liquidator MSD balance is: ",
        beforeRepayBorrowLiquidatorMSDTokenBalance.toString()
      );
      let beforeRepayBorrowUserBorrowediTokenBalance = await iMSD.borrowBalanceStored(
        mocker
      );
      console.log(
        "Before repay borrow MSD, user borrowed balance is:  ",
        beforeRepayBorrowUserBorrowediTokenBalance.toString()
      );

      console.log(
        "Going to repay borrow amount:                       ",
        repayAmount.toString()
      );
      await MSD.connect(liquidator).approve(iMSD.address, MAX);
      await iMSD.connect(liquidator).repayBorrowBehalf(mocker, repayAmount);

      let afterRepayBorrowLiquidatorMSDTokenBalance = await MSD.balanceOf(
        liquidator._address
      );
      console.log(
        "After repay borrow MSD, liquidator MSD balance is:  ",
        afterRepayBorrowLiquidatorMSDTokenBalance.toString()
      );
      let afterRepayBorrowUserBorrowediTokenBalance = await iMSD.borrowBalanceStored(
        mocker
      );
      console.log(
        "After repay borrow MSD, user borrowed balance is:   ",
        afterRepayBorrowUserBorrowediTokenBalance.toString(),
        "\n"
      );
    }
    await stopImpersonatingAccount(repayer);
  });

  it("Liquidate borrow should failed when market is closed", async function () {
    let liquidateAmount = ethers.utils.parseEther("0.001");
    // Mock owner account to set collateral fator to zero.
    await impersonatedAccount(ownerAddress);
    owner = await ethers.provider.getSigner(ownerAddress);

    // Cause executor deposited DF, so set collateral factor of DF as 0 to make liquidation.
    await controller
      .connect(owner)
      ._setCollateralFactor(stockUSX.address, ZERO);
    await controller
      .connect(owner)
      ._setCollateralFactor(stockEUX.address, ZERO);
    let stockUSXDetails = await controller.markets(stockUSX.address);
    console.log(
      "stockUSX collateral factor is: ",
      stockUSXDetails.collateralFactorMantissa.toString()
    );
    expect(stockUSXDetails.collateralFactorMantissa).to.equal(ZERO);
    await stopImpersonatingAccount(ownerAddress);

    // Liquidate
    await impersonatedAccount(repayer);
    let alliMTokensLength = iMSDs.length;
    for (let i = 0; i < alliMTokensLength; i++) {
      let iMSD = iMSDs[i];

      let beforeUserMSDBorrowedBalance = await iMSD.borrowBalanceStored(mocker);
      console.log(
        "Before liquidating MSD, user borrowed balance is:       ",
        beforeUserMSDBorrowedBalance.toString()
      );
      let beforeiDFBalance = await stockUSX.balanceOf(liquidator._address);
      console.log(
        "Before liquidating MSD, liquidator stockUSX balance is: ",
        beforeiDFBalance.toString()
      );

      await expect(
        iMSD
          .connect(liquidator)
          .liquidateBorrow(mocker, liquidateAmount, stockUSX.address)
      ).to.be.revertedWith("Invalid price to calculate account equity");

      let afterUserMSDBorrowedBalance = await iMSD.borrowBalanceStored(mocker);
      console.log(
        "After  liquidating MSD, user borrowed balance is:       ",
        afterUserMSDBorrowedBalance.toString()
      );
      let afteriUSXBalance = await stockUSX.balanceOf(liquidator._address);
      console.log(
        "After liquidating MSD, liquidator stockUSX balance is:  ",
        afteriUSXBalance.toString()
      );

      let beforeiEUXBalance = await stockEUX.balanceOf(liquidator._address);
      console.log(
        "Before liquidating MSD, liquidator stockEUX balance is: ",
        beforeiEUXBalance.toString()
      );

      await expect(
        iMSD
          .connect(liquidator)
          .liquidateBorrow(mocker, liquidateAmount, stockEUX.address)
      ).to.be.revertedWith("Invalid price to calculate account equity");

      afterUserMSDBorrowedBalance = await iMSD.borrowBalanceStored(mocker);
      console.log(
        "After  liquidating MSD, user borrowed balance is:       ",
        afterUserMSDBorrowedBalance.toString()
      );
      let afteriEUXBalance = await stockEUX.balanceOf(liquidator._address);
      console.log(
        "After liquidating MSD, liquidator stockEUX balance is:  ",
        afteriEUXBalance.toString(),
        "\n"
      );
    }
    await stopImpersonatingAccount(repayer);
  });
});
