import { createPublicClient, http, parseAbi, getContract } from 'viem';
import { blast } from 'viem/chains';

const usdb = '0x4300000000000000000000000000000000000003';
const weth = '0x4300000000000000000000000000000000000004';
const factoryAddress = '0x792edAdE80af5fC680d96a2eD80A44247D2Cf6Fd';
const factoryAbi = parseAbi(["function getPool( address tokenA, address tokenB, uint24 fee ) external view returns (address pool)"]);

const providerUrl = 'https://rpc.ankr.com/blast'; 
const poolBips = 3000;  // 0.3%. This is measured in hundredths of a bip

const client = createPublicClient({
    chain: blast,
    transport: http(providerUrl),
});

const factoryContract = getContract({
    abi: factoryAbi,
    address: factoryAddress,
    client: client,
});

(async () => {
    const poolAddress = await factoryContract.read.getPool([usdb, weth, poolBips]);
    console.log(poolAddress);
})();