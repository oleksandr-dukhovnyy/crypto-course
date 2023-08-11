import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SearchbleInput } from './SearchbleInput.js';
import API from '../utils/API';

const searchLimit = 20;
// const searchDebounceTimeout = 2000;

export const AddItemForm = ({ addItem, list = [], view, setView }) => {
  const [state, setState] = useState({
    list: [],
    loading: false,
  });

  const search = async (value, limit = searchLimit) => {
    setState({
      loading: true,
      list: [],
    });

    const searchResultList = await API.search(value, {
      limit,
    });

    setState({
      loading: false,
      list: searchResultList.map((item) => {
        const disabledText = list.some((_item) => item.id === _item.id)
          ? 'Added'
          : '';

        return {
          ...item,
          priceUsd: (+item.priceUsd).toFixed(2),
          disabledText,
        };
      }),
    });
  };

  const onSearch = async (value) => {
    const trimmed = value.trim();

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

  const onSelected = (itemId) => {
    addItem(itemId);
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
        // showBottomLine={list.length}
        view={view}
        setView={setView}
        onFocused={() => search('', 100)}
        onBlured={() => setState({ list: [], loading: false })}
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
