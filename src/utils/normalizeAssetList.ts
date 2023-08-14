const normalizeAssetList = (items: Asset.Item[], isFreshData = true): Asset.Item[] =>
  items.map(item => ({
    ...item,
    priceUsd: (+item.priceUsd).toFixed(2),
    changePercent24Hr: (+item.changePercent24Hr).toFixed(4),
    _freshData: isFreshData,
    _diff: 0,
    disabledText: item.disabledText || '',
  }));

export default normalizeAssetList;
