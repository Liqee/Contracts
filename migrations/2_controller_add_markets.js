
// Right click on the script name and hit "Run" to execute
(async () => {
    try {
      console.log("Running deployWithEthers script...");

      const contractName = "ControllerV2"; // Change this for other contract
      let tx;

      // Note that the script needs the ABI which is generated from the compilation artifact.
      // Make sure contract is compiled and artifacts are generated
      const artifactsPath = `browser/artifacts/contracts/${contractName}.sol/${contractName}.json`; // Change this for different path
      const controllerAddress = "";

      const metadata = JSON.parse(
        await remix.call("fileManager", "getFile", artifactsPath)
      );

      // 'web3Provider' is a remix global variable object
      const signer = new ethers.providers.Web3Provider(web3Provider).getSigner();

      const controller = new ethers.Contract(controllerAddress, metadata.abi, signer);
      console.log("Controller contract address: ", controller.address);

      //-------------------------------
      //------Add iUSX to market-------
      //-------------------------------
      let iUSXAddress = "";
      let iUSXCollateralFactor = ethers.utils.parseEther("");
      let iUSXBorrowFactor = ethers.utils.parseEther("");
      let iUSXSupplyCapacity = ethers.utils.parseEther("");
      let iUSXBorrowCapacity = ethers.utils.parseEther("");
      let iUSXDistributionFactor = ethers.utils.parseEther("");

      tx = await controller._addMarket(
        iUSXAddress,
        iUSXCollateralFactor,
        iUSXBorrowFactor,
        iUSXSupplyCapacity,
        iUSXBorrowCapacity,
        iUSXDistributionFactor
      );
      await tx.wait(1);

      let tokenMarkets = await controller.markets(iUSXAddress);
      console.log("contract collateral factor is: ", (tokenMarkets.collateralFactorMantissa).toString());
      console.log("contract borrow factor is:     ", (tokenMarkets.borrowFactorMantissa).toString());
      console.log("contract supply cap is:        ", (tokenMarkets.supplyCapacity).toString());
      console.log("contract borrow cacp is:       ", (tokenMarkets.borrowCapacity).toString());

      //-------------------------------
      //------Add iEUX to market-------
      //-------------------------------
      let iEUXAddress = "";
      let iEUXCollateralFactor = ethers.utils.parseEther("");
      let iEUXBorrowFactor = ethers.utils.parseEther("");
      let iEUXSupplyCapacity = ethers.utils.parseEther("");
      let iEUXBorrowCapacity = ethers.utils.parseEther("");
      let iEUXDistributionFactor = ethers.utils.parseEther("");

      tx = await controller._addMarket(
        iEUXAddress,
        iEUXCollateralFactor,
        iEUXBorrowFactor,
        iEUXSupplyCapacity,
        iEUXBorrowCapacity,
        iEUXDistributionFactor
      );
      await tx.wait(1);

      tokenMarkets = await controller.markets(iEUXAddress);
      console.log("contract collateral factor is: ", (tokenMarkets.collateralFactorMantissa).toString());
      console.log("contract borrow factor is:     ", (tokenMarkets.borrowFactorMantissa).toString());
      console.log("contract supply cap is:        ", (tokenMarkets.supplyCapacity).toString());
      console.log("contract borrow cacp is:       ", (tokenMarkets.borrowCapacity).toString());

      //-------------------------------
      //------Add ixBTC to market-------
      //-------------------------------
      let ixBTCAddress = "";
      let ixBTCCollateralFactor = ethers.utils.parseEther("");
      let ixBTCBorrowFactor = ethers.utils.parseEther("");
      let ixBTCSupplyCapacity = ethers.utils.parseEther("");
      let ixBTCBorrowCapacity = ethers.utils.parseEther("");
      let ixBTCDistributionFactor = ethers.utils.parseEther("");

      tx = await controller._addMarket(
        ixBTCAddress,
        ixBTCCollateralFactor,
        ixBTCBorrowFactor,
        ixBTCSupplyCapacity,
        ixBTCBorrowCapacity,
        ixBTCDistributionFactor
      );
      await tx.wait(1);

      tokenMarkets = await controller.markets(ixBTCAddress);
      console.log("contract collateral factor is: ", (tokenMarkets.collateralFactorMantissa).toString());
      console.log("contract borrow factor is:     ", (tokenMarkets.borrowFactorMantissa).toString());
      console.log("contract supply cap is:        ", (tokenMarkets.supplyCapacity).toString());
      console.log("contract borrow cacp is:       ", (tokenMarkets.borrowCapacity).toString());

      //-------------------------------
      //------Add ixETH to market-------
      //-------------------------------
      let ixETHAddress = "";
      let ixETHCollateralFactor = ethers.utils.parseEther("");
      let ixETHBorrowFactor = ethers.utils.parseEther("");
      let ixETHSupplyCapacity = ethers.utils.parseEther("");
      let ixETHBorrowCapacity = ethers.utils.parseEther("");
      let ixETHDistributionFactor = ethers.utils.parseEther("");

      tx = await controller._addMarket(
        ixETHAddress,
        ixETHCollateralFactor,
        ixETHBorrowFactor,
        ixETHSupplyCapacity,
        ixETHBorrowCapacity,
        ixETHDistributionFactor
      );
      await tx.wait(1);

      tokenMarkets = await controller.markets(ixETHAddress);
      console.log("contract collateral factor is: ", (tokenMarkets.collateralFactorMantissa).toString());
      console.log("contract borrow factor is:     ", (tokenMarkets.borrowFactorMantissa).toString());
      console.log("contract supply cap is:        ", (tokenMarkets.supplyCapacity).toString());
      console.log("contract borrow cacp is:       ", (tokenMarkets.borrowCapacity).toString());

      console.log("Done!");
    } catch (e) {
      console.log(e.message);
    }
  })();
