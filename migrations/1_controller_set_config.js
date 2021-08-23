
// Right click on the script name and hit "Run" to execute
(async () => {
    try {
      console.log("Running deployWithEthers script...");

      const contractName = "ControllerV2"; // Change this for other contract
      let tx;

      // Note that the script needs the ABI which is generated from the compilation artifact.
      // Make sure contract is compiled and artifacts are generated
      const artifactsPath = `browser/artifacts/contracts/${contractName}.sol/${contractName}.json`; // Change this for different path
      const controllerAddress = "0x8B53Ab2c0Df3230EA327017C91Eb909f815Ad113";
      const newOracleAddress = "0x34BAf46eA5081e3E49c29fccd8671ccc51e61E79";

      const metadata = JSON.parse(
        await remix.call("fileManager", "getFile", artifactsPath)
      );

      // 'web3Provider' is a remix global variable object
      const signer = new ethers.providers.Web3Provider(web3Provider).getSigner();

      const controller = new ethers.Contract(controllerAddress, metadata.abi, signer);
      console.log("Controller contract address: ", controller.address);

      //---------------------------
      //------Set New Oracle-------
      //---------------------------
      let oracleContractAddr = await controller.priceOracle();
      console.log("Controller old oracle is: ", oracleContractAddr);
      console.log("Going to set new oracle: ", newOracleAddress);

      tx = await controller._setPriceOracle(newOracleAddress);
      await tx.wait(1);

      oracleContractAddr = await controller.priceOracle();
      console.log("Controller new oracle is: ", oracleContractAddr);

      //--------------------------------
      //------Set config for WBTC-------
      //--------------------------------
      const iWBTCAddress = "0x5812fCF91adc502a765E5707eBB3F36a07f63c02";
      const wbtcNewSupplyCap = ethers.utils.parseUnits("3000", 8);
      let wbtcNewBorrowCap = wbtcNewSupplyCap;

      let wbtcInfo = await controller.markets(iWBTCAddress);
      console.log("iWBTC old supply cap is: ", (wbtcInfo.supplyCapacity).toString());
      console.log("Going to set new supply cap for iWBTC: ", wbtcNewSupplyCap.toString());

      tx = await controller._setSupplyCapacity(iWBTCAddress, wbtcNewSupplyCap);
      await tx.wait(1);

      wbtcInfo = await controller.markets(iWBTCAddress);
      console.log("iWBTC new supply cap is: ", (wbtcInfo.supplyCapacity).toString());

      wbtcInfo = await controller.markets(iWBTCAddress);
      console.log("iWBTC old borrow cap is: ", (wbtcInfo.borrowCapacity).toString());
      console.log("Going to set new borrow cap for iWBTC: ", wbtcNewBorrowCap.toString());

      tx = await controller._setBorrowCapacity(iWBTCAddress, wbtcNewBorrowCap);
      await tx.wait(1);

      wbtcInfo = await controller.markets(iWBTCAddress);
      console.log("iWBTC new borrow cap is: ", (wbtcInfo.borrowCapacity).toString());

      //--------------------------------
      //------Set config for ETH-------
      //--------------------------------
      const iETHAddress = "0x5ACD75f21659a59fFaB9AEBAf350351a8bfaAbc0";
      const ethNewBorrowCap = ethers.utils.parseEther("40000");

      let ethInfo = await controller.markets(iETHAddress);
      console.log("iETH old supply cap is: ", (ethInfo.supplyCapacity).toString());

      ethInfo = await controller.markets(iETHAddress);
      console.log("iETH old borrow cap is: ", (ethInfo.borrowCapacity).toString());
      console.log("Going to set new borrow cap for iETH: ", ethNewBorrowCap.toString());

      tx = await controller._setBorrowCapacity(iETHAddress, ethNewBorrowCap);
      await tx.wait(1);

      ethInfo = await controller.markets(iETHAddress);
      console.log("iETH new borrow cap is: ", (ethInfo.borrowCapacity).toString());

      //--------------------------------
      //------Set config for USDT-------
      //--------------------------------
      const iUSDTAddress = "0x1180c114f7fAdCB6957670432a3Cf8Ef08Ab5354";
      const usdtNewSupplyCap = ethers.utils.parseUnits("50000000", 6);
      let usdtNewBorrowCap = usdtNewSupplyCap;

      let usdtInfo = await controller.markets(iUSDTAddress);
      console.log("iUSDT old supply cap is: ", (usdtInfo.supplyCapacity).toString());
      console.log("Going to set new supply cap for iUSDT: ", usdtNewSupplyCap.toString());

      tx = await controller._setSupplyCapacity(iUSDTAddress, usdtNewSupplyCap);
      await tx.wait(1);

      usdtInfo = await controller.markets(iUSDTAddress);
      console.log("iUSDT new supply cap is: ", (usdtInfo.supplyCapacity).toString());

      usdtInfo = await controller.markets(iUSDTAddress);
      console.log("iUSDT old borrow cap is: ", (usdtInfo.borrowCapacity).toString());
      console.log("Going to set new borrow cap for iUSDT: ", usdtNewBorrowCap.toString());

      tx = await controller._setBorrowCapacity(iUSDTAddress, usdtNewBorrowCap);
      await tx.wait(1);

      usdtInfo = await controller.markets(iUSDTAddress);
      console.log("iUSDT new borrow cap is: ", (usdtInfo.borrowCapacity).toString());

      //--------------------------------
      //------Set config for USDC-------
      //--------------------------------
      const iUSDCAddress = "0x2f956b2f801c6dad74E87E7f45c94f6283BF0f45";
      const usdcNewSupplyCap = ethers.utils.parseUnits("50000000", 6);
      let usdcNewBorrowCap = usdcNewSupplyCap;

      let usdcInfo = await controller.markets(iUSDCAddress);
      console.log("iUSDC old supply cap is: ", (usdcInfo.supplyCapacity).toString());
      console.log("Going to set new supply cap for iUSDC: ", usdcNewSupplyCap.toString());

      tx = await controller._setSupplyCapacity(iUSDCAddress, usdcNewSupplyCap);
      await tx.wait(1);

      usdcInfo = await controller.markets(iUSDCAddress);
      console.log("iUSDC new supply cap is: ", (usdcInfo.supplyCapacity).toString());

      usdcInfo = await controller.markets(iUSDCAddress);
      console.log("iUSDC old borrow cap is: ", (usdcInfo.borrowCapacity).toString());
      console.log("Going to set new borrow cap for iUSDC: ", usdcNewBorrowCap.toString());

      tx = await controller._setBorrowCapacity(iUSDCAddress, usdcNewBorrowCap);
      await tx.wait(1);

      usdcInfo = await controller.markets(iUSDCAddress);
      console.log("iUSDC new borrow cap is: ", (usdcInfo.borrowCapacity).toString());

      //--------------------------------
      //------Set config for DAI-------
      //--------------------------------
      const iDAIAddress = "0x298f243aD592b6027d4717fBe9DeCda668E3c3A8";
      const daiNewSupplyCap = ethers.utils.parseEther("50000000");
      let daiNewBorrowCap = daiNewSupplyCap;

      let daiInfo = await controller.markets(iDAIAddress);
      console.log("iDAI old supply cap is: ", (daiInfo.supplyCapacity).toString());
      console.log("Going to set new supply cap for iDAI: ", daiNewSupplyCap.toString());

      tx = await controller._setSupplyCapacity(iDAIAddress, daiNewSupplyCap);
      await tx.wait(1);

      daiInfo = await controller.markets(iDAIAddress);
      console.log("iDAI new supply cap is: ", (daiInfo.supplyCapacity).toString());

      daiInfo = await controller.markets(iDAIAddress);
      console.log("iDAI old borrow cap is: ", (daiInfo.borrowCapacity).toString());
      console.log("Going to set new borrow cap for iDAI: ", daiNewBorrowCap.toString());

      tx = await controller._setBorrowCapacity(iDAIAddress, daiNewBorrowCap);
      await tx.wait(1);

      daiInfo = await controller.markets(iDAIAddress);
      console.log("iDAI new borrow cap is: ", (daiInfo.borrowCapacity).toString());

      //--------------------------------
      //------Set config for BUSD-------
      //--------------------------------
      const iBUSDAddress = "0x24677e213DeC0Ea53a430404cF4A11a6dc889FCe";
      const busdNewSupplyCap =ethers. utils.parseEther("20000000");
      let busdNewBorrowCap = busdNewSupplyCap;

      let busdInfo = await controller.markets(iBUSDAddress);
      console.log("iBUSD old supply cap is: ", (busdInfo.supplyCapacity).toString());
      console.log("Going to set new supply cap for iBUSD: ", busdNewSupplyCap.toString());

      tx = await controller._setSupplyCapacity(iBUSDAddress, busdNewSupplyCap);
      await tx.wait(1);

      busdInfo = await controller.markets(iBUSDAddress);
      console.log("iBUSD new supply cap is: ", (busdInfo.supplyCapacity).toString());

      busdInfo = await controller.markets(iBUSDAddress);
      console.log("iBUSD old borrow cap is: ", (busdInfo.borrowCapacity).toString());
      console.log("Going to set new borrow cap for iBUSD: ", busdNewBorrowCap.toString());

      tx = await controller._setBorrowCapacity(iBUSDAddress, busdNewBorrowCap);
      await tx.wait(1);

      busdInfo = await controller.markets(iBUSDAddress);
      console.log("iBUSD new borrow cap is: ", (busdInfo.borrowCapacity).toString());

      //--------------------------------
      //------Set config for DF-------
      //--------------------------------
      const iDFAddress = "0xb3dc7425e63E1855Eb41107134D471DD34d7b239";
      const dfNewSupplyCap = ethers.utils.parseEther("200000000");
      let dfNewBorrowCap = dfNewSupplyCap;

      let dfInfo = await controller.markets(iDFAddress);
      console.log("iDF old supply cap is: ", (dfInfo.supplyCapacity).toString());
      console.log("Going to set new supply cap for iDF: ", dfNewSupplyCap.toString());

      tx = await controller._setSupplyCapacity(iDFAddress, dfNewSupplyCap);
      await tx.wait(1);

      dfInfo = await controller.markets(iDFAddress);
      console.log("iDF new supply cap is: ", (dfInfo.supplyCapacity).toString());

      dfInfo = await controller.markets(iDFAddress);
      console.log("iDF old borrow cap is: ", (dfInfo.borrowCapacity).toString());
      console.log("Going to set new borrow cap for iDF: ", dfNewBorrowCap.toString());

      tx = await controller._setBorrowCapacity(iDFAddress, dfNewBorrowCap);
      await tx.wait(1);

      dfInfo = await controller.markets(iDFAddress);
      console.log("iDF new borrow cap is: ", (dfInfo.borrowCapacity).toString());

      const dfNewCollateralFactor = ethers.utils.parseEther("0.6");

      dfInfo = await controller.markets(iDFAddress);
      console.log("iDF old collateral factor is: ", (dfInfo.collateralFactorMantissa).toString());
      console.log("Going to set new collateral factor for iDF: ", dfNewCollateralFactor.toString());

      tx = await controller._setCollateralFactor(iDFAddress, dfNewCollateralFactor);
      await tx.wait(1);

      dfInfo = await controller.markets(iDFAddress);
      console.log("iDF new collateral factor is: ", (dfInfo.collateralFactorMantissa).toString());

      console.log("Done!");
    } catch (e) {
      console.log(e.message);
    }
  })();
