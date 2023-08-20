import normalizeAssetList from './normalizeAssetList';
import { initModuleLogger } from './logs';

const log = initModuleLogger('~/src/utils/API');

let closePrevSockets = () => {};

const API = {
  async search(searchStr: string, options: { offset?: number; limit?: number } = {}) {
    const { offset = 0, limit } = options;
    // console.log('API CALL: search', searchStr);

    log({
      msg: `search "${searchStr}"`,
      trace: ['method search'],
      type: 'info',
    });

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

    const { data } = await fetch(url).then(res => res.json());

    // console.log(
    //   `API.search timing (limit: ${limit}, loaded: ${
    //     (data || []).length
    //   }) ms: `,
    //   (performance.now() - now).toFixed(3)
    // );

    return data || [];
  },
  async getItemsData(itemsIdsList: string[]) {
    log({
      msg: `getItemsData "${itemsIdsList.join(', ')}"`,
      trace: ['method getItemsData'],
      type: 'info',
    });
    // console.log('API CALL: getItemsData', itemsIdsList);

    const url = 'https://api.coincap.io/v2/assets?ids=' + itemsIdsList.join(',');

    const data = await fetch(url).then(res => res.json());

    return data.data || [];
  },
  watchPrices(ids: string[] = [], callback = (prices: Asset.NewPrices) => {}) {
    log({
      msg: `watchPrices "${ids.join(', ')}"`,
      trace: ['method watchPrices'],
      type: 'info',
    });
    // ids = string[]

    closePrevSockets();

    const pricesWs = new WebSocket('wss://ws.coincap.io/prices?assets=' + ids.join(','));

    pricesWs.onmessage = function (msg) {
      callback(JSON.parse(msg.data));
    };

    closePrevSockets = () => pricesWs.close();

    return () => pricesWs.close();
  },

  loadMarketsDiffs() {
    // /assets/{{id}}/markets
  },

  loadTopAssets(limit: number = 100): Promise<Asset.Item[] | null> {
    // console.log('API CALL: loadTopAssets');
    log({
      msg: `loadTopAssets "limit: ${limit}"`,
      trace: ['method loadTopAssets'],
      type: 'info',
    });

    return fetch(`https://api.coincap.io/v2/assets?limit=${limit}`)
      .then(res => {
        log({
          msg: `status ${res.status} (${res.statusText})`,
          trace: ['method loadTopAssets', 'fetch', 'then'],
          type: 'info',
        });

        return res.json();
      })
      .then(({ data }) => {
        const _data = normalizeAssetList(data);

        log({
          msg: _data.map((item: Asset.Item) => item.id).join(', '),
          trace: ['method loadTopAssets', 'fetch', 'then', 'then'],
          type: 'info',
        });

        return data;
      })
      .catch(e => {
        log({
          msg: `data > ${JSON.stringify(e, null, 2)}`,
          trace: ['method loadTopAssets', 'fetch', 'then', 'catch'],
          type: 'error',
        });
      });
  },
};

export default API;
