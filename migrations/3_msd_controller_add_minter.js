
// Right click on the script name and hit "Run" to execute
(async () => {
    try {
      console.log("Running deployWithEthers script...");

      const contractName = "MSDController"; // Change this for other contract
      const msdContractName = "MSD";
      let tx;

      // Note that the script needs the ABI which is generated from the compilation artifact.
      // Make sure contract is compiled and artifacts are generated
      const artifactsPath = `browser/artifacts/contracts/msd/${contractName}.sol/${contractName}.json`; // Change this for different path
      const msdArtifactsPath = `browser/artifacts/contracts/msd/${msdContractName}.sol/${msdContractName}.json`; // Change this for different path
      const msdControllerAddress = "";

      const metadata = JSON.parse(
        await remix.call("fileManager", "getFile", artifactsPath)
      );

      const msdMetadata = JSON.parse(
        await remix.call("fileManager", "getFile", msdArtifactsPath)
      );

      // 'web3Provider' is a remix global variable object
      const signer = new ethers.providers.Web3Provider(web3Provider).getSigner();

      const msdController = new ethers.Contract(msdControllerAddress, metadata.abi, signer);
      console.log("MSD controller contract address: ", msdController.address);

      //----------------------------------------
      //------Add iMUSX to MSD Controller-------
      //----------------------------------------
      let USXAddress = "";
      let iMUSXAddress = "";
      const USX = new ethers.Contract(USXAddress, msdMetadata.abi, signer);

      tx = await msdController._addMSD(USXAddress, [iMUSXAddress]);
      await tx.wait(1);

      let USXMinter = await msdController.getMSDMinters(USXAddress)
      console.log(USXAddress, " minters in MSD controller are: ", USXMinter);
      //---------------------------
      //------Add USX minter-------
      //---------------------------
      tx = await USX._addMinter(msdControllerAddress);
      await tx.wait(1);

      USXMinter = await msdToken.getMinters();
      console.log(USXAddress, " minters in MSD token are: ", USXMinter);

      //----------------------------------------
      //------Add iMEUX to MSD Controller-------
      //----------------------------------------
      let EUXAddress = "";
      let iMEUXAddress = "";
      const EUX = new ethers.Contract(EUXAddress, msdMetadata.abi, signer);

      tx = await msdController._addMSD(EUXAddress, [iMEUXAddress]);
      await tx.wait(1);

      let EUXMinter = await msdController.getMSDMinters(EUXAddress)
      console.log(EUXAddress, " minters in MSD controller are: ", EUXMinter);

      //---------------------------
      //------Add EUX minter-------
      //---------------------------
      tx = await EUX._addMinter(msdControllerAddress);
      await tx.wait(1);

      EUXMinter = await msdToken.getMinters();
      console.log(EUXAddress, " minters in MSD token are: ", EUXMinter);

      //----------------------------------------
      //------Add iMxBTC to MSD Controller-------
      //----------------------------------------
      let xBTCAddress = "";
      let iMxBTCAddress = "";
      const xBTC = new ethers.Contract(xBTCAddress, msdMetadata.abi, signer);

      tx = await msdController._addMSD(xBTCAddress, [iMxBTCAddress]);
      await tx.wait(1);

      let xBTCMinter = await msdController.getMSDMinters(xBTCAddress)
      console.log(xBTCAddress, " minters in MSD controller are: ", xBTCMinter);

      //---------------------------
      //------Add xBTC minter-------
      //---------------------------
      tx = await xBTC._addMinter(msdControllerAddress);
      await tx.wait(1);

      xBTCMinter = await msdToken.getMinters();
      console.log(xBTCAddress, " minters in MSD token are: ", xBTCMinter);

      //----------------------------------------
      //------Add iMxETH to MSD Controller-------
      //----------------------------------------
      let xETHAddress = "";
      let iMxETHAddress = "";
      const xETH = new ethers.Contract(xETHAddress, msdMetadata.abi, signer);

      tx = await msdController._addMSD(xETHAddress, [iMxETHAddress]);
      await tx.wait(1);

      let xETHMinter = await msdController.getMSDMinters(xETHAddress)
      console.log(xETHAddress, " minters in MSD controller are: ", xETHMinter);

      //---------------------------
      //------Add xETH minter-------
      //---------------------------
      tx = await xETH._addMinter(msdControllerAddress);
      await tx.wait(1);

      xETHMinter = await msdToken.getMinters();
      console.log(xETHAddress, " minters in MSD token are: ", xETHMinter);

      console.log("Done!");
    } catch (e) {
      console.log(e.message);
    }
  })();
