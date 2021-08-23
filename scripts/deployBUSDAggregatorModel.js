const hre = require("hardhat");

const BUSDETHAggregator = '0x614715d2Af89E6EC99A233818275142cE88d1Cfd';
const ETHUSDAggregator = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';

async function main() {
  // Deploys BUSDAggregatorModel.
  console.log("Deploy BUSDAggregatorModel contract");
  const BUSDAggregatorModel = await hre.ethers.getContractFactory("BUSDAggregatorModel");
  const aggregatorModel = await BUSDAggregatorModel.deploy(BUSDETHAggregator, ETHUSDAggregator);
  await aggregatorModel.deployTransaction.wait(2);
  console.log("BUSDAggregatorModel contract", aggregatorModel.address, "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });