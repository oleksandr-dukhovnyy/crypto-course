import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AddItemForm } from './src/components/AddItemForm';
import { Navbar } from './src/components/Navbar';
import { List } from './src/components/List';
import AppJSON from './app.json';
import API from './src/utils/API';
import store from './src/utils/store';
import { markAlreadyAddeds } from './src/utils/markAlreadyAddeds';
import normalizeAssetList from './src/utils/normalizeAssetList';
import {
  ListContext,
  DefaultsListContext,
  ViewContext,
  ThemeContext,
} from './src/contexts';
import { initModuleLogger } from './src/utils/logs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const log = initModuleLogger('App');

const defaultAssets = ['bitcoin', 'ethereum', 'dogecoin', 'litecoin'];
const LIST_STORE_KEY = 'list';
const FIRST_BOOT_KEY = 'booted-before.v5';

const DEFAULT_ASSETS_COUNT = 20; // Then DEFAULT_ASSETS_COUNT < 55 - no have "freezes"

// const getId = (() => {
//   let id = 0;
//   return () => id++;
// })();

export default function App() {
  const [list, setList] = useState<Asset.Item[]>([]);
  const [defaultList, setDefaultList] = useState<Asset.Item[]>([]);
  const [view, setView] = useState<App.View>('list');
  const [theme, setTheme] = useState<App.Theme>('light');

  const updateListInStore = (newList: Asset.Item[], initiator: string = '-') => {
    // const id = getId();
    // console.log(`updateListInStore ${id} SAVING by [${initiator}]`);
    // console.log('newLists\n', newList.map(listItem => listItem.id).join('\n'));

    return store
      .save(
        LIST_STORE_KEY,
        JSON.stringify(
          newList.map(item => {
            // reset local fields

            return {
              ...item,
              _diff: 0,
              _freshData: false,
              disabledText: '',
            };
          }),
        ),
      )
      .finally(() => {
        // console.log(`updateListInStore ${id}: SAVED`);
      });
  };

  let closeSocket = () => {};
  const watchPrices = (_list = list) => {
    closeSocket();

    const ids = _list.map(({ id }) => id);

    if (ids.length) {
      closeSocket = API.watchPrices(ids, updatePrices);
    }
  };

  let updatePricesTimeoutId: undefined | number;

  const updatePrices = async (prices: Asset.NewPrices) => {
    clearTimeout(updatePricesTimeoutId);

    updatePricesTimeoutId = window.setTimeout(() => {
      setList((prev: Asset.Item[]) => {
        const newList = prev.map(item => {
          if (item.id in prices) {
            return {
              ...item,
              priceUsd: prices[item.id],
              _diff: +prices[item.id] - +item.priceUsd,
              _freshData: true,
            };
          }

          return item;
        });

        updateListInStore(newList, 'updatePrices');

        return newList;
      });
    }, 5000);
  };

  const addItem = async (item: Asset.Item) => {
    if (list.findIndex(asset => asset.id === item.id) !== -1) return; // Don't add duplicates

    closeSocket();

    const newItem = {
      ...item,
      priceUsd: (+item.priceUsd).toFixed(2),
      changePercent24Hr: (+item.changePercent24Hr).toFixed(4),
      _freshData: true,
      _diff: 0,
    };

    const newList = [...list, newItem];

    setList(newList);
    watchPrices(newList);
    await updateListInStore(newList, 'addItem');
    // setDefaultList(markAlreadyAddeds(defaultList, newList));
  };

  const removeItemFromList = async (id: string) => {
    closeSocket();
    const newList = list.filter(item => item.id !== id);

    setList(newList);
    await updateListInStore(newList, 'removeItemFromList');
    watchPrices();
    // setDefaultList(markAlreadyAddeds(defaultList, newList));
  };

  const _setList = async (newList: Asset.Item[]) => {
    setList(newList);
    watchPrices();
    await updateListInStore(newList, '_setList');
  };

  // API
  const loadItemsFromStore = () => {
    store.get(LIST_STORE_KEY).then(list => {
      const storredList = JSON.parse(list || '[]');

      setList(storredList);

      if (!storredList.length) return;

      API.getItemsData(storredList.map(({ id }: Asset.Item) => id)).then(data => {
        const updatedList = normalizeAssetList(data);

        setList(updatedList);
        watchPrices(updatedList);
      });
    });
  };

  const loadTopAssets = () => {
    log({
      msg: 'loadTopAssets',
      trace: ['loadTopAssets'],
    });

    return API.loadTopAssets(DEFAULT_ASSETS_COUNT).then((_list: Asset.Item[] | null) => {
      log({
        msg: `_list ${_list !== null ? '!' : '='}== null`,
        trace: ['loadTopAssets', 'then'],
      });

      if (_list !== null) {
        const marked = markAlreadyAddeds(_list, list);

        log({
          msg: `marked.length ${marked.length}`,
          trace: ['loadTopAssets', 'then'],
        });

        setDefaultList(marked);
      }
    });
  };

  useEffect(() => {
    store.get(FIRST_BOOT_KEY).then(res => {
      loadTopAssets().finally(() => {
        if (res !== '1') {
          store.save(FIRST_BOOT_KEY, '1');

          API.getItemsData(defaultAssets).then(list => {
            const defaultList = normalizeAssetList(list);

            updateListInStore(
              defaultList,
              'useEffect > store.get > loadTopAssets.finally > API.getItemsData',
            );
            setList(defaultList);
            watchPrices(defaultList);
          });
        } else {
          loadItemsFromStore();
        }
      });
    });

    return closeSocket;
  }, []);

  useEffect(() => {
    setDefaultList(markAlreadyAddeds(defaultList, list));
  }, [list]);

  const gradientColors: { [key: string]: string[] } = {
    light: ['rgba(255,183,63,1)', 'rgba(230,103,255,1)', 'rgba(139,224,255,1)'],
    dark: ['rgba(255,183,63,0.3)', 'rgba(230,103,255,0.3)', 'rgba(139,224,255,0.3)'],
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <StatusBar animated={true} showHideTransition={'fade'} hidden={true} />
        <LinearGradient
          colors={gradientColors.light}
          locations={[0, 0.37, 1]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
        >
          <SafeAreaView
            // style={[styles.container, list.length ? {} : styles['container--empty']]}
            style={styles.container}
          >
            <ThemeContext.Provider value={theme}>
              <ListContext.Provider value={list}>
                <DefaultsListContext.Provider value={defaultList}>
                  <ViewContext.Provider value={view}>
                    <Navbar appName={AppJSON.expo.name} />
                    <AddItemForm addItem={addItem} setView={setView} />
                    <List
                      removeItemFromList={removeItemFromList}
                      setList={_setList}
                      setTheme={setTheme}
                    />
                  </ViewContext.Provider>
                </DefaultsListContext.Provider>
              </ListContext.Provider>
            </ThemeContext.Provider>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 10,
    paddingTop: 30,
  },
  container: {
    flex: 1,
    borderRadius: 15,
    paddingTop: 20,
    gap: 15,
    flexDirection: 'column',
  },
  // 'container--empty': {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginTop: '50%',
  //   flex: 1,
  // },
  text: {
    color: '#fff',
  },
});
