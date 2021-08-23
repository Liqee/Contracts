/// TODO: README.md
/// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/// Please modify the block number when fork
/// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// In this scripts, will update iToken to iToken V2,
// new features are:
//  - mintForSelfAndEnterMarket.
//  - override `_seizeInternal` to add some liquidated collateral to reserves.


// Right click on the script name and hit "Run" to execute
(async () => {
	try {
		console.log("Running deployWithEthers script...");

		const abiCoder = new ethers.utils.AbiCoder();
		const zeroAddress = ethers.constants.AddressZero;

		const contractName = "Timelock"; // Change this for other contract
		const iTokenV2Name = "iTokenV2";
		// const fixedInterestModelName = "FixedInterestRateModel";

		let tx;

		let targets = [];
		let values = [];
		let signatures = [];
		let calldatas = [];

		let signer, metadata;
		let timeLockAddress;
		let timeLock;
		let artifactsPath, iTokenV2ArtifactsPath, fixedInterestModelArtifactsPath;
		let iTokenV2Metadata, fixedInterestModelMetadata;

		// Ethereum
		timeLockAddress = "0xBB247f5Ac912196A5AA80E9DD6aB252B79D6Ea25";
		let proxyAdminAddress = "0x4FF0455bcfBB5886607c078E0F43Efb5DE34DeF4";
		let iTokenV2ImplAddress = "";
		let iETHV2ImplAddress = "";
		let alliTokens = [
			"0x1180c114f7fAdCB6957670432a3Cf8Ef08Ab5354",   // iUSDT
			"0x2f956b2f801c6dad74E87E7f45c94f6283BF0f45",   // iUSDC
			"0x298f243aD592b6027d4717fBe9DeCda668E3c3A8",   // iDAI
			"0x24677e213DeC0Ea53a430404cF4A11a6dc889FCe",   // iBUSD
			"0x5812fCF91adc502a765E5707eBB3F36a07f63c02",   // iWBTC
			"0xb3dc7425e63E1855Eb41107134D471DD34d7b239",   // iDF
			"0x164315EA59169D46359baa4BcC6479bB421764b6",   // iGOLDx
			"0x47566acD7af49D2a192132314826ed3c3c5f3698",   // iHBTC
			"0xbeC9A824D6dA8d0F923FD9fbec4FAA949d396320",   // iUNI
			"0x1AdC34Af68e970a93062b67344269fD341979eb0",   // iUSX_gp
			"0x44c324970e5CbC5D4C3F3B7604CbC6640C2dcFbF",   // iEUX_gp
			"0x4013e6754634ca99aF31b5717Fa803714fA07B35",   // ixBTC_gp
			"0x237C69E082A94d37EBdc92a84b58455872e425d6",   // ixETH_gp
			"0xF54954BA7e3cdFDA23941753b48039aB5192AEa0",   // iUSX_sp
			"0xab9C8C81228aBd4687078EBDA5AE236789b08673",   // iEUX_sp
		];

		// _setProtocolSeizeRatio
		let newProtocolSeizeRatio = [
			ethers.utils.parseEther("0.025"),   // iUSDT
			ethers.utils.parseEther("0.025"),   // iUSDC
			ethers.utils.parseEther("0.025"),   // iDAI
			ethers.utils.parseEther("0.025"),   // iBUSD
			ethers.utils.parseEther("0.025"),   // iWBTC
			ethers.utils.parseEther("0.025"),   // iDF
			ethers.utils.parseEther("0.025"),   // iGOLDx
			ethers.utils.parseEther("0.025"),   // iHBTC
			ethers.utils.parseEther("0.025"),   // iUNI
			ethers.utils.parseEther("0.025"),   // iUSX_gp
			ethers.utils.parseEther("0.025"),   // iEUX_gp
			ethers.utils.parseEther("0.025"),   // ixBTC_gp
			ethers.utils.parseEther("0.025"),   // ixETH_gp
			ethers.utils.parseEther("0.025"),   // iUSX_sp
			ethers.utils.parseEther("0.025"),   // iEUX_sp
		];

		let iETHProxy = "0x5ACD75f21659a59fFaB9AEBAf350351a8bfaAbc0";
		let iETHProtocolSeizeRatio = ethers.utils.parseEther("0.025");

		// // BSC
		// timeLockAddress = "0x511b05f37e27a88E284322aF0bDE41A91771316d";
		// let proxyAdminAddress = "0x0800604DA276c1D5e9c2C7FEC0e3b43FAb1Ca61a";
		// let iTokenV2ImplAddress = "";
		// let iETHV2ImplAddress = "";
		// let alliTokens = [
		//   "0xd57E1425837567F74A35d07669B23Bfb67aA4A93",   // iBNB
		//   "0x0b66A250Dadf3237DdB38d485082a7BfE400356e",   // iBTC
		//   "0x0BF8C72d618B5d46b055165e21d661400008fa0F",   // iUSDT
		//   "0xAF9c10b341f55465E8785F0F81DBB52a9Bfe005d",   // iUSDC
		//   "0xAD5Ec11426970c32dA48f58c92b1039bC50e5492",   // iDAI
		//   "0xFc5Bb1E8C29B100Ef8F12773f972477BCab68862",   // iADA
		//   "0x55012aD2f0A50195aEF44f403536DF2465009Ef7",   // iATOM
		//   "0x5511b64Ae77452C7130670C79298DEC978204a47",   // iBUSD
		//   "0xeC3FD540A2dEE6F479bE539D64da593a59e12D08",   // iDF
		//   "0x9ab060ba568B86848bF19577226184db6192725b",   // iDOT
		//   "0xD739A569Ec254d6a20eCF029F024816bE58Fb810",   // iFIL
		//   "0xc35ACAeEdB814F42B2214378d8950F8555B2D670",   // iGOLDx
		//   "0xee9099C1318cf960651b3196747640EB84B8806b",   // iUNI
		//   "0x7B933e1c1F44bE9Fb111d87501bAADA7C8518aBe",   // iUSX_gp
		//   "0x983A727Aa3491AB251780A13acb5e876D3f2B1d8",   // iEUX_gp
		//   "0x219B850993Ade4F44E24E6cac403a9a40F1d3d2E",   // ixBTC_gp
		//   "0xF649E651afE5F05ae5bA493fa34f44dFeadFE05d",   // ixETH_gp
		//   "0x911F90e98D5c5C3a3B0c6c37Bf6ea46D15eA6466",   // iUSX_sp
		//   "0x8Af4f25019E00c64B5c9d4A49D71464d411c2199",   // iEUX_sp
		// ];

		// let newProtocolSeizeRatio = [
		//   ethers.utils.parseEther("0.025"),   // iUSDT
		//   ethers.utils.parseEther("0.025"),   // iUSDC
		//   ethers.utils.parseEther("0.025"),   // iDAI
		//   ethers.utils.parseEther("0.025"),   // iBUSD
		//   ethers.utils.parseEther("0.025"),   // iWBTC
		//   ethers.utils.parseEther("0.025"),   // iDF
		//   ethers.utils.parseEther("0.025"),   // iGOLDx
		//   ethers.utils.parseEther("0.025"),   // iHBTC
		//   ethers.utils.parseEther("0.025"),   // iUNI
		//   ethers.utils.parseEther("0.025"),   // iUSX_gp
		//   ethers.utils.parseEther("0.025"),   // iEUX_gp
		//   ethers.utils.parseEther("0.025"),   // ixBTC_gp
		//   ethers.utils.parseEther("0.025"),   // ixETH_gp
		//   ethers.utils.parseEther("0.025"),   // iUSX_sp
		//   ethers.utils.parseEther("0.025"),   // iEUX_sp
		// ];

		// let iETHProxy = "0x390bf37355e9dF6Ea2e16eEd5686886Da6F47669";
		// let iETHProtocolSeizeRatio = ethers.utils.parseEther("0.025");

		// Default is `timelock` contract.
		artifactsPath = `browser/artifacts/contracts/governance/${contractName}.sol/${contractName}.json`; // Change this for different path
		iTokenV2ArtifactsPath = `browser/artifacts/contracts/${iTokenV2Name}.sol/${iTokenV2Name}.json`;

		if (typeof remix == "object") {
			// Note that the script needs the ABI which is generated from the compilation artifact.
			// Make sure contract is compiled and artifacts are generated

			iTokenV2Metadata = JSON.parse(
			await remix.call("fileManager", "getFile", iTokenV2ArtifactsPath)
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

			// Mock iTokenV2 implementation
			const iTokenV2Factory = await ethers.getContractFactory("iTokenV2");
			const iTokenV2Contract = await iTokenV2Factory.connect(signer).deploy();
			await iTokenV2Contract.deployed();
			iTokenV2ImplAddress = iTokenV2Contract.address;

			// Mock iETHV2 implementation
			const iETHV2Factory = await ethers.getContractFactory("iETHV2");
			const iETHV2Contract = await iETHV2Factory.connect(signer).deploy();
			await iETHV2Contract.deployed();
			iETHV2ImplAddress = iETHV2Contract.address;

			metadata = require("../artifacts/contracts/governance/TimeLock.sol/Timelock.json");
			iTokenV2Metadata = require("../artifacts/contracts/iTokenV2.sol/iTokenV2.json");
		}

		let i, data;

		timeLock = new ethers.Contract(
			timeLockAddress,
			metadata.abi,
			signer
		);
		console.log("time lock contract address: ", timeLock.address);

		// 1. Set config for iTokens.
		for (i = 0; i < alliTokens.length; i++) {
			// Update iToken implementation.
			data = abiCoder.encode(
				["address","address"],
				[alliTokens[i],iTokenV2ImplAddress]
			);

			targets.push(proxyAdminAddress);
			values.push(0);
			signatures.push("upgrade(address,address)");
			calldatas.push(data);

			console.log(i)

			// Set new protocol seize ratio.
			data = abiCoder.encode(
				["uint256"],
				[newProtocolSeizeRatio[i]]
			);

			targets.push(alliTokens[i]);
			values.push(0);
			signatures.push("_setProtocolSeizeRatio(uint256)");
			calldatas.push(data);
		}

		// 2. Update iETH implementation.
		data = abiCoder.encode(
			["address","address"],
			[iETHProxy,iETHV2ImplAddress]
		);

		targets.push(proxyAdminAddress);
		values.push(0);
		signatures.push("upgrade(address,address)");
		calldatas.push(data);

		// 3. Set new protocol seize ratio for iETH.
		data = abiCoder.encode(
			["uint256"],
			[iETHProtocolSeizeRatio]
		);

		targets.push(iETHProxy);
		values.push(0);
		signatures.push("_setProtocolSeizeRatio(uint256)");
		calldatas.push(data);

		console.log("going to execute this action.");

		await timeLock.executeTransactions(targets, values, signatures, calldatas);

		// 4. Have a final check for iToken.
		for (i = 0; i < alliTokens.length; i++) {
			let iTokenContract = new ethers.Contract(
				alliTokens[i],
				iTokenV2Metadata.abi,
				signer
			);

			console.log("iToken ", alliTokens[i], " seize ratio ", (await iTokenContract.protocolSeizeRatio()).toString());
		}

		let iETHContract = new ethers.Contract(
			iETHProxy,
			iTokenV2Metadata.abi,
			signer
		);

		console.log("iETH ", iETHProxy, " seize ratio ", (await iETHContract.protocolSeizeRatio()).toString());


		console.log("finish executing this action.");
	} catch (e) {
		console.log(e.message);
	}
})();
