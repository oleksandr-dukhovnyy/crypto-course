let closePrevSockets = () => {};

const API = {
  async search(
    searchStr: string,
    options: { offset?: number; limit?: number } = {}
  ) {
    const { offset = 0, limit } = options;

    /*
      {
        "id": "bitcoin",
        "rank": "1",
        "symbol": "BTC",
        "name": "Bitcoin",
        "supply": "17193925.0000000000000000",
        "maxSupply": "21000000.0000000000000000",
        "marketCapUsd": "119150835874.4699281625807300",
        "volumeUsd24Hr": "2927959461.1750323310959460",
        "priceUsd": "6929.8217756835584756",
        "changePercent24Hr": "-0.8101417214350335",
        "vwap24Hr": "7175.0663247679233209"
      }[]
    */

    const url = new URL('https://api.coincap.io/v2/assets');
    url.searchParams.append('search', searchStr);

    if (offset) {
      url.searchParams.append('offset', '' + offset);
    }

    if (limit !== undefined && limit !== null) {
      url.searchParams.append('limit', '' + limit);
    }

    // const now = performance.now();

    const { data } = await fetch(url).then((res) => res.json());

    // console.log(
    //   `API.search timing (limit: ${limit}, loaded: ${
    //     (data || []).length
    //   }) ms: `,
    //   (performance.now() - now).toFixed(3)
    // );

    return data || [];
  },
  async getItemsData(itemsIdsList: string[]) {
    const url =
      'https://api.coincap.io/v2/assets?ids=' + itemsIdsList.join(',');

    const data = await fetch(url).then((res) => res.json());

    return data.data || [];
  },
  watchPrices(ids: string[] = [], callback = (prices: Asset.NewPrices) => {}) {
    // ids = string[]

    closePrevSockets();

    const pricesWs = new WebSocket(
      'wss://ws.coincap.io/prices?assets=' + ids.join(',')
    );

    pricesWs.onmessage = function (msg) {
      callback(JSON.parse(msg.data));
    };

    closePrevSockets = () => pricesWs.close();

    return () => pricesWs.close();
  },
};

export default API;
