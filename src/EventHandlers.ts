/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Api3ServerV1,
  OraclePoolPrice,
  UniswapV3Pool,
  UniswapV3PoolPrice,
  EthDeposited,
} from "generated";
import fetchEthPriceFromUnix from "./request";

let latestOraclePrice = 0n;
let latestPoolPrice = 0n;

Api3ServerV1.UpdatedBeaconSetWithBeacons.handler(async ({ event, context }) => {
  const entity: OraclePoolPrice = {
    id: `${event.chainId}-${event.block.number}-${event.logIndex}`,
    value: event.params.value,
    timestamp: event.params.timestamp,
    block: event.block.number,
  };

  latestOraclePrice = event.params.value / BigInt(10 ** 18);

  context.OraclePoolPrice.set(entity);
});

UniswapV3Pool.Swap.handler(async ({ event, context }) => {
  const entity: UniswapV3PoolPrice = {
    id: `${event.chainId}-${event.block.number}-${event.logIndex}`,
    sqrtPriceX96: event.params.sqrtPriceX96,
    timestamp: event.block.timestamp,
    block: event.block.number,
  };

  latestPoolPrice = BigInt(2 ** 192) / (BigInt(event.params.sqrtPriceX96) * BigInt(event.params.sqrtPriceX96));

  context.UniswapV3PoolPrice.set(entity);
});

UniswapV3Pool.Mint.handler(async ({ event, context }) => {

  const offChainPrice = await fetchEthPriceFromUnix(event.block.timestamp);

  const ethDepositedUsdPool = latestPoolPrice * event.params.amount1 / BigInt(10 ** 18);
  const ethDepositedUsdOffchain = BigInt(offChainPrice.toFixed(0)) * event.params.amount1 / BigInt(10 ** 18);

  const EthDeposited: EthDeposited = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    timestamp: event.block.timestamp,
    block: event.block.number,
    oraclePrice: latestOraclePrice,
    poolPrice: latestPoolPrice,
    offChainPrice: Number(offChainPrice.toFixed(2)),
    ethDepositedUsdPool: Number(ethDepositedUsdPool),
    ethDepositedUsdOffchain: Number(ethDepositedUsdOffchain),
    usdDeposited: Number(event.params.amount0/BigInt(10**18)),
    txHash: event.transaction.hash,
  }


  context.EthDeposited.set(EthDeposited);
});
