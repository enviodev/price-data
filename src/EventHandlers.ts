/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Api3ServerV1,
  OraclePoolPrice,
  UniswapV3Pool,
  UniswapV3PoolPrice,
  TVLDollars,
} from "generated";
import fetchEthPrice from "./request";

let latestOraclePrice = 0n;
let latestPoolPrice = 0n;

Api3ServerV1.UpdatedBeaconSetWithBeacons.handler(async ({ event, context }) => {
  const entity: OraclePoolPrice = {
    id: `${event.chainId}-${event.block.number}-${event.logIndex}`,
    value: event.params.value,
    timestamp: event.params.timestamp,
    block: event.block.number,
  };

  latestOraclePrice = event.params.value / BigInt(10**18);

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

  let offChainPrice=0;
  if (event.block.number > 11000000) {
    offChainPrice = await fetchEthPrice(event.block.number);
    console.log(offChainPrice);
  }

  const ethDepositedUsd = latestPoolPrice * event.params.amount1 / BigInt(10**18);

  const TVLDollars: TVLDollars = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    timestamp: event.block.timestamp,
    block: event.block.number,
    oraclePrice: latestOraclePrice,
    poolPrice: latestPoolPrice,
    offChainPrice: Number(offChainPrice.toFixed(2)),
    ethDepositedUsd: Number(ethDepositedUsd),
  }


  context.TVLDollars.set(TVLDollars);
});
