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
    const msdContractName = "MSD";
    const imsdContractName = "iMSD";

    let tx;

    let targets = [];
    let values = [];
    let signatures = [];
    let calldatas = [];

    let proxyAdminContractAddress, signer, metadata;
    let timeLockAddress;
    let aaplMSDProxyAddress, aaplMSDNewImplAddress, aaplMSDOldImplAddress;
    let aaplIMSDProxyAddress, aaplIMSDNewImplAddress, aaplIMSDOldImplAddress;
    let timeLock, aaplMSD, aapliMSD;
    let artifactsPath, msdArtifactsPath, imsdArtifactsPath;
    let msdMetadata, imsdMetadata;

    // Ethereum
    timeLockAddress = "0xBB247f5Ac912196A5AA80E9DD6aB252B79D6Ea25";
    proxyAdminContractAddress = "0x4FF0455bcfBB5886607c078E0F43Efb5DE34DeF4";
    aaplMSDProxyAddress = "0xc4Ba45BeE9004408403b558a26099134282F2185";
    aaplMSDOldImplAddress = "0xE3ec7De9375bFc22F4481C4605431d67ED5Bd260";
    aaplMSDNewImplAddress = "";

    aaplIMSDProxyAddress = "0x3481E1a5A8014F9C7E03322e4d4532D8ec723409";
    aaplIMSDOldImplAddress = "0x8F70B274847418618D66e651437d5Fb24d0F605b";
    aaplIMSDNewImplAddress = "";

    // // BSC
    // timeLockAddress = "0x511b05f37e27a88E284322aF0bDE41A91771316d";
    // proxyAdminContractAddress = "0x0800604DA276c1D5e9c2C7FEC0e3b43FAb1Ca61a";
    // aaplMSDProxyAddress = "0x70D1d7cDeC24b16942669A5fFEaDA8527B744502";
    // aaplMSDOldImplAddress = "0xac2428D0FB0a8516Fc30e6a0bc19b098Be5F9DfF";
    // aaplMSDNewImplAddress = "";

    // aaplIMSDProxyAddress = "0x8633cEb128F46a6a8d5b9EceA5161e84127D3c0a";
    // aaplIMSDOldImplAddress = "0xB0fc114d747B6A00147eeB6D44e988E61124C9f3";
    // aaplIMSDNewImplAddress = "";

    artifactsPath = `browser/artifacts/contracts/governance/${contractName}.sol/${contractName}.json`; // Change this for different path
    msdArtifactsPath = `browser/artifacts/contracts/msd/${msdContractName}.sol/${msdContractName}.json`;
    imsdArtifactsPath = `browser/artifacts/contracts/msd/${imsdContractName}.sol/${imsdContractName}.json`;

    if (typeof remix == "object") {
      // Note that the script needs the ABI which is generated from the compilation artifact.
      // Make sure contract is compiled and artifacts are generated

      msdMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", msdArtifactsPath)
      );

      imsdMetadata = JSON.parse(
        await remix.call("fileManager", "getFile", imsdArtifactsPath)
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
      let owner2 = "0xbD206d0677BEf61f3abA309f84473fCF5C44C880";

      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [owner],
      });

      signer = await ethers.provider.getSigner(owner);
      console.log("signer", signer._address);

      const MSDFactory = await ethers.getContractFactory("MSD");
      const msd = await MSDFactory.connect(signer).deploy();
      await msd.deployed();
      aaplMSDNewImplAddress = msd.address;

      // console.log("before msd symbol", (await msd.symbol()).toString());
      // await msd.setSymbol("new symbol");
      // console.log("after  msd symbol", (await msd.symbol()).toString());


      const iMMSDFactory = await ethers.getContractFactory("iMSD");
      const imsd = await iMMSDFactory.connect(signer).deploy();
      await imsd.deployed();
      aaplIMSDNewImplAddress = imsd.address;

      metadata = require("../artifacts/contracts/governance/TimeLock.sol/Timelock.json");
      msdMetadata = require("../artifacts/contracts/msd/MSD.sol/MSD.json");
      imsdMetadata = require("../artifacts/contracts/msd/iMSD.sol/iMSD.json");
    }

    timeLock = new ethers.Contract(
      timeLockAddress,
      metadata.abi,
      signer
    );
    console.log("time lock contract address: ", timeLock.address);

    aaplMSD = new ethers.Contract(
      aaplMSDProxyAddress,
      msdMetadata.abi,
      signer
    );

    aapliMSD = new ethers.Contract(
      aaplIMSDProxyAddress,
      imsdMetadata.abi,
      signer
    );

    console.log("Before set new name, MSD token name is: ", (await aaplMSD.name()).toString());
    console.log("Before set new symbol, MSD symbol is:   ", (await aaplMSD.symbol()).toString());

    console.log("Before set new name, iMSD token name is: ", (await aapliMSD.name()).toString());
    console.log("Before set new symbol, iMSD symbol is:   ", (await aapliMSD.symbol()).toString(), "\n");

    // 1). upgrade AAPL MSD implementation
    let data = abiCoder.encode(
      ["address", "address"],
      [aaplMSDProxyAddress, aaplMSDNewImplAddress]
    );

    targets.push(proxyAdminContractAddress);
    values.push(0);
    signatures.push("upgrade(address,address)");
    calldatas.push(data);

    // upgrade new symbol
    data = abiCoder.encode(["string"], ["xAAPL"]);

    targets.push(aaplMSDProxyAddress);
    values.push(0);
    signatures.push("setSymbol(string)");
    calldatas.push(data);

    // revert AAPL MSD implementation
    data = abiCoder.encode(
      ["address", "address"],
      [aaplMSDProxyAddress, aaplMSDOldImplAddress]
    );

    targets.push(proxyAdminContractAddress);
    values.push(0);
    signatures.push("upgrade(address,address)");
    calldatas.push(data);

    // 2). upgrade xAAPL iMSD implementation
    data = abiCoder.encode(
      ["address", "address"],
      [aaplIMSDProxyAddress,aaplIMSDNewImplAddress]
    );

    targets.push(proxyAdminContractAddress);
    values.push(0);
    signatures.push("upgrade(address,address)");
    calldatas.push(data);

    // upgrade new symbol
    data = abiCoder.encode(["string"], ["iMxAAPL"]);

    targets.push(aaplIMSDProxyAddress);
    values.push(0);
    signatures.push("setSymbol(string)");
    calldatas.push(data);

    // upgrade new name
    data = abiCoder.encode(["string"], ["dForce AAPL"]);

    targets.push(aaplIMSDProxyAddress);
    values.push(0);
    signatures.push("setName(string)");
    calldatas.push(data);

    // revert AAPL MSD implementation
    data = abiCoder.encode(
      ["address", "address"],
      [aaplIMSDProxyAddress,aaplIMSDOldImplAddress]
    );

    targets.push(proxyAdminContractAddress);
    values.push(0);
    signatures.push("upgrade(address,address)");
    calldatas.push(data);

    await timeLock.executeTransactions(targets, values, signatures, calldatas);

    console.log("After set new name, MSD token name is: ", (await aaplMSD.name()).toString());
    console.log("After set new symbol, MSD symbol is:   ", (await aaplMSD.symbol()).toString());

    console.log("After set new name, iMSD token name is: ", (await aapliMSD.name()).toString());
    console.log("After set new symbol, iMSD symbol is:   ", (await aapliMSD.symbol()).toString());

  } catch (e) {
    console.log(e.message);
  }
})();
