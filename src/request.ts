const SUBGRAPH_API_KEY = process.env.SUBGRAPH_API_KEY;

async function fetchEthPrice(block: number): Promise<any> {
    const response = await fetch(`https://gateway.thegraph.com/api/${SUBGRAPH_API_KEY}/subgraphs/id/2LHovKznvo8YmKC9ZprPjsYAZDCc4K5q4AYz8s3cnQn1`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `{ pool(id: "0xf52b4b69123cbcf07798ae8265642793b2e8990c", block: {number: ${block}}) { token1Price token0Price } }`,
            operationName: "Subgraphs",
            variables: {}
        })
    });
    const data = await response.json() as any;
    return Number(data.data.pool.token0Price);
}

export default fetchEthPrice;