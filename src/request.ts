const COIN_GECKO_API_KEY = process.env.COIN_GECKO_API_KEY;

async function fetchEthPriceFromUnix(unix: number, token = "ethereum"): Promise<any> {
    // convert unix to date dd-mm-yyyy
    const _date = new Date(unix * 1000);
    const date = _date.toISOString().slice(0, 10).split("-").reverse().join("-");
    return fetchEthPrice(date.slice(0, 10), token);
}

async function fetchEthPrice(date: string, token = "ethereum"): Promise<any> {
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', 'x-cg-demo-api-key': COIN_GECKO_API_KEY }
    };

    return fetch(`https://api.coingecko.com/api/v3/coins/${token}/history?date=${date}&localization=false`, options as any)
        .then(res => res.json())
        .then((res: any) => {
            const usdPrice = res.market_data.current_price.usd;
            console.log(`ETH price on ${date}: ${usdPrice}`);
            return usdPrice;
        })
        .catch(err => console.error(err));
}

export default fetchEthPriceFromUnix;