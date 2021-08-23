// Right click on the script name and hit "Run" to execute
(async () => {
  try {
    console.log("Running deployWithEthers script...");

    const abiCoder = new ethers.utils.AbiCoder();
    const zeroAddress = ethers.constants.AddressZero;

    const contractName = "Timelock"; // Change this for other contract

    let tx;

    let targets = [];
    let values = [];
    let signatures = [];
    let calldatas = [];

    let rewardDistributionContractAddress, signer, owneableMetadata, metadata;
    let timeLockAddress;

    // Ethereum
    rewardDistributionContractAddress = "0x8fAeF85e436a8dd85D8E636Ea22E3b90f1819564";
    timeLockAddress = "0xBB247f5Ac912196A5AA80E9DD6aB252B79D6Ea25";

    // // BSC
    // rewardDistributionContractAddress = "0x6fC21a5a767212E8d366B3325bAc2511bDeF0Ef4";
    // timeLockAddress = "0x511b05f37e27a88E284322aF0bDE41A91771316d";

    // Note that the script needs the ABI which is generated from the compilation artifact.
    // Make sure contract is compiled and artifacts are generated
    const artifactsPath = `browser/artifacts/contracts/governance/${contractName}.sol/${contractName}.json`; // Change this for different path

    // 'web3Provider' is a remix global variable object
    signer = new ethers.providers.Web3Provider(web3Provider).getSigner();

    metadata = JSON.parse(
      await remix.call("fileManager", "getFile", artifactsPath)
    );

    const timeLock = new ethers.Contract(
      timeLockAddress,
      metadata.abi,
      signer
    );
    console.log("timeLock contract address: ", timeLock.address);

    // Ethereum
    let borrowedContracts = [
      "0x5812fCF91adc502a765E5707eBB3F36a07f63c02",   // iWBTC
      "0x5ACD75f21659a59fFaB9AEBAf350351a8bfaAbc0",   // iETH
      "0x1180c114f7fAdCB6957670432a3Cf8Ef08Ab5354",   // iUSDT
      "0x298f243aD592b6027d4717fBe9DeCda668E3c3A8",   // iDAI
      "0x2f956b2f801c6dad74E87E7f45c94f6283BF0f45",   // iUSDC
      "0x1AdC34Af68e970a93062b67344269fD341979eb0",   // iUSX
      "0x44c324970e5CbC5D4C3F3B7604CbC6640C2dcFbF",   // iEUX
      "0xd1254d280e7504836e1B0E36535eBFf248483cEE",   // iMUSX
      "0x591595Bfae3f5d51A820ECd20A1e3FBb6638f34B",   // iMEUX
      "0xb3dc7425e63E1855Eb41107134D471DD34d7b239",   // iDF
    ];
    let borrowedContractsSpeed = [
      "0",
      "0",
      "144447788143244057",
      "108335841107433043",
      "144447788143244057",
      "90279867589527536",
      "31597953656334638",
      "902798675895275354",
      "300932891965091785",
      "0"
    ];

    let suppliedContracts = [
      "0x5812fCF91adc502a765E5707eBB3F36a07f63c02",   // iWBTC
      "0x5ACD75f21659a59fFaB9AEBAf350351a8bfaAbc0",   // iETH
      "0x1180c114f7fAdCB6957670432a3Cf8Ef08Ab5354",   // iUSDT
      "0x298f243aD592b6027d4717fBe9DeCda668E3c3A8",   // iDAI
      "0x2f956b2f801c6dad74E87E7f45c94f6283BF0f45",   // iUSDC
      "0x1AdC34Af68e970a93062b67344269fD341979eb0",   // iUSX
      "0x44c324970e5CbC5D4C3F3B7604CbC6640C2dcFbF",   // iEUX
      "0xb3dc7425e63E1855Eb41107134D471DD34d7b239",   // iDF
    ];
    let suppliedContractsSpeed = [
      "300932891965091785",
      "300932891965091785",
      "818537466145049654",
      "613903099608787241",
      "818537466145049654",
      "511585916340656034",
      "179055070719229612",
      "752332229912729462"
    ];

    // // BSC
    // let borrowedContracts = [
    //   "0x0b66A250Dadf3237DdB38d485082a7BfE400356e",   // iBTCB
    //   "0x390bf37355e9dF6Ea2e16eEd5686886Da6F47669",   // iETH
    //   "0x0BF8C72d618B5d46b055165e21d661400008fa0F",   // iUSDT
    //   "0xAD5Ec11426970c32dA48f58c92b1039bC50e5492",   // iDAI
    //   "0xAF9c10b341f55465E8785F0F81DBB52a9Bfe005d",   // iUSDC
    //   "0x5511b64Ae77452C7130670C79298DEC978204a47",   // iBUSD
    //   "0x7B933e1c1F44bE9Fb111d87501bAADA7C8518aBe",   // iUSX
    //   "0x983A727Aa3491AB251780A13acb5e876D3f2B1d8",   // iEUX
    //   "0x36f4C36D1F6e8418Ecb2402F896B2A8fEDdE0991",   // iMUSX
    //   "0xb22eF996C0A2D262a19db2a66A256067f51511Eb",   // iMEUX
    //   "0xeC3FD540A2dEE6F479bE539D64da593a59e12D08",   // iDF
    //   "0xd57E1425837567F74A35d07669B23Bfb67aA4A93",   // iBNB
    // ];
    // let borrowedContractsSpeed = [
    //   "0",
    //   "0",
    //   "41666666666666667",
    //   "16666666666666667",
    //   "45833333333333334",
    //   "62500000000000000",
    //   "50000000000000000",
    //   "6250000000000000",
    //   "555555555555555556",
    //   "69444444444444445",
    //   "0",
    //   "0"
    // ];

    // let suppliedContracts = [
    //   "0x0b66A250Dadf3237DdB38d485082a7BfE400356e",   // iBTCB
    //   "0x390bf37355e9dF6Ea2e16eEd5686886Da6F47669",   // iETH
    //   "0x0BF8C72d618B5d46b055165e21d661400008fa0F",   // iUSDT
    //   "0xAD5Ec11426970c32dA48f58c92b1039bC50e5492",   // iDAI
    //   "0xAF9c10b341f55465E8785F0F81DBB52a9Bfe005d",   // iUSDC
    //   "0x5511b64Ae77452C7130670C79298DEC978204a47",   // iBUSD
    //   "0x7B933e1c1F44bE9Fb111d87501bAADA7C8518aBe",   // iUSX
    //   "0x983A727Aa3491AB251780A13acb5e876D3f2B1d8",   // iEUX
    //   "0xeC3FD540A2dEE6F479bE539D64da593a59e12D08",   // iDF
    //   "0xd57E1425837567F74A35d07669B23Bfb67aA4A93",   // iBNB
    // ];
    // let suppliedContractsSpeed = [
    //   "138888888888888889",
    //   "138888888888888889",
    //   "236111111111111112",
    //   "94444444444444445",
    //   "259722222222222223",
    //   "354166666666666667",
    //   "283333333333333334",
    //   "35416666666666667",
    //   "222222222222222223",
    //   "166666666666666667"
    // ];

    let data = abiCoder.encode(
      ["address[]", "uint256[]", "address[]", "uint256[]"],
      [borrowedContracts,borrowedContractsSpeed,suppliedContracts,suppliedContractsSpeed]
    );

    targets.push(rewardDistributionContractAddress);
    values.push(0);
    // signatures.push("_unpause(address[],uint256[],address[],uint256[])");
    signatures.push("_setDistributionSpeeds(address[],uint256[],address[],uint256[])");
    calldatas.push(data);

    await timeLock.executeTransactions(targets, values, signatures, calldatas);

    // // pause to distribute
    // targets.push(rewardDistributionContractAddress);
    // values.push(0);
    // signatures.push("_pause()");
    // calldatas.push("0x");

    // await timeLock.executeTransactions(targets, values, signatures, calldatas);

  } catch (e) {
    console.log(e.message);
  }
})();
