import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SearchbleInput } from './SearchbleInput';
import API from '../utils/API';
import { markAlreadyAddeds } from '../utils/markAlreadyAddeds';
import normalizeAssetList from '../utils/normalizeAssetList';
import { ListContext } from '../contexts';

const searchLimit = 20;
// const searchDebounceTimeout = 2000;

interface IProps {
  addItem(item: Asset.Item): void;
  setView(view: App.View): void;
}

interface State {
  list: Asset.Item[];
  loading: boolean;
}

export const AddItemForm = (props: IProps) => {
  const { addItem, setView } = props;
  const list = useContext(ListContext);

  const [state, setState] = useState<State>({
    list: [],
    loading: false,
  });

  const search = async (value: string, limit = searchLimit) => {
    // Ignore commands
    if (value.startsWith(':')) return;

    setState({
      loading: true,
      list: [],
    });

    const searchResultList: Asset.APIResponseItem[] = await API.search(value, {
      limit,
    });

    const newState: State = {
      loading: false,
      list: markAlreadyAddeds(normalizeAssetList(searchResultList), list),
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
        placeholder="search and add a new Crypto Course"
        onSearch={onSearch}
        onSelected={onSelected}
        suggestions={state.list}
        loading={state.loading}
        cleanSearchResults={setState.bind(null, { loading: false, list: [] })}
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
    marginBottom: 15,
  },
});
