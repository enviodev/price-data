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

let latestOraclePrice = 0;
let latestPoolPrice = 0;

Api3ServerV1.UpdatedBeaconSetWithBeacons.handler(async ({ event, context }) => {
  // Filter out the beacon set for the ETH/USD price
  if (event.params.beaconSetId != '0x3efb3990846102448c3ee2e47d22f1e5433cd45fa56901abe7ab3ffa054f70b5') {
    return
  }

  const entity: OraclePoolPrice = {
    id: `${event.chainId}-${event.block.number}-${event.logIndex}`,
    value: event.params.value,
    timestamp: event.params.timestamp,
    block: event.block.number,
  };

  latestOraclePrice = Number(event.params.value) / Number(10 ** 18);

  context.OraclePoolPrice.set(entity);
});

UniswapV3Pool.Swap.handler(async ({ event, context }) => {
  const entity: UniswapV3PoolPrice = {
    id: `${event.chainId}-${event.block.number}-${event.logIndex}`,
    sqrtPriceX96: event.params.sqrtPriceX96,
    timestamp: event.block.timestamp,
    block: event.block.number,
  };

  latestPoolPrice = Number(BigInt(2 ** 192) / (BigInt(event.params.sqrtPriceX96) * BigInt(event.params.sqrtPriceX96)));

  context.UniswapV3PoolPrice.set(entity);
});

UniswapV3Pool.Mint.handler(async ({ event, context }) => {

  const offChainPrice = await fetchEthPriceFromUnix(event.block.timestamp);

  const ethDepositedUsdPool = (latestPoolPrice * Number(event.params.amount1)) / (10 ** 18);
  const ethDepositedUsdOffchain = (offChainPrice * Number(event.params.amount1)) / (10 ** 18);
  const ethDepositedUsdOrcale = (latestOraclePrice * Number(event.params.amount1)) / (10 ** 18);

  const EthDeposited: EthDeposited = {
    id: `${event.chainId}-${event.block.number}-${event.logIndex}`,
    timestamp: event.block.timestamp,
    block: event.block.number,
    oraclePrice: round(latestOraclePrice),
    poolPrice: round(latestPoolPrice),
    offChainPrice: round(offChainPrice),
    depositedPool: round(ethDepositedUsdPool),
    depositedOffchain: round(ethDepositedUsdOffchain),
    depositedOrcale: round(ethDepositedUsdOrcale),
    offchainOracleDiff: round(((ethDepositedUsdOffchain - ethDepositedUsdOrcale)/ethDepositedUsdOffchain)*100),
    txHash: event.transaction.hash,
  }

  context.EthDeposited.set(EthDeposited);
});


function round(value: number) {
  return Math.round(value * 100) / 100;
}