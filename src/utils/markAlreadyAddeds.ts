export const markAlreadyAddeds = (
  newList: Asset.Item[],
  items: Asset.Item[],
): Asset.Item[] => {
  return newList.map(item => {
    const disabledText = items.some(_item => item.id === _item.id) ? 'Added' : '';

    return {
      ...item,
      priceUsd: (+item.priceUsd).toFixed(2),
      _diff: 0,
      _freshData: true,
      disabledText,
    };
  });
};
