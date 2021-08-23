const { network } = require("hardhat");

const {
    fixtureDeployController,
    deployMSDController,
} = require("../test/helpers/fixtures.js");
const { formatToHumanReadable, txWait } = require("../test/helpers/utils.js");

const allContractAddresses = require("../config/contractAddresses.js");
const allReservesConfigs = require("../config/reservesConfigs.js");
const allCommonConfigs = require("../config/commonConfig.js");


const currentNet = network.name;
console.log("current network is: ", currentNet);
console.log("all supports tokens", allContractAddresses[currentNet]);

let commonConfigs = allCommonConfigs[currentNet];

let deployer;
let controller, msdController, controllerType;

async function prepareConfig() {
    if (!allContractAddresses.hasOwnProperty(currentNet)) {
        console.log("Please set contract address config in the file `contractAddress.js` for the network ", currentNet);
        process.exit(1)
    }

    if (!allCommonConfigs.hasOwnProperty(currentNet)) {
        console.log("Please set config in the file `commonConfig.js` for the network ", currentNet);
        process.exit(1)
    }
}

async function deployControllerContract(controllerType, controllerAddress, closeFactor, liquidationIncentive) {
    let controllerContract;

    if (controllerType == "iToken") {
        if (!controllerAddress) {
            console.log("\nPrepare to deploy the iToken controller contract");
            controllerContract = (await fixtureDeployController()).controller;
            // Only deploy contract implementation
            // let ControllerV2 = await ethers.getContractFactory("ControllerV2");
            // let controllerContract = await ControllerV2.deploy();

            // await controllerContract.deployed();

            // tx = await controllerContract.initialize();
            // await txWait(currentNet, tx);
        } else {
            console.log("\niToken controller contract has been deployed");
            let controllerFactory = await ethers.getContractFactory("Controller");
            controllerContract = controllerFactory.attach(controllerAddress);
        }

        // set close factor
        let currentCloseFactor = await controllerContract.closeFactorMantissa();
        let toSetCloseFactor = ethers.utils.parseEther(closeFactor);
        if (currentCloseFactor.toString() != toSetCloseFactor.toString()) {
            console.log("going to set close factor: ", closeFactor);
            tx = await controllerContract._setCloseFactor(toSetCloseFactor);
            await txWait(currentNet, tx);
            console.log("finish to set close factor\n");
        }

        // set liquidation incentive
        let currentLiquidationIncentive = await controllerContract.liquidationIncentiveMantissa();
        let toSetLiquidatationIncentive = ethers.utils.parseEther(liquidationIncentive);
        if (currentLiquidationIncentive.toString() != toSetLiquidatationIncentive.toString()) {
            console.log("going to set liquidation incentive", liquidationIncentive);
            tx = await controllerContract._setLiquidationIncentive(toSetLiquidatationIncentive);
            await txWait(currentNet, tx);
            console.log("finish to set liquidation incentive\n");
        }
    } else if (controllerType == "msdToken") {
        if (!controllerAddress) {
            console.log("\nPrepare to deploy the MSD controller contract");
            controllerContract = await deployMSDController();
        } else {
            console.log("\nMSD controller contract has been deployed");
            let controllerFactory = await ethers.getContractFactory("MSDController");
            controllerContract = controllerFactory.attach(controllerAddress);
        }
    }

    return controllerContract;
}

async function main() {
    await prepareConfig();

    [deployer] = await ethers.getSigners();
    console.log("\nDeploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

    let closeFactor = (allReservesConfigs[currentNet]).closeFactor;
    if (!closeFactor) {
        console.log("\nCan not get a valid close factor in config");
        return;
    }

    let liquidationIncentive = (allReservesConfigs[currentNet]).liquidationIncentive;
    if (!liquidationIncentive) {
        console.log("\nCan not get a valid liquidation incentive in config");
        return;
    }

    // deploy controller contract for iTokens and then set close factor and liquidation incentive
    controllerType = "iToken";
    controller = await deployControllerContract(
        controllerType,
        commonConfigs.controller,
        closeFactor,
        liquidationIncentive
    );
    console.log("\nController", controller.address);

    // deploy controller contract for MSD Tokens
    controllerType = "msdToken";
    msdController = await deployControllerContract(
        controllerType,
        commonConfigs.msdController,
    );
    console.log("\nMSD token controller", msdController.address);

    console.log("\ndouble check the setting values: ");

    let contractCloseFactor = await controller.closeFactorMantissa();
    console.log("contract close factor is: ", await formatToHumanReadable(contractCloseFactor, 2));

    let contractLiquidationIncentive = await controller.liquidationIncentiveMantissa();
    console.log("contract liquidation Incentive is: ", await formatToHumanReadable(contractLiquidationIncentive, 2));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
