/// TODO: README.md
/// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/// Please modify the block number when fork
/// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// Right click on the script name and hit "Run" to execute
(async () => {
  try {
    console.log("Running deployWithEthers script...");

    const abiCoder = new ethers.utils.AbiCoder();
    const zeroAddress = ethers.constants.AddressZero;

    const contractName = "Timelock"; // Change this for other contract
    const iTokenName = "iToken";
    const fixedInterestModelName = "FixedInterestRateModel";

    let tx;

    let targets = [];
    let values = [];
    let signatures = [];
    let calldatas = [];

    let signer, metadata;
    let timeLockAddress;
    let timeLock;
    let artifactsPath, iTokenArtifactsPath, fixedInterestModelArtifactsPath;
    let iTokenMetadata, fixedInterestModelMetadata;

    // Ethereum
    timeLockAddress = "0xBB247f5Ac912196A5AA80E9DD6aB252B79D6Ea25";
    let allStableiTokens = [
      "0x1180c114f7fAdCB6957670432a3Cf8Ef08Ab5354",   // iUSDT
      "0x2f956b2f801c6dad74E87E7f45c94f6283BF0f45",   // iUSDC
      "0x298f243aD592b6027d4717fBe9DeCda668E3c3A8",   // iDAI
      "0x24677e213DeC0Ea53a430404cF4A11a6dc889FCe",   // iBUSD
      "0x1AdC34Af68e970a93062b67344269fD341979eb0",   // iUSX_gp
      "0x44c324970e5CbC5D4C3F3B7604CbC6640C2dcFbF",   // iEUR_gp
      "0xF54954BA7e3cdFDA23941753b48039aB5192AEa0",   // iUSX_sp
      "0xab9C8C81228aBd4687078EBDA5AE236789b08673",   // iEUR_sp
    ];

    let allNonStableiTokens = [
      "0x5ACD75f21659a59fFaB9AEBAf350351a8bfaAbc0",   // iETH
      "0x5812fCF91adc502a765E5707eBB3F36a07f63c02",   // iWBTC
      "0xb3dc7425e63E1855Eb41107134D471DD34d7b239",   // iDF
      "0x164315EA59169D46359baa4BcC6479bB421764b6",   // iGOLDx
      "0x47566acD7af49D2a192132314826ed3c3c5f3698",   // iHBTC
      "0xbeC9A824D6dA8d0F923FD9fbec4FAA949d396320",   // iUNI
      "0x4013e6754634ca99aF31b5717Fa803714fA07B35",   // ixBTC
      "0x237C69E082A94d37EBdc92a84b58455872e425d6",   // ixETH
    ];

    let allMSDTokens = [
      "0xd1254d280e7504836e1B0E36535eBFf248483cEE",   // iMUSX
      "0x591595Bfae3f5d51A820ECd20A1e3FBb6638f34B",   // iMEUX
      "0xfa2e831c674B61475C175B2206e81A5938B298Dd",   // iMxBTC
      "0x028DB7A9d133301bD49f27b5E41F83F56aB0FaA6",   // iMxETH
      "0xa4C13398DAdB3a0A7305647b406ACdCD0689FCC5",   // iMxTSLA
      "0x3481E1a5A8014F9C7E03322e4d4532D8ec723409",   // iMAAPL
      "0xaab2BAb88ceeDCF6788F45885155B278faD09110",   // iMxAMZN
      "0xb0ffBD1E81B60C4e8a8E19cEF3A6A92fe18Be86D",   // iMxCOIN
    ];

    let newStableInterestModelAddress = "0x03DDF6cF4B937a008c2f1b5393D6bdaC16dD5B08";
    let newNonStableInterestModelAddress = "0x9C0C737d9823a64D37BFA1b62f9f0358993fe693";
    let fixedInterestModelAddress = "0x22961D0Ba5150f97AE0F3248b4c415875cBf42d5";
    // let newFixedBorrowRate = 12185720592;
    let proxyAdminAddress = "0x4FF0455bcfBB5886607c078E0F43Efb5DE34DeF4";
    let lendingDataV2ProxyAddress_gp = "0x37600A5a555F61ec2012D94b32f9B8c8eb2EfC5e";
    let lendingDataV2ProxyAddress_sp = "0x52ed0A880EdA217052E1fae4333Ba1F4abfe2ac3";
    let lendingDataV2NewImpl = "0x4B30C26D61Be2f76bC7d9f2c5EdbaCBa84982358";

    // Default is `timelock` contract.
    artifactsPath = `browser/artifacts/contracts/governance/${contractName}.sol/${contractName}.json`; // Change this for different path
    iTokenArtifactsPath = `browser/artifacts/contracts/${iTokenName}.sol/${iTokenName}.json`;
    fixedInterestModelArtifactsPath = `browser/artifacts/contracts/InterestRateModel/${fixedInterestModelName}.sol/${fixedInterestModelName}.json`;

    if (typeof remix == "object") {
      // Note that the script needs the ABI which is generated from the compilation artifact.
      // Make sure contract is compiled and artifacts are generated

      iTokenMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", iTokenArtifactsPath)
      );

      fixedInterestModelMetadata = JSON.parse(
        await remix.call("fileManager", "getFile", fixedInterestModelArtifactsPath)
      );

      // 'web3Provider' is a remix global variable object
      signer = new ethers.providers.Web3Provider(web3Provider).getSigner();

      // Timelock
      metadata = JSON.parse(
        await remix.call("fileManager", "getFile", artifactsPath)
      );
    } else {
      console.log("you are forking");
      let owner = "0xbD206d0677BEf61f3abA309f84473fCF5C44C880";

      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [owner],
      });

      signer = await ethers.provider.getSigner(owner);
      console.log("signer", signer._address);

      const StableInterestModelFactory = await ethers.getContractFactory("StablecoinInterestRateModel");
      const stableInterestModel = await StableInterestModelFactory.connect(signer).deploy();
      await stableInterestModel.deployed();
      newStableInterestModelAddress = stableInterestModel.address;

      // utils.parseEther(threshold.toString())
      const NonStableInterestModelFactory = await ethers.getContractFactory("StandardInterestRateModel");
      const nonstableInterestModel = await NonStableInterestModelFactory.connect(signer).deploy(ethers.utils.parseEther("0.5"));
      await nonstableInterestModel.deployed();
      newNonStableInterestModelAddress = nonstableInterestModel.address;

      metadata = require("../artifacts/contracts/governance/TimeLock.sol/Timelock.json");
      iTokenMetadata = require("../artifacts/contracts/iToken.sol/iToken.json");
      fixedInterestModelMetadata = require("../artifacts/contracts/InterestRateModel/FixedInterestRateModel.sol/FixedInterestRateModel.json");
    }

    let i, data;

    timeLock = new ethers.Contract(
      timeLockAddress,
      metadata.abi,
      signer
    );
    console.log("time lock contract address: ", timeLock.address);

    // Set new interest model contract for stable tokens.
    for (i = 0; i < allStableiTokens.length; i++) {
      data = abiCoder.encode(
        ["address"],
        [newStableInterestModelAddress]
      );

      targets.push(allStableiTokens[i]);
      values.push(0);
      signatures.push("_setInterestRateModel(address)");
      calldatas.push(data);
    }

    // Set new interest model contract for non-stable tokens.
    for (i = 0; i < allNonStableiTokens.length; i++) {
      data = abiCoder.encode(
        ["address"],
        [newNonStableInterestModelAddress]
      );

      targets.push(allNonStableiTokens[i]);
      values.push(0);
      signatures.push("_setInterestRateModel(address)");
      calldatas.push(data);
    }

    // Set new interest model contract for MSD tokens.
    for (i = 0; i < allMSDTokens.length; i++) {
      data = abiCoder.encode(
        ["address"],
        [fixedInterestModelAddress]
      );

      targets.push(allMSDTokens[i]);
      values.push(0);
      signatures.push("_setInterestRateModel(address)");
      calldatas.push(data);
    }

    // Update lending data V2 for general pool
    data = abiCoder.encode(
      ["address","address"],
      [lendingDataV2ProxyAddress_gp,lendingDataV2NewImpl]
    );

    targets.push(proxyAdminAddress);
    values.push(0);
    signatures.push("upgrade(address,address)");
    calldatas.push(data);

    // Update lending data V2 for stock pool
    data = abiCoder.encode(
      ["address","address"],
      [lendingDataV2ProxyAddress_sp,lendingDataV2NewImpl]
    );

    targets.push(proxyAdminAddress);
    values.push(0);
    signatures.push("upgrade(address,address)");
    calldatas.push(data);

    console.log("going to execute this action.");

    await timeLock.executeTransactions(targets, values, signatures, calldatas);
    console.log("finish executing this action.");

  } catch (e) {
    console.log(e.message);
  }
})();
