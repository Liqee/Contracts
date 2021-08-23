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

    let proxyAdminContractAddress, rewardDistributor_gp, rewardDistributor_sp, signer, metadata;
    let rewardDistributorImpl;
    let timeLockAddress;

    // Ethereum
    timeLockAddress = "0xBB247f5Ac912196A5AA80E9DD6aB252B79D6Ea25";
    proxyAdminContractAddress = "0x4FF0455bcfBB5886607c078E0F43Efb5DE34DeF4";
    rewardDistributorImpl = "0x55eE002723945145c14E017C1F00246b118d31ff";
    rewardDistributor_gp = "0x8fAeF85e436a8dd85D8E636Ea22E3b90f1819564";
    rewardDistributor_sp = "0xcf4ad4da361671dc84be51a6c1131eaf84926e00";

    // // BSC
    // timeLockAddress = "0x511b05f37e27a88E284322aF0bDE41A91771316d";
    // proxyAdminContractAddress = "0x0800604DA276c1D5e9c2C7FEC0e3b43FAb1Ca61a";
    // rewardDistributorImpl = "0x44a1730b61Ba7d5Cd053a5aB77729004E7494544";
    // rewardDistributor_gp = "0x6fC21a5a767212E8d366B3325bAc2511bDeF0Ef4";
    // rewardDistributor_sp = "0xa28F287630184d3b5EeE31a5FE8dB0A63c4A6e2f";

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
    console.log("timelock contract address: ", timeLock.address);

    // Update reward dostributor in general pool
    let data = abiCoder.encode(
      ["address", "address"],
      [rewardDistributor_gp,rewardDistributorImpl]
    );

    targets.push(proxyAdminContractAddress);
    values.push(0);
    signatures.push("upgrade(address,address)");
    calldatas.push(data);

    // Update reward dostributor in stock pool
    data = abiCoder.encode(
      ["address", "address"],
      [rewardDistributor_sp,rewardDistributorImpl]
    );

    targets.push(proxyAdminContractAddress);
    values.push(0);
    signatures.push("upgrade(address,address)");
    calldatas.push(data);

    await timeLock.executeTransactions(targets, values, signatures, calldatas);

  } catch (e) {
    console.log(e.message);
  }
})();
