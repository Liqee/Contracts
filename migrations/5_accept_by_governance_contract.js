// Right click on the script name and hit "Run" to execute
(async () => {
  try {
    console.log("Running deployWithEthers script...");

    const abiCoder = new ethers.utils.AbiCoder();
    const zeroAddress = ethers.constants.AddressZero;

    const contractName = "Timelock"; // Change this for other contract
    const ownableContractName = "Ownable";
    let tx;

    let targets = [];
    let values = [];
    let signatures = [];
    let calldatas = [];

    let timeLockContractAddress, signer, owneableMetadata, metadata;

    if (typeof remix == "object") {
      timeLockContractAddress = "";

      // Note that the script needs the ABI which is generated from the compilation artifact.
      // Make sure contract is compiled and artifacts are generated
      const artifactsPath = `browser/artifacts/contracts/governance/${contractName}.sol/${contractName}.json`; // Change this for different path
      const ownableArtifactsPath = `browser/artifacts/contracts/library/${ownableContractName}.sol/${ownableContractName}.json`;

      // 'web3Provider' is a remix global variable object
      signer = new ethers.providers.Web3Provider(web3Provider).getSigner();

      owneableMetadata = JSON.parse(
        await remix.call("fileManager", "getFile", ownableArtifactsPath)
      );
      metadata = JSON.parse(
        await remix.call("fileManager", "getFile", artifactsPath)
      );
    } else {
      console.log("here")
      owneableMetadata = require("../artifacts/contracts/library/Ownable.sol/Ownable.json");
      metadata = require("../artifacts/contracts/governance/TimeLock.sol/Timelock.json");

      let owner1 = "0xbD206d0677BEf61f3abA309f84473fCF5C44C880";
      let owner2 = "0x6F43161E3A56501ea14B2901132A4d9F0945E179";

      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [owner2],
      });

      signer = await ethers.provider.getSigner(owner2);

      const Timelock = await ethers.getContractFactory("Timelock");
      const timelock = await Timelock.connect(signer).deploy();
      await timelock.deployed();

      timeLockContractAddress = timelock.address;
      console.log("timeLockContractAddress", timeLockContractAddress)
    }

    const timelock = new ethers.Contract(
      timeLockContractAddress,
      metadata.abi,
      signer
    );
    console.log("TimeLock contract address: ", timelock.address);

    // Transfer ownership form deployer.
    const transferOwnershipContracts = [
      "0x44c324970e5CbC5D4C3F3B7604CbC6640C2dcFbF", // iEUX
      "0x1AdC34Af68e970a93062b67344269fD341979eb0", // iUSX
      "0x237C69E082A94d37EBdc92a84b58455872e425d6", // ixETH
      "0x4013e6754634ca99aF31b5717Fa803714fA07B35", // ixBTC
      "0x028DB7A9d133301bD49f27b5E41F83F56aB0FaA6", // iMxETH
      "0xfa2e831c674B61475C175B2206e81A5938B298Dd", // iMxBTC
      "0xd1254d280e7504836e1B0E36535eBFf248483cEE", // iMUSX
      "0x591595Bfae3f5d51A820ECd20A1e3FBb6638f34B", // iMEUX
      "0x8d2Cb35893C01fa8B564c84Bd540c5109d9D278e", // xETH
      "0x0a5E677a6A24b2F1A2Bf4F3bFfC443231d2fDEc8", // USX
      "0x527Ec46Ac094B399265d1D71Eff7b31700aA655D", // xBTC
      "0xb986F3a2d91d3704Dc974A24FB735dCc5E3C1E70", // EUX
      "0x45677a101D70E9910C418D9426bC6c5874CE2Fd7", // msdController
      "0x786846D89736A5729e6A223F124bbB2377a8D337", // fixedInterestRateModel
      "0x3bA6e5e5dF88b9A88B2c19449778A4754170EA17", // controller
      "0xCf4aD4da361671dC84bE51A6c1131eaf84926E00", // rewardDistributor
      "0xab9C8C81228aBd4687078EBDA5AE236789b08673", // iEUX
      "0xF54954BA7e3cdFDA23941753b48039aB5192AEa0", // iUSX
      "0xa4C13398DAdB3a0A7305647b406ACdCD0689FCC5", // iMxTSLA
      "0x3481E1a5A8014F9C7E03322e4d4532D8ec723409", // iMxAPPL
      "0xaab2BAb88ceeDCF6788F45885155B278faD09110", // iMxAMZN
      "0xb0ffBD1E81B60C4e8a8E19cEF3A6A92fe18Be86D", // iMxCOIN
      "0x8dc6987F7D8E5aE9c39F767A324C5e46C1f731eB", // xTSLA
      "0xc4Ba45BeE9004408403b558a26099134282F2185", // xAPPL
      "0x32F9063bC2A2A57bCBe26ef662Dc867d5e6446d1", // xCOIN
      "0x966E726853Ca97449F458A3B012318a08B508202", // xAMZN
      "0x0965BD5C993a012C7A5f2212E0c95fD1B45e3506", // statusOracle
    ];

    // // Transfer ownership from new owner.
    // const transferOwnershipContracts = [
    //   '0x8B53Ab2c0Df3230EA327017C91Eb909f815Ad113', // controller
    //   '0x8fAeF85e436a8dd85D8E636Ea22E3b90f1819564', // rewardDistributor
    //   '0x5812fCF91adc502a765E5707eBB3F36a07f63c02', // iWBTC
    //   '0x5ACD75f21659a59fFaB9AEBAf350351a8bfaAbc0', // iETH
    //   '0x47566acD7af49D2a192132314826ed3c3c5f3698', // iHBTC
    //   '0xbeC9A824D6dA8d0F923FD9fbec4FAA949d396320', // iUNI
    //   '0x24677e213DeC0Ea53a430404cF4A11a6dc889FCe', // iBUSD
    //   '0x1180c114f7fAdCB6957670432a3Cf8Ef08Ab5354', // iUSDT
    //   '0x298f243aD592b6027d4717fBe9DeCda668E3c3A8', // iDAI
    //   '0x2f956b2f801c6dad74E87E7f45c94f6283BF0f45', // iUSDC
    //   '0x164315EA59169D46359baa4BcC6479bB421764b6', // iGOLDx
    //   '0xb3dc7425e63E1855Eb41107134D471DD34d7b239', // iDF
    // ];

    let transferOwnershipContractsLength = transferOwnershipContracts.length;
    for (let i = 0; i < transferOwnershipContractsLength; i++) {
      console.log("This contract index is: ", i);
      let contractAddress = transferOwnershipContracts[i];
      let contract = new ethers.Contract(
        contractAddress,
        owneableMetadata.abi,
        signer
      );
      let beforeContractOwner = await contract.owner();
      console.log(
        "Before transfer ownership,  owner is: ",
        beforeContractOwner
      );
      if (beforeContractOwner != timeLockContractAddress) {
        let beforeContractPendingOwner = await contract.pendingOwner();
        console.log(
          "Before transfer ownership, pending owner is: ",
          beforeContractPendingOwner
        );
        if (beforeContractPendingOwner != timeLockContractAddress) {
          tx = await contract._setPendingOwner(timeLockContractAddress);
          await tx.wait(1);
          let afterContractPendingOwner = await contract.pendingOwner();
          console.log(
            "After  transfer ownership, pending owner is: ",
            afterContractPendingOwner
          );
        }
      }
    }

    // Accept ownership from the timelock.
    const acceptOwnershipContracts = [
      // From deployer.
      "0x44c324970e5CbC5D4C3F3B7604CbC6640C2dcFbF", // iEUX
      "0x1AdC34Af68e970a93062b67344269fD341979eb0", // iUSX
      "0x237C69E082A94d37EBdc92a84b58455872e425d6", // ixETH
      "0x4013e6754634ca99aF31b5717Fa803714fA07B35", // ixBTC
      "0x028DB7A9d133301bD49f27b5E41F83F56aB0FaA6", // iMxETH
      "0xfa2e831c674B61475C175B2206e81A5938B298Dd", // iMxBTC
      "0xd1254d280e7504836e1B0E36535eBFf248483cEE", // iMUSX
      "0x591595Bfae3f5d51A820ECd20A1e3FBb6638f34B", // iMEUX
      "0x8d2Cb35893C01fa8B564c84Bd540c5109d9D278e", // xETH
      "0x0a5E677a6A24b2F1A2Bf4F3bFfC443231d2fDEc8", // USX
      "0x527Ec46Ac094B399265d1D71Eff7b31700aA655D", // xBTC
      "0xb986F3a2d91d3704Dc974A24FB735dCc5E3C1E70", // EUX
      "0x45677a101D70E9910C418D9426bC6c5874CE2Fd7", // msdController
      "0x786846D89736A5729e6A223F124bbB2377a8D337", // fixedInterestRateModel
      "0x3bA6e5e5dF88b9A88B2c19449778A4754170EA17", // controller
      "0xCf4aD4da361671dC84bE51A6c1131eaf84926E00", // rewardDistributor
      "0xab9C8C81228aBd4687078EBDA5AE236789b08673", // iEUX
      "0xF54954BA7e3cdFDA23941753b48039aB5192AEa0", // iUSX
      "0xa4C13398DAdB3a0A7305647b406ACdCD0689FCC5", // iMxTSLA
      "0x3481E1a5A8014F9C7E03322e4d4532D8ec723409", // iMxAPPL
      "0xaab2BAb88ceeDCF6788F45885155B278faD09110", // iMxAMZN
      "0xb0ffBD1E81B60C4e8a8E19cEF3A6A92fe18Be86D", // iMxCOIN
      "0x8dc6987F7D8E5aE9c39F767A324C5e46C1f731eB", // xTSLA
      "0xc4Ba45BeE9004408403b558a26099134282F2185", // xAPPL
      "0x32F9063bC2A2A57bCBe26ef662Dc867d5e6446d1", // xCOIN
      "0x966E726853Ca97449F458A3B012318a08B508202", // xAMZN
      "0x0965BD5C993a012C7A5f2212E0c95fD1B45e3506", // statusOracle
      // From original owner.
      "0x8B53Ab2c0Df3230EA327017C91Eb909f815Ad113", // controller
      "0x8fAeF85e436a8dd85D8E636Ea22E3b90f1819564", // rewardDistributor
      "0x5812fCF91adc502a765E5707eBB3F36a07f63c02", // iWBTC
      "0x5ACD75f21659a59fFaB9AEBAf350351a8bfaAbc0", // iETH
      "0x47566acD7af49D2a192132314826ed3c3c5f3698", // iHBTC
      "0xbeC9A824D6dA8d0F923FD9fbec4FAA949d396320", // iUNI
      "0x24677e213DeC0Ea53a430404cF4A11a6dc889FCe", // iBUSD
      "0x1180c114f7fAdCB6957670432a3Cf8Ef08Ab5354", // iUSDT
      "0x298f243aD592b6027d4717fBe9DeCda668E3c3A8", // iDAI
      "0x2f956b2f801c6dad74E87E7f45c94f6283BF0f45", // iUSDC
      "0x164315EA59169D46359baa4BcC6479bB421764b6", // iGOLDx
      "0xb3dc7425e63E1855Eb41107134D471DD34d7b239", // iDF
    ];

    let acceptOwnershipContractsLength = acceptOwnershipContracts.length;
    for (let i = 0; i < acceptOwnershipContractsLength; i++) {
      let contractAddress = acceptOwnershipContracts[i];
      let contract = new ethers.Contract(
        contractAddress,
        owneableMetadata.abi,
        signer
      );
      let beforeContractPendingOwner = await contract.pendingOwner();
      if (beforeContractPendingOwner == timeLockContractAddress) {
        // encode `accept owner`
        targets.push(contractAddress);
        values.push(0);
        signatures.push("_acceptOwner()");
        calldatas.push("0x");
      } else {
        console.log("======================");
        console.log("Do not set a valid pending owner!");
        console.log("======================");
      }
    }

    await timelock.executeTransactions(targets, values, signatures, calldatas);

  } catch (e) {
    console.log(e.message);
  }
})();
