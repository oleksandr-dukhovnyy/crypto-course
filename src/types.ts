declare namespace Asset {
  export interface APIResponseItem {
    id: string; // 'bitcoin',
    rank: string; // '1',
    symbol: string; // 'BTC',
    name: string; // 'Bitcoin';
    supply: string; // '17193925.0000000000000000';
    maxSupply: string; // '21000000.0000000000000000';
    marketCapUsd: string; // '119179791817.6740161068269075';
    volumeUsd24Hr: string; // '2928356777.6066665425687196';
    priceUsd: string; // '6931.50585';
    changePercent24Hr: string; // '-0.8101';
    vwap24Hr: string; // '7175.0663247679233209';
  }

  export interface Item extends APIResponseItem {
    _diff: number;
    _freshData: boolean;
    disabledText: string;
  }

  export interface NewPrices {
    [key: string]: string;
  }
}

declare namespace App {
  export type View = 'list' | 'search';

  export interface StylesList {
    [key: string]: string | number;
  }
}
