import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SearchbleInput } from './SearchbleInput';
import API from '../utils/API';

const searchLimit = 20;
// const searchDebounceTimeout = 2000;

interface IProps {
  addItem(item: Asset.Item): void;
  list: Asset.Item[];
  view: App.View;
  setView(view: App.View): void;
}

interface State {
  list: Asset.Item[];
  loading: boolean;
}

export const AddItemForm = (props: IProps) => {
  const { addItem, list = [], view, setView } = props;

  const [state, setState] = useState<State>({
    list: [],
    loading: false,
  });

  const search = async (value: string, limit = searchLimit) => {
    setState({
      loading: true,
      list: [],
    });

    const searchResultList: Asset.APIResponseItem[] = await API.search(value, {
      limit,
    });

    const newState: State = {
      loading: false,
      list: searchResultList.map((item) => {
        const disabledText = list.some((_item) => item.id === _item.id)
          ? 'Added'
          : '';

        return {
          ...item,
          priceUsd: (+item.priceUsd).toFixed(2),
          _diff: 0,
          _freshData: true,
          disabledText,
        };
      }),
    };

    setState(newState);
  };

  const onSearch = async (searchStr: string) => {
    const trimmed = searchStr.trim();

    if (trimmed) {
      search(trimmed);

      // TODO: add Debounce

      // searchStr = trimmed;
      // clearTimeout(searchDebounceTimerId);
      // searchDebounceTimerId = setTimeout(() => {
      //   search(searchStr);
      //   searchDebounceTimerId = null;
      // }, searchDebounceTimeout);
    }
  };

  const onSelected = (item: Asset.Item) => {
    addItem(item);
  };

  return (
    <View style={styles.contain}>
      <SearchbleInput
        placeholder="start typing crypto name or symbol..."
        onSearch={onSearch}
        onSelected={onSelected}
        suggestions={state.list}
        loading={state.loading}
        cleanSearchResults={setState.bind(null, { loading: false, list: [] })}
        view={view}
        setView={setView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contain: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    zIndex: 1,
  },
});
