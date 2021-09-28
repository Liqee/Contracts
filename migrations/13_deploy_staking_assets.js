// Right click on the script name and hit "Run" to execute
(async () => {
  try {
    let tx;

    // 'web3Provider' is a remix global variable object
    const signer = new ethers.providers.Web3Provider(web3Provider).getSigner();

    // Ethereum mainnet Config
    // const oracleAddress = "0x34BAf46eA5081e3E49c29fccd8671ccc51e61E79";
    // // NOTICE: This value is only used to calculate APY to set, not in the interest rate contract,
    // // so, in different network, should re-write this value in the contract manually.
    // let blocksPerYear = 2425847;

    // // TODO:
    // const proxyAdminAddress = "0xbC7cE803Bd8569E6b3cB07869419DFc787464950";
    // const pauseGuardianAddress = "0x2929F07fF145a21b6784fE923b24F3ED38C3a5c3";
    // let controllerImplAddress = "0xD5b837a41A0d664ec28aA55B69B352944F741EFa";
    // let controllerProxyAddress = "0x8f1f15DCf4c70873fAF1707973f6029DEc4164b3";
    // let msdControllerImplAddress = "0x5dCDafD2C16B9Ea8991af7Bf4ea0210804F95338";
    // let msdControllerProxyAddress = "0x45677a101D70E9910C418D9426bC6c5874CE2Fd7";
    // let isNewMSDController = false;
    // let rewardImplAddress = "0x61206650bb0151f8EE8C278736c59B34BE5463fB";
    // let rewardProxyAddress = "0x6d290f45A280A688Ff58d095de480364069af110";
    // let nonStableInterestModelAddress = "0x3A452823EDB97f72B497c511301fb5758f575336";
    // let stableInterestModelAddress = "0xAa272a00e0d6F763AcC8Fe6DdEdf2684A122B215";
    // let fixedInterestModelAddress = "0x22961D0Ba5150f97AE0F3248b4c415875cBf42d5";
    // let msdImplementationAddress = "0xE3ec7De9375bFc22F4481C4605431d67ED5Bd260";
    // let iTokenImplementationAddress = "0xFC47D0063de06BA21dfEBF9D6cd6e337150e390f";
    // let iETHImplementationAddress = "0x61D63b034B6b5D4F4c83a153cB9050fd5faBFDF3";
    // let iMSDImplementationAddress = "0x37972736a3CF92E00C8F59aE5E80B3733b622f9e";
    // let lendingDataImplAddress = "0x6c63ef555Db56cfa8155d1864Ea359796e123298";
    // let lendingDataProxyAddress = "0x10937c33BB015Aa52EF39E2A5CAd0Da285bb39ab";

    // let toDeployiTokens = ["eth", "reth", "usx_iToken"];
    // let toDeployMSDTokens = [];
    // let assetsConfig = {
    //   "closeFactor": "0.5",
    //   "liquidationIncentive": "1.1",
    //   "reth": {
    //     // iToken config
    //     iTokenAddress: "0x983E0df5CCCef64fCaa54F99b0945bcCf154EE80",
    //     iTokenUnderlyingAddress: "0x9559Aaa82d9649C7A7b220E7c461d2E74c9a3593",
    //     iTokenName: "Liqee rETH",
    //     iTokenSymbol: "qrETH",
    //     reserveRatio: "0.2",
    //     flashloanFeeRatio: "0.0004",
    //     protocolFeeRatio: "0.3",
    //     // controller config
    //     collateralFactor: "0.7",
    //     borrowFactor: "1",
    //     supplyCapacity: "5000",
    //     borrowCapacity: "0",
    //     distributionFactor: "1",
    //     // interest model config
    //     interestModelType: "nonStableInterestModel",
    //     // asset price swing
    //     priceSwing: "0.1",
    //   },
    //   "eth": {
    //     // iToken config
    //     iTokenAddress: "0x9C02b8409a2CD04DFDA7b824235625f9C7DFb0E2",
    //     iTokenUnderlyingAddress: "0x000000000000000000000000000000000000000000000000",
    //     iTokenName: "Liqee ETH",
    //     iTokenSymbol: "qETH",
    //     reserveRatio: "0.2",
    //     flashloanFeeRatio: "0.0004",
    //     protocolFeeRatio: "0.3",
    //     // controller config
    //     collateralFactor: "0.8",
    //     borrowFactor: "1",
    //     supplyCapacity: "5000",
    //     borrowCapacity: "5000",
    //     distributionFactor: "1",
    //     // interest model config
    //     interestModelType: "nonStableInterestModel",
    //     // asset price swing
    //     priceSwing: "0.1",
    //   },
    //   "usx_imsd": {
    //     // MSD cofig
    //     msdAddress: "0x0a5E677a6A24b2F1A2Bf4F3bFfC443231d2fDEc8",
    //     msdTokenName: "dForce USD",
    //     msdTokenSymbol: "USX",
    //     decimals: 18,
    //     // iMToken config
    //     iMTokenAddress: "0x4c3F88A792325aD51d8c446e1815DA10dA3D184c",
    //     iMTokenName: "Liqee USD",
    //     iMTokenSymbol: "qMUSX",
    //     // controller config
    //     collateralFactor: "0",
    //     borrowFactor: "1",
    //     supplyCapacity: "0",
    //     borrowCapacity: "3000000",
    //     distributionFactor: "1",
    //     borrowAPY: 1.03,
    //   },
    //   "usx_iToken": {
    //     // iToken config
    //     iTokenAddress: "0xA5d65E3bD7411D409EC2CCFa30C6511bA8a99D2B",
    //     iTokenUnderlyingAddress: "0x0a5E677a6A24b2F1A2Bf4F3bFfC443231d2fDEc8",
    //     iTokenName: "Liqee USD",
    //     iTokenSymbol: "qUSX",
    //     flashloanFeeRatio: "0.0004",
    //     protocolFeeRatio: "0.3",
    //     reserveRatio: "0.2",
    //     // controller config
    //     collateralFactor: "0.8",
    //     borrowFactor: "1",
    //     supplyCapacity: "5000000",
    //     borrowCapacity: "5000000",
    //     distributionFactor: "1",
    //     // interest model config
    //     interestModelType: "stableInterestModelAddress",
    //     // asset price swing
    //     priceSwing: "0.001",
    //   },
    // };

    // // BSC mainnet Config
    const oracleAddress = "0x7DC17576200590C4d0D8d46843c41f324da2046C";
    let blocksPerYear = 10512000;

    // TODO:
    const proxyAdminAddress = "0xD5b837a41A0d664ec28aA55B69B352944F741EFa";
    const pauseGuardianAddress = "0x2929F07fF145a21b6784fE923b24F3ED38C3a5c3";
    let controllerImplAddress = "0x61206650bb0151f8EE8C278736c59B34BE5463fB";
    let controllerProxyAddress = "0x6d290f45A280A688Ff58d095de480364069af110";
    let msdControllerImplAddress = "0x5b3b6ff84f6693ffc3797f4ec4b764dea1c33cfb";
    let msdControllerProxyAddress = "0x4601d9c8def18c101496dec0a4864e8751295bee";
    let isNewMSDController = false;
    let rewardImplAddress = "0x19CD8bE684A995e10Eaf1e8Edba4fea14f934EaF";
    let rewardProxyAddress = "0xAa272a00e0d6F763AcC8Fe6DdEdf2684A122B215";
    let nonStableInterestModelAddress = "0x860b3995130e23f03218f5dBB97742c51B0d7b16";
    let stableInterestModelAddress = "0xB87fcf83C799E888725520e3BdE9b907a315BF42";
    let fixedInterestModelAddress = "0x0BCb6Be12022c1881031F86C502daA49909b74a1";
    let msdImplementationAddress = "0xac2428D0FB0a8516Fc30e6a0bc19b098Be5F9DfF";
    let iTokenImplementationAddress = "0x255d14997E9669eA371e6079288AF9c5E5621Fc8";
    let iETHImplementationAddress = "0x254AB79185bABCe0C1416FcC6d4b66675946EC9d";
    let iMSDImplementationAddress = "0x39D3C737ee4bCcAf0264c0cf7076712505CBDc92";
    let lendingDataImplAddress = "0x99A1B18c3b244a4863d1d032F96B0C3d3ab9cCD8";
    let lendingDataProxyAddress = "0x52682dB111e56e57f7362C9A7B683B3542Ff46bA";

    // let toDeployiTokens = ["atom", "ratom", "fil", "tfil", "dot", "rdot", "eth_token", "reth", "xtz", "txtz", "usx_iToken"];
    // let toDeployMSDTokens = ["usx_imsd"];
    let toDeployiTokens = ["eth", "rbnb"];
    let toDeployMSDTokens = [];
    let assetsConfig = {
      "closeFactor": "0.5",
      "liquidationIncentive": "1.1",
      "eth": {
        // iToken config
        iTokenAddress: "0x5aF1b6cA84693Cc8E733C8273Ba260095B3D05CA",
        iTokenUnderlyingAddress: "0x0000000000000000000000000000000000000000",
        iTokenName: "Liqee BNB",
        iTokenSymbol: "qBNB",
        reserveRatio: "0.2",
        flashloanFeeRatio: "0.0004",
        protocolFeeRatio: "0.3",
        // controller config
        collateralFactor: "0.8",
        borrowFactor: "1",
        supplyCapacity: "300000",
        borrowCapacity: "300000",
        distributionFactor: "1",
        // interest model config
        interestModelType: "nonStableInterestModel",
        // asset price swing
        priceSwing: "0.1",
      },
      "rbnb": {
        // iToken config
        iTokenAddress: "0x9A05Eed908D0C4c2A6bd860027C2a4BbB1deeBd8",
        iTokenUnderlyingAddress: "0xF027E525D491ef6ffCC478555FBb3CFabB3406a6",
        iTokenName: "Liqee rBNB",
        iTokenSymbol: "qrBNB",
        reserveRatio: "0.2",
        flashloanFeeRatio: "0.0004",
        protocolFeeRatio: "0.3",
        // controller config
        collateralFactor: "0.7",
        borrowFactor: "1",
        supplyCapacity: "300000",
        borrowCapacity: "0",
        distributionFactor: "1",
        // interest model config
        interestModelType: "nonStableInterestModel",
        // asset price swing
        priceSwing: "0.1",
      },
      "atom": {
        // iToken config
        iTokenAddress: "0xAdCF9619C404de591766B33e696c737ebe341A87",
        iTokenUnderlyingAddress: "0x0Eb3a705fc54725037CC9e008bDede697f62F335",
        iTokenName: "Liqee ATOM",
        iTokenSymbol: "qATOM",
        reserveRatio: "0.2",
        flashloanFeeRatio: "0.0004",
        protocolFeeRatio: "0.3",
        // controller config
        collateralFactor: "0.7",
        borrowFactor: "1",
        supplyCapacity: "1000000",
        borrowCapacity: "1000000",
        distributionFactor: "1",
        // interest model config
        interestModelType: "nonStableInterestModel",
        // asset price swing
        priceSwing: "0.1",
      },
      "ratom": {
        // iToken config
        iTokenAddress: "0x4E673bed356912077c718CBAB286BC135fAA5FB6",
        iTokenUnderlyingAddress: "0x1e5f6d5355AE5f1C5C687D3041c55F0aEEc57EAb",
        iTokenName: "Liqee rATOM",
        iTokenSymbol: "qrATOM",
        reserveRatio: "0.2",
        flashloanFeeRatio: "0.0004",
        protocolFeeRatio: "0.3",
        // controller config
        collateralFactor: "0.7",
        borrowFactor: "1",
        supplyCapacity: "1000000",
        borrowCapacity: "0",
        distributionFactor: "1",
        // interest model config
        interestModelType: "nonStableInterestModel",
        // asset price swing
        priceSwing: "0.1",
      },
      "dot": {
        // iToken config
        iTokenAddress: "0xF51422c47c6C3e40CFCA4a7b04232aeDb7f49948",
        iTokenUnderlyingAddress: "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402",
        iTokenName: "Liqee DOT",
        iTokenSymbol: "qDOT",
        reserveRatio: "0.2",
        flashloanFeeRatio: "0.0004",
        protocolFeeRatio: "0.3",
        // controller config
        collateralFactor: "0.7",
        borrowFactor: "1",
        supplyCapacity: "800000",
        borrowCapacity: "800000",
        distributionFactor: "1",
        // interest model config
        interestModelType: "nonStableInterestModel",
        // asset price swing
        priceSwing: "0.1",
      },
      "rdot": {
        // iToken config
        iTokenAddress: "0x09d0D2C90d09dD817559425479a573faA354c9d2",
        iTokenUnderlyingAddress: "0x1dab2a526c8ac1ddea86838a7b968626988d33de",
        iTokenName: "Liqee rDOT",
        iTokenSymbol: "qrDOT",
        reserveRatio: "0.2",
        flashloanFeeRatio: "0.0004",
        protocolFeeRatio: "0.3",
        // controller config
        collateralFactor: "0.7",
        borrowFactor: "1",
        supplyCapacity: "500000",
        borrowCapacity: "0",
        distributionFactor: "1",
        // interest model config
        interestModelType: "nonStableInterestModel",
        // asset price swing
        priceSwing: "0.1",
      },
      "fil": {
        // iToken config
        iTokenAddress: "0x89934cF95c8Ffa4D748B3a9963faD13dBA52C52F",
        iTokenUnderlyingAddress: "0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153",
        iTokenName: "Liqee FIL",
        iTokenSymbol: "qFIL",
        reserveRatio: "0.2",
        flashloanFeeRatio: "0.0004",
        protocolFeeRatio: "0.3",
        // controller config
        collateralFactor: "0.7",
        borrowFactor: "1",
        supplyCapacity: "100000",
        borrowCapacity: "100000",
        distributionFactor: "1",
        // interest model config
        interestModelType: "nonStableInterestModel",
        // asset price swing
        priceSwing: "0.1",
      },
      "tfil": {
        // iToken config
        iTokenAddress: "0x10937c33BB015Aa52EF39E2A5CAd0Da285bb39ab",
        iTokenUnderlyingAddress: "0x7829a9810BB84b0e6827f21c81396125d76a2EAB",
        iTokenName: "Liqee tFIL",
        iTokenSymbol: "qtFIL",
        reserveRatio: "0.2",
        flashloanFeeRatio: "0.0004",
        protocolFeeRatio: "0.3",
        // controller config
        collateralFactor: "0.75",
        borrowFactor: "1",
        supplyCapacity: "100000",
        borrowCapacity: "0",
        distributionFactor: "1",
        // interest model config
        interestModelType: "nonStableInterestModel",
        // asset price swing
        priceSwing: "0.1",
      },
      "xtz": {
        // iToken config
        iTokenAddress: "0xD95e75Bf11FF705ebD0bBc088892483015bB40fb",
        iTokenUnderlyingAddress: "0x16939ef78684453bfDFb47825F8a5F714f12623a",
        iTokenName: "Liqee XTZ",
        iTokenSymbol: "qXTZ",
        reserveRatio: "0.2",
        flashloanFeeRatio: "0.0004",
        protocolFeeRatio: "0.3",
        // controller config
        collateralFactor: "0.7",
        borrowFactor: "1",
        supplyCapacity: "500000",
        borrowCapacity: "500000",
        distributionFactor: "1",
        // interest model config
        interestModelType: "nonStableInterestModel",
        // asset price swing
        priceSwing: "0.1",
      },
      "txtz": {
        // iToken config
        iTokenAddress: "0xcF6E61fE1cB37e83cB590eAeE57D660089748077",
        iTokenUnderlyingAddress: "0x8f1f15DCf4c70873fAF1707973f6029DEc4164b3",
        iTokenName: "Liqee tXTZ",
        iTokenSymbol: "qtXTZ",
        reserveRatio: "0.2",
        flashloanFeeRatio: "0.0004",
        protocolFeeRatio: "0.3",
        // controller config
        collateralFactor: "0.75",
        borrowFactor: "1",
        supplyCapacity: "500000",
        borrowCapacity: "0",
        distributionFactor: "1",
        // interest model config
        interestModelType: "nonStableInterestModel",
        // asset price swing
        priceSwing: "0.1",
      },
      "reth": {
        // iToken config
        iTokenAddress: "0x7E3b8eB001396334DA14d4bb209b0dA77725939d",
        iTokenUnderlyingAddress: "0xa7a0a9fda65cd786b3dc718616cee25afb110544",
        iTokenName: "Liqee rETH",
        iTokenSymbol: "qrETH",
        reserveRatio: "0.2",
        flashloanFeeRatio: "0.0004",
        protocolFeeRatio: "0.3",
        // controller config
        collateralFactor: "0.7",
        borrowFactor: "1",
        supplyCapacity: "5000",
        borrowCapacity: "0",
        distributionFactor: "1",
        // interest model config
        interestModelType: "nonStableInterestModel",
        // asset price swing
        priceSwing: "0.1",
      },
      "eth_token": {
        // iToken config
        iTokenAddress: "0x88131dd9f6A78d3d23aBcF4960D91913d2dC2307",
        iTokenUnderlyingAddress: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
        iTokenName: "Liqee ETH",
        iTokenSymbol: "qETH",
        reserveRatio: "0.2",
        flashloanFeeRatio: "0.0004",
        protocolFeeRatio: "0.3",
        // controller config
        collateralFactor: "0.8",
        borrowFactor: "1",
        supplyCapacity: "5000",
        borrowCapacity: "5000",
        distributionFactor: "1",
        // interest model config
        interestModelType: "nonStableInterestModel",
        // asset price swing
        priceSwing: "0.1",
      },
      "usx_imsd": {
        // MSD cofig
        msdAddress: "0xB5102CeE1528Ce2C760893034A4603663495fD72",
        msdTokenName: "dForce USD",
        msdTokenSymbol: "USX",
        decimals: 18,
        // iMToken config
        iMTokenAddress: "0xee0D3450b577743Eee2793C0Ec6d59361eB9a454",
        iMTokenName: "Liqee USD",
        iMTokenSymbol: "qMUSX",
        // controller config
        collateralFactor: "0.8",
        borrowFactor: "1",
        supplyCapacity: "0",
        borrowCapacity: "3000000",
        distributionFactor: "1",
        borrowAPY: 1.00,
      },
      "usx_iToken": {
        // iToken config
        iTokenAddress: "0x450E09a303AA4bcc518b5F74Dd00433bd9555A77",
        iTokenUnderlyingAddress: "0xB5102CeE1528Ce2C760893034A4603663495fD72",
        iTokenName: "Liqee USD",
        iTokenSymbol: "qUSX",
        flashloanFeeRatio: "0.0004",
        protocolFeeRatio: "0.3",
        reserveRatio: "0.2",
        // controller config
        collateralFactor: "0.8",
        borrowFactor: "1",
        supplyCapacity: "10000000",
        borrowCapacity: "10000000",
        distributionFactor: "1",
        // asset price swing
        priceSwing: "0.001",
      },
    };

    // 0.0 Deploys proxy admin.
    const proxyAdminName = "ProxyAdmin";
    const proxyAdminArtifactsPath = `browser/artifacts/contracts/library/${proxyAdminName}.sol/${proxyAdminName}.json`;
    const proxyAdminMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", proxyAdminArtifactsPath)
    );

    if (!proxyAdminAddress) {
      // Create an instance of a Contract Factory
      const proxyAdminFactory = new ethers.ContractFactory(proxyAdminMetadata.abi, proxyAdminMetadata.bytecode, signer);
      const proxyAdmin = await proxyAdminFactory.deploy();
      // The contract is NOT deployed yet; we must wait until it is mined
      await proxyAdmin.deployed();
      console.log("POS proxy admin contract address: ", proxyAdmin.address);
      proxyAdminAddress = proxyAdmin.address;
    }


    // 1.0 Deploys controller contract.
    const controllerName = "Controller";
    const controllerArtifactsPath = `browser/artifacts/contracts/${controllerName}.sol/${controllerName}.json`;
    const controllerMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", controllerArtifactsPath)
    );
    const controllerInIface = new ethers.utils.Interface(controllerMetadata.abi);

    if (!controllerImplAddress) {
      console.log("Going to deploy a new POS controller implementation contract!");

      // Create an instance of a Contract Factory
      const controllerFactory = new ethers.ContractFactory(controllerMetadata.abi, controllerMetadata.bytecode, signer);
      const controllerContract = await controllerFactory.deploy();
      // The contract is NOT deployed yet; we must wait until it is mined
      await controllerContract.deployed();
      console.log("POS controller implementation contract address: ", controllerContract.address);

      console.log("Going to call initialize function in the POS controller");
      tx = await controllerContract.initialize();
      await tx.wait(1);

      controllerImplAddress = controllerContract.address;
      console.log("Finish to deploy POS controller implementation!");
    }

    const proxyName = "TransparentUpgradeableProxy";
    const proxyArtifactsPath = `browser/artifacts/@openzeppelin/contracts/proxy/${proxyName}.sol/${proxyName}.json`;
    const proxyMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", proxyArtifactsPath)
    );

    if (!controllerProxyAddress) {
      console.log("Going to deploy POS controller proxy contract!");
      const initData = controllerInIface.functions["initialize"].encode([]);
      console.log("initData is: ", initData);

      const controllerProxyFactory = new ethers.ContractFactory(proxyMetadata.abi, proxyMetadata.bytecode, signer);
      const controllerProxy = await controllerProxyFactory.deploy(controllerImplAddress, proxyAdminAddress, initData);
      await controllerProxy.deployed();
      controllerProxyAddress = controllerProxy.address;
      console.log("POS controller proxy contract address: ", controllerProxyAddress);
    }

    let controller = new ethers.Contract(controllerProxyAddress, controllerMetadata.abi, signer);

    // 1.1 Deploys msd controller contract.
    const msdControllerName = "MSDController";
    const msdControllerArtifactsPath = `browser/artifacts/contracts/msd/${msdControllerName}.sol/${msdControllerName}.json`;
    const msdControllerMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", msdControllerArtifactsPath)
    );
    const msdControllerInIface = new ethers.utils.Interface(msdControllerMetadata.abi);

    if (!msdControllerImplAddress) {
      console.log("Going to deploy a new POS MSD controller implementation contract!");

      // Create an instance of a Contract Factory
      const msdControllerFactory = new ethers.ContractFactory(msdControllerMetadata.abi, msdControllerMetadata.bytecode, signer);
      const msdControllerContract = await msdControllerFactory.deploy();
      // The contract is NOT deployed yet; we must wait until it is mined
      await msdControllerContract.deployed();
      console.log("POS MSD controller implementation contract address: ", msdControllerContract.address);

      console.log("Going to call initialize function in the POS MSD controller");
      tx = await msdControllerContract.initialize();
      await tx.wait(1);

      msdControllerImplAddress = msdControllerContract.address;
      console.log("Finish to deploy POS MSD controller implementation!");
    }

    if (!msdControllerProxyAddress) {
      console.log("Going to deploy POS MSD controller proxy contract!");
      const msdControllerinitData = msdControllerInIface.functions["initialize"].encode([]);
      console.log("msdControllerinitData is: ", msdControllerinitData);

      const msdControllerProxyFactory = new ethers.ContractFactory(proxyMetadata.abi, proxyMetadata.bytecode, signer);
      const msdControllerProxy = await msdControllerProxyFactory.deploy(msdControllerImplAddress, proxyAdminAddress, msdControllerinitData);
      await msdControllerProxy.deployed();
      msdControllerProxyAddress = msdControllerProxy.address;
      console.log("POS MSD controller proxy contract address: ", msdControllerProxyAddress);
    }

    let msdController = new ethers.Contract(msdControllerProxyAddress, msdControllerMetadata.abi, signer);

    // 2.0 Deploys reward distributor contract.
    const rewardName = "RewardDistributorV3";
    const rewardArtifactsPath = `browser/artifacts/contracts/${rewardName}.sol/${rewardName}.json`;
    const rewardMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", rewardArtifactsPath)
    );
    const rewardInIface = new ethers.utils.Interface(rewardMetadata.abi);
    let rewardInitArgs = [controllerProxyAddress];

    if (!rewardImplAddress) {
      console.log("Going to deploy a new POS reward distributor implementation contract!");

      // Create an instance of a Contract Factory
      const rewardFactory = new ethers.ContractFactory(rewardMetadata.abi, rewardMetadata.bytecode, signer);
      const rewardContract = await rewardFactory.deploy();
      // The contract is NOT deployed yet; we must wait until it is mined
      await rewardContract.deployed();
      console.log("POS reward distributor implementation contract address: ", rewardContract.address);

      console.log("Going to call initialize function in the POS reward distributor");
      tx = await rewardContract.initialize(...rewardInitArgs);
      await tx.wait(1);

      rewardImplAddress = rewardContract.address;
      console.log("Finish to deploy POS reward distributor implementation!");
    }

    if (!rewardProxyAddress) {
      console.log("Going to deploy POS reward distributor proxy contract!");
      const rewardInitData = rewardInIface.functions["initialize"].encode(rewardInitArgs);
      console.log("rewardInitData is: ", rewardInitData);

      const rewardProxyFactory = new ethers.ContractFactory(proxyMetadata.abi, proxyMetadata.bytecode, signer);
      const rewardProxy = await rewardProxyFactory.deploy(rewardImplAddress, proxyAdminAddress, rewardInitData);
      await rewardProxy.deployed();
      rewardProxyAddress = rewardProxy.address;
      console.log("POS reward distributor proxy contract address: ", rewardProxyAddress);
    }

    // 2.1 Set reward distributor in the controller
    let currentRewardContractInController = await controller.rewardDistributor();
    if (currentRewardContractInController != rewardProxyAddress) {
      console.log("\nGoing to set reward distributor in controller contract!");
      await controller._setRewardDistributor(rewardProxyAddress);
    }

    // 3.0 Deploy non-stable coin interest rate model contract.
    const nonStableName = "StandardInterestRateModel";
    const nonStableInterestModelArtifactsPath = `browser/artifacts/contracts/interestRateModel/${nonStableName}.sol/${nonStableName}.json`;
    const nonStableInterestMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", nonStableInterestModelArtifactsPath)
    );
    const nonStableInterestInIface = new ethers.utils.Interface(nonStableInterestMetadata.abi);
    let nonStableInterestModelThreshold = ethers.utils.parseEther("0.05");
    let nonStableInterestModelInitArgs = [nonStableInterestModelThreshold];

    if (!nonStableInterestModelAddress) {
      console.log("Going to deploy non stable coin interest model contract!");

      // Create an instance of a Contract Factory
      const nonStableInterestModelFactory = new ethers.ContractFactory(nonStableInterestMetadata.abi, nonStableInterestMetadata.bytecode, signer);
      const nonStableInterestModelContract = await nonStableInterestModelFactory.deploy(...nonStableInterestModelInitArgs);
      // The contract is NOT deployed yet; we must wait until it is mined
      await nonStableInterestModelContract.deployed();
      console.log("POS non stable coin interest model contract address: ", nonStableInterestModelContract.address);

      nonStableInterestModelAddress = nonStableInterestModelContract.address;
      console.log("Finish to deploy non stable coin interest model contract!");
    }

    // 3.1 Deploy stable coin interest rate model contract.
    const stableName = "StablecoinInterestRateModel";
    const stableInterestModelArtifactsPath = `browser/artifacts/contracts/interestRateModel/${stableName}.sol/${stableName}.json`;
    const stableInterestMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", stableInterestModelArtifactsPath)
    );
    const stableInterestInIface = new ethers.utils.Interface(stableInterestMetadata.abi);

    if (!stableInterestModelAddress) {
      console.log("Going to deploy stable coin interest model contract!");

      // Create an instance of a Contract Factory
      const stableInterestModelFactory = new ethers.ContractFactory(stableInterestMetadata.abi, stableInterestMetadata.bytecode, signer);
      const stableInterestModelContract = await stableInterestModelFactory.deploy();
      // The contract is NOT deployed yet; we must wait until it is mined
      await stableInterestModelContract.deployed();
      console.log("POS stable coin interest model contract address: ", stableInterestModelContract.address);

      stableInterestModelAddress = stableInterestModelContract.address;
      console.log("Finish to deploy stable coin interest model contract!");
    }

    // 3.2 Deploy fixed interest rate model contract.
    const fixedName = "FixedInterestRateModel";
    const fixedInterestModelArtifactsPath = `browser/artifacts/contracts/interestRateModel/${fixedName}.sol/${fixedName}.json`;
    const fixedInterestModelMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", fixedInterestModelArtifactsPath)
    );
    const fixedInterestInIface = new ethers.utils.Interface(fixedInterestModelMetadata.abi);

    if (!fixedInterestModelAddress) {
      console.log("Going to deploy fixed interest model contract!");

      // Create an instance of a Contract Factory
      const fixedInterestModelFactory = new ethers.ContractFactory(fixedInterestModelMetadata.abi, fixedInterestModelMetadata.bytecode, signer);
      const fixedInterestModelContract = await fixedInterestModelFactory.deploy();
      // The contract is NOT deployed yet; we must wait until it is mined
      await fixedInterestModelContract.deployed();
      console.log("POS fixed interest model contract address: ", fixedInterestModelContract.address);

      fixedInterestModelAddress = fixedInterestModelContract.address;
      console.log("Finish to deploy fixed interest model contract!");
    }

    // Initialize fixed interest rate model contract.
    let fixedInterestModel = new ethers.Contract(fixedInterestModelAddress, fixedInterestModelMetadata.abi, signer);

    // 4.0 Deploy MSD implementation contract.
    const msdContractName = "MSD";
    const msdArtifactsPath = `browser/artifacts/contracts/msd/${msdContractName}.sol/${msdContractName}.json`;
    const msdMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", msdArtifactsPath)
    );
    const msdIface = new ethers.utils.Interface(msdMetadata.abi);

    let msdConfig = assetsConfig["usx_imsd"];
    let msdInitArgs = [msdConfig["msdTokenName"], msdConfig["msdTokenSymbol"], msdConfig["decimals"]]

    if (!msdImplementationAddress) {
      console.log("Going to deploy MSD token implementation contract!");
      const msdFactory = new ethers.ContractFactory(msdMetadata.abi, msdMetadata.bytecode, signer);
      const msd = await msdFactory.deploy();
      await msd.deployed();

      console.log("MSD token implementation contract address is: ", msd.address);
      msdImplementationAddress = msd.address;

      console.log("Going to call initialize function in the MSD token");
      tx = await msd.initialize(...msdInitArgs);
      await tx.wait(1);
      console.log("Finish to deploy MSD token contract!");
    }

    // 4.1 Deploy MSD proxy token.
    let toDeployMSDTokensLength = toDeployMSDTokens.length;
    for (let i = 0; i < toDeployMSDTokensLength; i++) {
      let currentMSDToken = toDeployMSDTokens[i];
      let msdTokenAddress = assetsConfig[currentMSDToken]["msdAddress"];

      msdConfig = assetsConfig[currentMSDToken];
      msdInitArgs = [msdConfig["msdTokenName"], msdConfig["msdTokenSymbol"], msdConfig["decimals"]];

      if (!msdTokenAddress) {
        console.log("\nGoing to deploy MSD proxy token: ", currentMSDToken);
        let msdInitData = msdIface.functions["initialize"].encode(msdInitArgs);
        console.log("msdInitData is: ", msdInitData);

        let msdProxyFactory = new ethers.ContractFactory(proxyMetadata.abi, proxyMetadata.bytecode, signer);
        let msdProxyContract = await msdProxyFactory.deploy(msdImplementationAddress, proxyAdminAddress, msdInitData);
        await msdProxyContract.deployed();
        assetsConfig[currentMSDToken]["msdAddress"] = msdProxyContract.address;
        console.log(currentMSDToken, " MSD token proxy contract address is: ", msdProxyContract.address);
      }
    }

    // 5.0 Deploy iToken implementation contract.
    const iTokenContractName = "iToken";
    const iTokenArtifactsPath = `browser/artifacts/contracts/${iTokenContractName}.sol/${iTokenContractName}.json`;
    const iTokenMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", iTokenArtifactsPath)
    );
    const iTokenIface = new ethers.utils.Interface(iTokenMetadata.abi);

    let iTokenConfig = assetsConfig["usx_iToken"];
    // Only for iToken implementation, so can use msd contract address!!!
    let iTokenImplInitArgs = [iTokenConfig["iTokenUnderlyingAddress"], iTokenConfig["iTokenName"], iTokenConfig["iTokenSymbol"], controllerProxyAddress, stableInterestModelAddress];

    if (!iTokenImplementationAddress) {
      console.log("Going to deploy iToken implementation contract!");
      const iTokenFactory = new ethers.ContractFactory(iTokenMetadata.abi, iTokenMetadata.bytecode, signer);
      const iTokenContract = await iTokenFactory.deploy();
      await iTokenContract.deployed();

      console.log("iToken implementation contract address is: ", iTokenContract.address);
      iTokenImplementationAddress = iTokenContract.address;

      console.log("Going to call initialize function in the iToken");
      tx = await iTokenContract.initialize(...iTokenImplInitArgs);
      await tx.wait(1);
      console.log("Finish to deploy iToken contract!");
    }

    // 5.1 Deploy iETH implementation contract.
    const iETHContractName = "iETH";
    const iETHArtifactsPath = `browser/artifacts/contracts/${iETHContractName}.sol/${iETHContractName}.json`;
    const iETHMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", iETHArtifactsPath)
    );
    const iETHIface = new ethers.utils.Interface(iETHMetadata.abi);

    let iETHConfig = assetsConfig["eth"];
    let iETHImplInitArgs = [iETHConfig["iTokenName"], iETHConfig["iTokenSymbol"], controllerProxyAddress, nonStableInterestModelAddress];

    if (!iETHImplementationAddress) {
      console.log("Going to deploy iETH implementation contract!");
      const iETHFactory = new ethers.ContractFactory(iETHMetadata.abi, iETHMetadata.bytecode, signer);
      const iETHContract = await iETHFactory.deploy();
      await iETHContract.deployed();

      console.log("iETH implementation contract address is: ", iETHContract.address);
      iETHImplementationAddress = iETHContract.address;

      console.log("Going to call initialize function in the iETH");
      tx = await iETHContract.initialize(...iETHImplInitArgs);
      await tx.wait(1);
      console.log("Finish to deploy iETH contract!");
    }

    // 5.2 Deploy iToken proxy contract.
    let toDeployiTokensLength = toDeployiTokens.length;
    for (let i = 0; i < toDeployiTokensLength; i++) {
      let currentiToken = toDeployiTokens[i];
      let iTokenProxyAddress = assetsConfig[currentiToken]["iTokenAddress"];
      iTokenConfig = assetsConfig[currentiToken];
      let interestModelType = assetsConfig[currentiToken]["interestModelType"];
      let actualInterestModel = interestModelType == "nonStableInterestModel" ? nonStableInterestModelAddress : stableInterestModelAddress;
      let iTokenInitData;

      if (!iTokenProxyAddress) {
        console.log("\nGoing to deploy iToken proxy: ", currentiToken);
        if (currentiToken == "eth") {
          // Replace iToken implementation to iETH implementation.
          iTokenImplementationAddress = iETHImplementationAddress;
          iTokenImplInitArgs = [iTokenConfig["iTokenName"], iTokenConfig["iTokenSymbol"], controllerProxyAddress, actualInterestModel];
          iTokenInitData = iETHIface.functions["initialize"].encode(iTokenImplInitArgs);
        } else {
          iTokenImplInitArgs = [iTokenConfig["iTokenUnderlyingAddress"], iTokenConfig["iTokenName"], iTokenConfig["iTokenSymbol"], controllerProxyAddress, actualInterestModel];
          iTokenInitData = iTokenIface.functions["initialize"].encode(iTokenImplInitArgs);
        }
        console.log("iTokenInitData is: ", iTokenInitData);

        const iTokenProxyFactory = new ethers.ContractFactory(proxyMetadata.abi, proxyMetadata.bytecode, signer);
        const iTokenProxy = await iTokenProxyFactory.deploy(iTokenImplementationAddress, proxyAdminAddress, iTokenInitData);
        await iTokenProxy.deployed();

        assetsConfig[currentiToken]["iTokenAddress"] = iTokenProxy.address;
        console.log(currentiToken, " iToken token proxy contract address is: ", iTokenProxy.address);
      }

      console.log("\nGoing to set configs for ", currentiToken);
      iTokenProxyAddress = assetsConfig[currentiToken]["iTokenAddress"];
      let iToken = new ethers.Contract(iTokenProxyAddress, iTokenMetadata.abi, signer);
      // 5.3.0 Set configs for iTokens: reserveRatio
      let currentReserveRatio = await iToken.reserveRatio();
      let iTokenReserveRatio = assetsConfig[currentiToken]["reserveRatio"];
      let toWriteReserveRatio = ethers.utils.parseEther(iTokenReserveRatio);
      if (currentReserveRatio.toString() != toWriteReserveRatio.toString()) {
        console.log(
          "\ncurrent reserve ratio is:   ",
          currentReserveRatio.toString() / 1e18
        );
        console.log("going to set reserve ratio: ", iTokenReserveRatio);
        tx = await iToken._setNewReserveRatio(toWriteReserveRatio);
        await tx.wait(1);
        console.log("finish to set reserve ratio\n");

        currentReserveRatio = await iToken.reserveRatio();
        console.log("current reserve ratio is: ", currentReserveRatio.toString());
      }

      // // 5.3.1 Set configs for iTokens: flashloanFeeRatio
      // let currentFlashloanFeeRatio = await iToken.flashloanFeeRatio();
      // let iTokenFlashloanFeeRatio = assetsConfig[currentiToken]["flashloanFeeRatio"];
      // let toWriteFlashloanFeeRatio = ethers.utils.parseEther(iTokenFlashloanFeeRatio);
      // if (
      //   currentFlashloanFeeRatio.toString() != toWriteFlashloanFeeRatio.toString()
      // ) {
      //   console.log(
      //     "\ncurrent flashloan fee ratio is:   ",
      //     currentFlashloanFeeRatio.toString() / 1e18
      //   );
      //   console.log("going to set flashloan fee ratio: ", iTokenFlashloanFeeRatio);
      //   tx = await iToken._setNewFlashloanFeeRatio(toWriteFlashloanFeeRatio);
      //   await tx.wait(1);
      //   console.log("finish to set flashloan fee ratio\n");

      //   currentFlashloanFeeRatio = await iToken.flashloanFeeRatio();
      //   console.log("current flashfee ratio is: ", currentFlashloanFeeRatio.toString());
      // }

      // // 5.3.2 Set configs for iTokens: protocolFeeRatio
      // let currentProtocolFeeRatio = await iToken.protocolFeeRatio();
      // let iTokenProtocolFeeRatio = assetsConfig[currentiToken]["protocolFeeRatio"];
      // let toWriteProtocolFeeRatio = ethers.utils.parseEther(iTokenProtocolFeeRatio);
      // if (
      //   currentProtocolFeeRatio.toString() != toWriteProtocolFeeRatio.toString()
      // ) {
      //   console.log(
      //     "\ncurrent protocol fee ratio is:   ",
      //     currentProtocolFeeRatio.toString() / 1e18
      //   );
      //   console.log("going to set protocol fee ratio: ", iTokenProtocolFeeRatio);
      //   tx = await iToken._setNewProtocolFeeRatio(toWriteProtocolFeeRatio);
      //   await tx.wait(1);
      //   console.log("finish to set protocol fee ratio\n");

      //   currentProtocolFeeRatio = await iToken.protocolFeeRatio();
      //   console.log("current protocol fee ratio is: ", currentProtocolFeeRatio.toString());
      // }
    }

    // 5.4 Deploy iMSD implementation.
    const iMSDContractName = "iMSD";
    const iMSDArtifactsPath = `browser/artifacts/contracts/msd/${iMSDContractName}.sol/${iMSDContractName}.json`;
    const iMSDMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", iMSDArtifactsPath)
    );
    const iMSDIface = new ethers.utils.Interface(iMSDMetadata.abi);

    let iMSDConfig = assetsConfig["usx_imsd"];
    let iMSDInitArgs = [iMSDConfig["msdAddress"], iMSDConfig["iMTokenName"], iMSDConfig["iMTokenSymbol"], controllerProxyAddress, fixedInterestModelAddress, msdControllerProxyAddress];

    if (!iMSDImplementationAddress) {
      console.log("Going to deploy iMSD token implementation contract!");
      const iMSDFactory = new ethers.ContractFactory(iMSDMetadata.abi, iMSDMetadata.bytecode, signer);
      const iMSDContract = await iMSDFactory.deploy();
      await iMSDContract.deployed();

      console.log("iMSD token implementation contract address is: ", iMSDContract.address);
      iMSDImplementationAddress = iMSDContract.address;

      console.log("Going to call initialize function in the iMSD token");
      tx = await iMSDContract.initialize(...iMSDInitArgs);
      await tx.wait(1);
      console.log("Finish to deploy iMSD token contract!");
    }

    // 5.5 Deploy iMSD proxy contracts.
    let toDeployiMSDTokens = ["usx_imsd"];
    let toDeployiMSDTokensLength = toDeployiMSDTokens.length;
    for (let i = 0; i < toDeployiMSDTokensLength; i++) {
      let currentiMSDToken = toDeployiMSDTokens[i];
      let iMSDTokenAddress = assetsConfig[currentiMSDToken]["iMTokenAddress"];

      iMSDConfig = assetsConfig[currentiMSDToken];
      iMSDInitArgs = [iMSDConfig["msdAddress"], iMSDConfig["iMTokenName"], iMSDConfig["iMTokenSymbol"], controllerProxyAddress, fixedInterestModelAddress, msdControllerProxyAddress];

      if (!iMSDTokenAddress) {
        console.log("\nGoing to deploy iMSD token: ", currentiMSDToken);
        let iMSDInitData = iMSDIface.functions["initialize"].encode(iMSDInitArgs);
        console.log("iMSDInitData is: ", iMSDInitData);

        let iMSDProxyFactory = new ethers.ContractFactory(proxyMetadata.abi, proxyMetadata.bytecode, signer);
        let iMSDProxyContract = await iMSDProxyFactory.deploy(iMSDImplementationAddress, proxyAdminAddress, iMSDInitData);
        await iMSDProxyContract.deployed();
        assetsConfig[currentiMSDToken]["iMTokenAddress"] = iMSDProxyContract.address;
        console.log(currentiMSDToken, " iMSD token proxy contract address is: ", iMSDProxyContract.address);
      }
    }

    // 6.0 Deploy lending data implementation contract.
    const priceTokenAddress = assetsConfig["usx_iToken"]["iTokenAddress"];
    const lendingDataContractName = "LendingDataV2";
    const lendingDataArtifactsPath = `browser/artifacts/contracts/helper/${lendingDataContractName}.sol/${lendingDataContractName}.json`;
    const lendingDataMetadata = JSON.parse(
      await remix.call("fileManager", "getFile", lendingDataArtifactsPath)
    );
    const lendingDataIface = new ethers.utils.Interface(lendingDataMetadata.abi);
    let lendingDataInitArgs = [controllerProxyAddress, priceTokenAddress];

    if (!lendingDataImplAddress) {
      console.log("Going to deploy lending data implementation contract!");
      const lendingDataFactory = new ethers.ContractFactory(lendingDataMetadata.abi, lendingDataMetadata.bytecode, signer);
      const lendingDataContract = await lendingDataFactory.deploy(...lendingDataInitArgs);
      await lendingDataContract.deployed();

      lendingDataImplAddress = lendingDataContract.address;
      console.log("lending data implementation contract address is: ", lendingDataImplAddress);
    }

    // 6.1 Deploy lending data proxy contract.
    if (!lendingDataProxyAddress) {
      console.log("Deploy lending data contract proxy");
      const lendingDataInitData = lendingDataIface.functions["initialize"].encode(lendingDataInitArgs);
      console.log("lending initData is: ", lendingDataInitData);

      const lendingDataProxyFactory = new ethers.ContractFactory(proxyMetadata.abi, proxyMetadata.bytecode, signer);
      const lendingDataContract = await lendingDataProxyFactory.deploy(lendingDataImplAddress, proxyAdminAddress, lendingDataInitData);
      await lendingDataContract.deployed();
      lendingDataProxyAddress = lendingDataContract.address;
      console.log("lendingDataContract proxy contract address is: ", lendingDataProxyAddress);
    }

    /// ------------------------
    /// Set config in controller
    /// ------------------------

    // 7.0 Sets oracle contract.
    let currentOracle = await controller.priceOracle();
    console.log("current oracle is: ", currentOracle);
    if (currentOracle != oracleAddress) {
      console.log("Going to set oracle in controller contract!");
      tx = await controller._setPriceOracle(oracleAddress);
      await tx.wait(1);

      currentOracle = await controller.priceOracle();
      console.log("after execution, oracle is: ", currentOracle);
    }

    // 7.1 Sets close factor:
    let currentCloseFactor = await controller.closeFactorMantissa();
    let iTokenCloseFactor = assetsConfig["closeFactor"];
    let toSetCloseFactor = ethers.utils.parseEther(iTokenCloseFactor);
    if (currentCloseFactor.toString() != toSetCloseFactor.toString()) {
      console.log("going to set close factor: ", iTokenCloseFactor);
      tx = await controller._setCloseFactor(toSetCloseFactor);
      await tx.wait(1);
      console.log("finish to set close factor\n");
      currentCloseFactor = await controller.closeFactorMantissa();
      console.log("after execution, close factor is: ", currentCloseFactor.toString());
    }

    // 7.2 Sets liquidation incentive: liquidationIncentive
    let currentLiquidationIncentive = await controller.liquidationIncentiveMantissa();
    let iTokenLiquidationIncentive = assetsConfig["liquidationIncentive"];
    let toSetLiquidatationIncentive = ethers.utils.parseEther(iTokenLiquidationIncentive);
    if (currentLiquidationIncentive.toString() != toSetLiquidatationIncentive.toString()) {
      console.log("going to set liquidation incentive: ", iTokenLiquidationIncentive);
      tx = await controller._setLiquidationIncentive(toSetLiquidatationIncentive);
      await tx.wait(1);
      console.log("finish to set liquidation incentive\n");
      currentLiquidationIncentive = await controller.liquidationIncentiveMantissa();
      console.log("after execution, liquidation incentive is: ", currentLiquidationIncentive.toString());
    }

    // 7.3 Set contract guardian.
    let currentPauseGuardian = await controller.pauseGuardian();
    console.log("Current pause guardian is: ", currentPauseGuardian);
    if (currentPauseGuardian != pauseGuardianAddress) {
      console.log("Going to set a pause guardian!");
      tx = await controller._setPauseGuardian(pauseGuardianAddress);
      await tx.wait(1);
      currentPauseGuardian = await controller.pauseGuardian();
      console.log("After execution, pause guardian is: ", currentPauseGuardian);
    }

    // TODO: Need to feed price at first!!!
    // 7.4 Add all iTokens to market.
    let toAddiTokensToMarkets = toDeployiTokens;
    let toAddiTokensToMarketsLength = toAddiTokensToMarkets.length;
    for (let i = 0; i < toAddiTokensToMarketsLength; i++) {
      let currentiTokenContract = toAddiTokensToMarkets[i];
      let iTokenContractConfigs = assetsConfig[currentiTokenContract];
      let iTokenAddress = iTokenContractConfigs["iTokenAddress"];
      let hasAdded = await controller.hasiToken(iTokenAddress);
      console.log("Has added ", currentiTokenContract, " token to market: ", hasAdded);
      if (!hasAdded) {
        console.log("Going to add ", currentiTokenContract, " token to the market");
        let collateralFactor = ethers.utils.parseEther(iTokenContractConfigs["collateralFactor"]);
        let borrowFactor = ethers.utils.parseEther(iTokenContractConfigs["borrowFactor"]);
        let supplyCapacity = ethers.utils.parseEther(iTokenContractConfigs["supplyCapacity"]);
        let borrowCapacity = ethers.utils.parseEther(iTokenContractConfigs["borrowCapacity"]);
        let distributionFactor = ethers.utils.parseEther(iTokenContractConfigs["distributionFactor"]);
        tx = await controller._addMarket(
          iTokenAddress,
          collateralFactor,
          borrowFactor,
          supplyCapacity,
          borrowCapacity,
          distributionFactor
        );
        await tx.wait(1);

        hasAdded = await controller.hasiToken(iTokenAddress);
        console.log("After execution, has added ", currentiTokenContract, " token to market: ", hasAdded);
      }
    }

    // 7.5 Add all iMSD tokens to market.
    let toAddiMSDToMarkets = toDeployiMSDTokens;
    let toAddiMSDToMarketsLength = toAddiMSDToMarkets.length;
    for (let i = 0; i < toAddiMSDToMarketsLength; i++) {
      let currentiMSDContract = toAddiMSDToMarkets[i];
      let iMSDContractConfigs = assetsConfig[currentiMSDContract];
      let iMTokenAddress = iMSDContractConfigs["iMTokenAddress"];
      let iMSDHasAdded = await controller.hasiToken(iMTokenAddress);
      console.log("Has added ", currentiMSDContract, " token to market: ", iMSDHasAdded);
      if (!iMSDHasAdded) {
        console.log("Going to add ", currentiMSDContract, " token to the market");
        let iMSDCollateralFactor = ethers.utils.parseEther(iMSDContractConfigs["collateralFactor"]);
        let iMSDBorrowFactor = ethers.utils.parseEther(iMSDContractConfigs["borrowFactor"]);
        let iMSDSupplyCapacity = ethers.utils.parseEther(iMSDContractConfigs["supplyCapacity"]);
        let iMSDBorrowCapacity = ethers.utils.parseEther(iMSDContractConfigs["borrowCapacity"]);
        let iMSDDistributionFactor = ethers.utils.parseEther(iMSDContractConfigs["distributionFactor"]);
        tx = await controller._addMarket(
          iMTokenAddress,
          iMSDCollateralFactor,
          iMSDBorrowFactor,
          iMSDSupplyCapacity,
          iMSDBorrowCapacity,
          iMSDDistributionFactor
        );
        await tx.wait(1);

        iMSDHasAdded = await controller.hasiToken(iMTokenAddress);
        console.log("After execution, has added ", currentiMSDContract, " token to market: ", iMSDHasAdded);
      }
    }

    /// ------------------------
    /// Set config in MSD
    /// ------------------------
    // 8.0 Add MSD controller as the only minter
    if (isNewMSDController) {
      for (let i = 0; i < toDeployMSDTokensLength; i++) {
        let MSDToken = toDeployMSDTokens[i];
        console.log("\nGoing to set MSD minter: ", MSDToken);
        let MSDTokenAddress = assetsConfig[MSDToken]["msdAddress"];
        let msdContract = new ethers.Contract(MSDTokenAddress, msdMetadata.abi, signer);
        console.log("going to set MSD controller as only minter");
        tx = await msdContract._addMinter(msdControllerProxyAddress);
        await tx.wait(1);
        console.log(MSDToken, " minters in MSD token are:      ", await msdContract.getMinters(), "\n");
      }
    }

    /// ------------------------
    /// Set config in iMSD
    /// ------------------------
    // 8.1 Sets relationship of MSD and iMSD in the msdController.
    for (let i = 0; i < toDeployMSDTokensLength; i++) {
      let MSDToken = toDeployMSDTokens[i];
      console.log("\nGoing to set MSD controller minter: ", MSDToken);
      let toAddMSDTokenAddress = assetsConfig[MSDToken]["msdAddress"];
      let toAddiMSDTokenAddress = assetsConfig[MSDToken]["iMTokenAddress"];
      let iMSD_apy = assetsConfig[MSDToken]["borrowAPY"];
      console.log("toAddMSDTokenAddress", toAddMSDTokenAddress);
      console.log("toAddiMSDTokenAddress", toAddiMSDTokenAddress);

      tx = await msdController._addMSD(toAddMSDTokenAddress, [toAddiMSDTokenAddress]);
      await tx.wait(1);

      // 8.2 Sets borrow rate for iMSD token
      let currentBorrowRate = await fixedInterestModel.borrowRatesPerBlock(toAddiMSDTokenAddress);
      console.log("\niMSD current borrow rate is:  ", currentBorrowRate.toString());
      let interestPerDay = Math.pow(iMSD_apy, 1 / 365);
      let actualBorrowRate = (interestPerDay - 1) * 10 ** 18 / (blocksPerYear / 365);
      actualBorrowRate = actualBorrowRate.toFixed();

      if (currentBorrowRate.toString() != actualBorrowRate.toString()) {
        console.log("\nset borrow rate for iMSD token");
        console.log("iMSD to write borrow rate is: ", actualBorrowRate);
        tx = await fixedInterestModel._setBorrowRate(toAddiMSDTokenAddress, actualBorrowRate);
        await tx.wait(1);
        currentBorrowRate = await fixedInterestModel.borrowRatesPerBlock(toAddiMSDTokenAddress);
        console.log("after setting, iMSD current borrow rate is: ", currentBorrowRate.toString());
      }
    }

    console.log("Finish!");
    console.log("Run another script to set distribution speed!")

  } catch (e) {
    console.log(e.message);
  }
})();
