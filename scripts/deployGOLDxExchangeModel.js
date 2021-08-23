const hre = require("hardhat");

const GOLDx = '0x355C665e101B9DA58704A8fDDb5FeeF210eF20c0';

async function main() {

  // Deploys GOLDx exchangeRateModel contract.
  console.log("Deploy GOLDx exchangeRateModel contract");
  const GOLDxExchangeRateModel = await hre.ethers.getContractFactory("GOLDxExchangeRateModel");
  const exchangeRateModel = await GOLDxExchangeRateModel.deploy(GOLDx);
  await exchangeRateModel.deployTransaction.wait(2);
  console.log("oracle contract", exchangeRateModel.address, "\n");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });