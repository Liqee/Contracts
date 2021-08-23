// Right click on the script name and hit "Run" to execute
(async () => {
    try {
      console.log("Running deployWithEthers script...");

      const contractName = "ProxyAdmin"; // Change this for other contract
      let tx;

      // Note that the script needs the ABI which is generated from the compilation artifact.
      // Make sure contract is compiled and artifacts are generated
      const artifactsPath = `browser/artifacts/contracts/library/${contractName}.sol/${contractName}.json`; // Change this for different path
      const proxyAdminAddress = "0x4FF0455bcfBB5886607c078E0F43Efb5DE34DeF4";

      const controllerProxyAddress = "0x8B53Ab2c0Df3230EA327017C91Eb909f815Ad113";
      const newControllerImplementation = "0x0B9fbdb0d8ddcD06a29F029cA5Ac1A9fE5BFC783";

      const iETHProxyAddress = "0x5ACD75f21659a59fFaB9AEBAf350351a8bfaAbc0";
      const newiETHImplementation = "0xca7e16B3c1736f1f65a659fB010e3669a872322d";

      const rewardDistributorProxyAddress = "0x8fAeF85e436a8dd85D8E636Ea22E3b90f1819564";
      const newRewardDistributorImplementation = "0x663dD7426ff36a109c1De16F9402591eBE330A63";

      const metadata = JSON.parse(
        await remix.call("fileManager", "getFile", artifactsPath)
      );

      // 'web3Provider' is a remix global variable object
      const signer = new ethers.providers.Web3Provider(web3Provider).getSigner();

      const proxyAdmin = new ethers.Contract(proxyAdminAddress, metadata.abi, signer);
      console.log("Proxy admin contract address: ", proxyAdmin.address);

      //----------------------------------------------
      //------Upgrade controller implementation-------
      //----------------------------------------------
      let controllerImpl = await proxyAdmin.getProxyImplementation(controllerProxyAddress);
      console.log("Controller old implementation is: ", controllerImpl);
      console.log("Going to set new implementation: ", newControllerImplementation);

      tx = await proxyAdmin.upgrade(controllerProxyAddress, newControllerImplementation);
      await tx.wait(1);

      controllerImpl = await proxyAdmin.getProxyImplementation(controllerProxyAddress);
      console.log("Controller new implementation is: ", controllerImpl);

      //----------------------------------------
      //------Upgrade iETH implementation-------
      //----------------------------------------
      let iETHImpl = await proxyAdmin.getProxyImplementation(iETHProxyAddress);
      console.log("iETH old implementation is: ", iETHImpl);
      console.log("Going to set new implementation: ", newiETHImplementation);

      tx = await proxyAdmin.upgrade(iETHProxyAddress, newiETHImplementation);
      await tx.wait(1);

      iETHImpl = await proxyAdmin.getProxyImplementation(iETHProxyAddress);
      console.log("iETH new implementation is: ", iETHImpl);

      //------------------------------------------------------
      //------Upgrade reward distributor implementation-------
      //------------------------------------------------------
      let rewardDistributorImpl = await proxyAdmin.getProxyImplementation(rewardDistributorProxyAddress);
      console.log("Reward distributor old implementation is: ", rewardDistributorImpl);
      console.log("Going to set new implementation: ", newRewardDistributorImplementation);

      tx = await proxyAdmin.upgrade(rewardDistributorProxyAddress, newRewardDistributorImplementation);
      await tx.wait(1);

      rewardDistributorImpl = await proxyAdmin.getProxyImplementation(rewardDistributorProxyAddress);
      console.log("Reward distributor new implementation is: ", rewardDistributorImpl);

      console.log("Finish!");
    } catch (e) {
      console.log(e.message);
    }
  })();
