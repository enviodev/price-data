import { createPublicClient, http, parseAbi, getContract } from 'viem';
import { goerli } from 'viem/chains';

// The variables you need to plug in first.
// If you dont know how to get these, see the extra info listed under this code snippet.
const token1Address = '0x4300000000000000000000000000000000000003';
const token2Address = '0x4300000000000000000000000000000000000004';
const factoryAddress = '0x792edAdE80af5fC680d96a2eD80A44247D2Cf6Fd';
const factoryAbi = parseAbi([{
  "constant": true,
  "inputs": [
    { "name": "tokenA", "type": "address" },
    { "name": "tokenB", "type": "address" },
    { "name": "fee", "type": "uint24" }
  ],
  "name": "getPool",
  "outputs": [
    { "name": "pool", "type": "address" }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}]);  // Use raw ABI listed on goerli etherscan. Dont import ABI from the Uniswap SDK npm package, because mainnet & testnet ABI's are likely different

const providerUrl = 'https://rpc.ankr.com/blast';  // Replace with your api key
const poolBips = 3000;  // 0.3%. This is measured in hundredths of a bip

const client = createPublicClient({
  chain: goerli,
  transport: http(providerUrl),
});

const factoryContract = getContract({
  address: factoryAddress,
  abi: factoryAbi,
  publicClient: client,
});

(async () => {
  const poolAddress = await factoryContract.read.getPool([token1Address, token2Address, poolBips]);
  console.log(poolAddress);
})();