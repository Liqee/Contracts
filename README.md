### Lending prototyping

![Github CI](https://github.com/dforce-network/LendingContracts/workflows/Node.js%20CI/badge.svg) [![built-with openzeppelin](https://img.shields.io/badge/built%20with-OpenZeppelin-3677FF)](https://docs.openzeppelin.com/)

##### Usage

##### Prepare

Install packages:

```
npm install
```


##### Compile

```
npx hardhat compile
```

##### Test

```
npx hardhat test
```

##### Deploy

```
mv .example.env .env
```

*Should edit the `.env` file with your local environment variables.*

All parameters in `.example.env` are:

- COINMARKET_API: Optional, only for gas reporter.

- ETHERSCAN_KEY: Optional, to verify contracts automatically.

- INFURA_KEY: Required, infura key to connect to the Ethereum blockchain.

- PRIVATE_KEY: Required, the account to deploy the contracts.

- ASSETS: Required, an array that contains underlying tokens to deploy corresponding iTokens.
*Notice:USDC, has standard interest model and ETH, has non-standard interest model, should be at first*

Before runs the script to deploy contract, should set all underlying tokens address in `config/contractAddresses.js` and corresponding configs in `config/reservesConfigs.js` and `config/commonConfig.js`

```
npx hardhat run scripts/deploy.js --network kovan
```

## Kovan Contract Address(2021-01-28)

<table>
	<tr>
        <th>Contract Name</th>
    	<th>Contract Address</th>
	</tr>
	<tr>
		<td> Controller </td>
		<td> 0x2Ca95666318b3f70af80D74e7D3c92afF28Ed9f7 </td>
	</tr>
	<tr>
		<td> rewardDistributor </td>
		<td> 0xcb2cd6607634AB230F770800720D38365b21964E </td>
	</tr>
	<tr>
		<td> rewardToken </td>
		<td> 0x4B1a2A35Dd7c9fDBAA267FdB98d0c1fa22e25951 </td>
	</tr>
	<tr>
		<td> Stablecoin Interest Model </td>
		<td> 0xaE89BD72B938ab05b3c85626d03d47292C9bdE25 </td>
	</tr>
	<tr>
		<td> Standard Interest Model </td>
		<td> 0x21aEf38c572502c201059eBC61ef08e2006E2AB8 </td>
	</tr>
    <tr>
		<td> Oracle </td>
		<td> 0x5B1483a55f25F1FD3f183b228bC2215889780f94 </td>
	</tr>
	<tr>
		<td> LendingData </td>
		<td> 0x2a3336Fba4cf22F279e62B2E7517c0Ffe25275ed </td>
	</tr>
	<tr>
		<td> USDC </td>
		<td> 0x2ebE5cC3DE787C692c8458106f98B4A8392E111B </td>
	</tr>
    <tr>
		<td> iUSDC </td>
		<td> 0x63F0706c796CbC286bf1F178aaC5F8bb2972CB8f </td>
	</tr>
    <tr>
		<td> USDT </td>
		<td> 0x128c10cAD3780a541325A2f4B9E449114aD11D6b </td>
	</tr>
    <tr>
		<td> iUSDT </td>
		<td> 0xa60e87B95F62326Ded4C9d0A9990a7AbE8AB2dEf </td>
	</tr>
	<tr>
		<td> Dai </td>
		<td> 0x2543e88c4D50a94EB914012Ad98B03F6097DF35C </td>
	</tr>
	<tr>
		<td> iDAI </td>
		<td> 0x81F832DBa79b26fa07AC6eA108e72acFeE9CCfE1 </td>
	</tr>
	<tr>
		<td> WBTC </td>
		<td> 0x518a24e9ac0209a693132d3ff595850a733b6bb6 </td>
	</tr>
	<tr>
		<td> iWBTC </td>
		<td> 0xFcC5E915554aC7Bc3307C0262e71A1a82B078a3D </td>
	</tr>
	<tr>
		<td> iETH </td>
		<td> 0x4B54d1b03a2375a6b3891f31c5E1089C25C5D1bF </td>
	</tr>
</table>

## Rinkeby Contract Address(2021-1-5)

<table>
	<tr>
        <th>Contract Name</th>
    	<th>Contract Address</th>
	</tr>
	<tr>
		<td> Controller </td>
		<td> 0xEbE5Ae3bD6233586fa5Aaa95Eef8979891F0dcb4 </td>
	</tr>
	<tr>
		<td> Interest Model </td>
		<td> 0x82586F8F37C01aFd2D4c6c952F4e0a65E15B926C </td>
	</tr>
    <tr>
		<td> Oracle </td>
		<td> 0x8EE8E3d736Bb1179dD322458C6C267766bDa2C8E </td>
	</tr>
	<tr>
		<td> LendingData </td>
		<td> 0xFc2E4737cba8F69A154997fd1414Fd89623a7be2 </td>
	</tr>
	<tr>
		<td> USDC </td>
		<td> 0x7860EBE384820505902c71B0a41F7EcD8BEac4Fc </td>
	</tr>
    <tr>
		<td> iUSDC </td>
		<td> 0x6E1F6C96dEDCB8B24c864290565c74f021F261e9 </td>
	</tr>
    <tr>
		<td> USDT </td>
		<td> 0x6Cc5ef1CFfA716EaA8996067a7040c78ca227a89 </td>
	</tr>
    <tr>
		<td> iUSDT </td>
		<td> 0xeB5c8E496C4D6d10ede699120f1aF4f030E26E2E </td>
	</tr>
	<tr>
		<td> USDx </td>
		<td> 0xA8b9Ec7B6B78335150621f364C525824d9591Cc8 </td>
	</tr>
	<tr>
		<td> iUSDx </td>
		<td> 0x8fEB18a5752003Bf99677b05Ad40d5C06DCDcc56 </td>
	</tr>
	<tr>
		<td> iETH </td>
		<td> 0xbcEBd374d2050DEA45836f094803D0730563B9B3 </td>
	</tr>
</table>


## BSC Testnet(2021-03-02)

<table>
	<tr>
        <th>Contract Name</th>
    	<th>Contract Address</th>
	</tr>
	<tr>
		<td> Controller </td>
		<td> 0x01d76164a08AD68B7C07fc83cD475bcF653bCf55 </td>
	</tr>
	<tr>
		<td> rewardDistributor </td>
		<td> 0x8842c549Ab6Df56b83245e58a3F310121cD75C7b </td>
	</tr>
	<tr>
		<td> rewardToken </td>
		<td> 0x32E0962DCBc687c2a185d0C7e5a5A77e14444DA8 </td>
	</tr>
	<tr>
		<td> Stablecoin Interest Model </td>
		<td> 0x92927857d7612e7bDCD6aA6597E26B062c122dE8 </td>
	</tr>
	<tr>
		<td> Standard Interest Model </td>
		<td> 0x19eCA2B39BDD4f1e0ae6668FEbc2C15D03F4d4f5 </td>
	</tr>
    <tr>
		<td> Oracle </td>
		<td> 0xd6133CDB3C22d7FD4ec34E34D382b5Dc4cfa8763 </td>
	</tr>
	<tr>
		<td> LendingData </td>
		<td> 0x31412674392b08c54a54C762DcBF4bD27787BAf6 </td>
	</tr>
	<tr>
		<td> USDC </td>
		<td> 0xa945507cdf0020bb326f4bce88c2ecdc14f1b739 </td>
	</tr>
    <tr>
		<td> iUSDC </td>
		<td> 0x88711F03C0137fBCE3109e29B4f1E8697edC0dB4 </td>
	</tr>
    <tr>
		<td> USDT </td>
		<td> 0x5A43f949e0a1f4123454434B9eDd2b68fFEfd93b </td>
	</tr>
    <tr>
		<td> iUSDT </td>
		<td> 0x4e031167D196261f10034335Faa72d70aF7b6548 </td>
	</tr>
	<tr>
		<td> Dai </td>
		<td> 0x85a0413749d8ddabbe65b5AFf51d2063ae546F28 </td>
	</tr>
	<tr>
		<td> iDAI </td>
		<td> 0x0CB618b227c3F251C058AA69dfB1C975A37bb053 </td>
	</tr>
	<tr>
		<td> WBTC </td>
		<td> 0xaF1F79f3428A6cde3866582FBD13EAd044A37f6d </td>
	</tr>
	<tr>
		<td> iWBTC </td>
		<td> 0x6138CBb2f5C7297081Cb7A53D0802540b1a48867 </td>
	</tr>
	<tr>
		<td> iBNB </td>
		<td> 0x956A7A3A50252dcf69E03F6C88ce4Ec566b90117 </td>
	</tr>
</table>
