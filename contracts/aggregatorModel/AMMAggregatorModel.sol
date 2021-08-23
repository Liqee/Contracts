// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./AggregatorModel.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface UniswapV2Library {
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint256[] memory amounts);
}

contract AMMAggregatorModel is AggregatorModel {

    UniswapV2Library immutable private router;
    address[] private path;
    uint256 immutable private pathLast;
    uint256 immutable private baseAmount;

    constructor(UniswapV2Library _router, address[] memory _path) public {
        router = _router;
        require(_path.length > 1, "_path length must be greater than 1!");
        path = _path;
        pathLast = _path.length - 1;
        baseAmount = 10 ** uint256(ERC20(_path[0]).decimals());
    }

    /**
     * @notice Get the price of the token against the U.S. dollar (USDC) from uniswap.
     * @return The price of the asset aggregator (pathLast by decimals), zero under unexpected case.
     */
    function latestAnswer() external view override returns (int256) {
        int256 _amountOut = int256(router.getAmountsOut(baseAmount, path)[pathLast]);
        return _amountOut > 0 ? _amountOut : 0;
    }

    /**
     * @notice represents the number of decimals the aggregator responses represent.
     * @return The decimal point of the aggregator.
     */
    function decimals() external view override returns (uint8) {
        return ERC20(path[pathLast]).decimals();
    }

    /**
     * @dev Used to query the source address of the router.
     * @return Router address.
     */
    function getRouter() external view returns (UniswapV2Library) {
        return router;
    }

    /**
     * @dev Used to query the source address of the router path.
     * @return Router path address list
     */
    function getPath() external view returns (address[] memory) {
        return path;
    }

    /**
     * @dev performs chained getAmountOut calculations on any number of pairs.
     * @return Exchange amount list
     */
    function getAmountsOut(UniswapV2Library _router, uint256 _amount, address[] calldata _path) external view returns (uint256[] memory) {
        return _router.getAmountsOut(_amount, _path);
    }
}
