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

let latestOraclePrice = 0n;
let latestPoolPrice = 0n;

Api3ServerV1.UpdatedBeaconSetWithBeacons.handler(async ({ event, context }) => {
  const entity: OraclePoolPrice = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
    timestamp: event.params.timestamp,
    block: event.block.number,
  };

  latestOraclePrice = event.params.value;

  context.OraclePoolPrice.set(entity);
});

UniswapV3Pool.Swap.handler(async ({ event, context }) => {
  // const entity: UniswapV3PoolPrice = {
  //   id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  //   sender: event.params.sender,
  //   recipient: event.params.recipient,
  //   amount0: event.params.amount0,
  //   amount1: event.params.amount1,
  //   sqrtPriceX96: event.params.sqrtPriceX96,
  //   liquidity: event.params.liquidity,
  //   tick: event.params.tick,
  // };

  const entity: UniswapV3PoolPrice = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sqrtPriceX96: event.params.sqrtPriceX96,
    timestamp: event.block.timestamp,
    block: event.block.number,
  };

  latestPoolPrice = BigInt(event.params.sqrtPriceX96) * BigInt(event.params.sqrtPriceX96) / BigInt(2 ** 96);

  context.UniswapV3PoolPrice.set(entity);
});

UniswapV3Pool.Mint.handler(async ({ event, context }) => {
  const TVLDollars: TVLDollars = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    timestamp: event.block.timestamp,
    block: event.block.number,
    oraclePrice: latestOraclePrice,
    poolPrice: latestPoolPrice,
    coinGeckoPrice: 0n,
  }

  context.TVLDollars.set(TVLDollars);
});
