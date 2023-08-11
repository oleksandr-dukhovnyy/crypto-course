import { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AddItemForm } from './src/components/AddItemForm.js';
import { Navbar } from './src/components/Navbar.js';
import { List } from './src/components/List.js';
import AppJSON from './app.json';
import API from './src/utils/API.js';
import store from './src/utils/store.js';
import normalizeAssetList from './src/utils/normalizeAssetList.js';

/*
  ASSET EXAMPLE

  {
    id: 'bitcoin',
    rank: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    supply: '17193925.0000000000000000',
    maxSupply: '21000000.0000000000000000',
    marketCapUsd: '119179791817.6740161068269075',
    volumeUsd24Hr: '2928356777.6066665425687196',
    priceUsd: '6931.50585',
    changePercent24Hr: '-0.8101',
    vwap24Hr: '7175.0663247679233209',
    _diff: 0,
    _freshData: false,
  }

  _diff and _freshData - is a local fields
*/

const defaultAssets = ['bitcoin', 'ethereum', 'dogecoin', 'litecoin'];

const LIST_STORE_KEY = 'list';
const FIRST_BOOT_KEY = 'booted-before.v4';

export default function App() {
  const [list, setList] = useState([]);

  const updateListInStore = (newList) => {
    return store.save(
      LIST_STORE_KEY,
      JSON.stringify(
        newList.map((item) => {
          // reset local fields

          return {
            ...item,
            _diff: 0,
            _freshData: false,
          };
        })
      )
    );
  };

  let closeSocket = () => {};
  const watchPrices = (_list = list) => {
    closeSocket();

    const ids = _list.map(({ id }) => id);

    if (ids.length) {
      closeSocket = API.watchPrices(ids, updatePrices);
    }
  };

  let updatePricesTimeoutId = null;

  const updatePrices = async (prices) => {
    setList((prev) => {
      const newList = prev.map((item) => {
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

      clearTimeout(updatePricesTimeoutId);

      updatePricesTimeoutId = setTimeout(() => {
        updateListInStore(newList);
      }, 5000);

      return newList;
    });
  };

  const addItem = async (item) => {
    closeSocket();

    const newItem = {
      ...item,
      changePercent24Hr: (+item.changePercent24Hr).toFixed(4),
      _freshData: true,
      _diff: 0,
    };

    const newList = [...list, newItem];
    setList(newList);

    watchPrices(newList);

    await updateListInStore(newList);
  };

  const removeItemFromList = async (id) => {
    closeSocket();
    const newList = list.filter((item) => item.id !== id);

    setList(newList);
    await updateListInStore(newList);
    watchPrices();
  };

  useEffect(() => {
    const loadItemsFromStore = () => {
      store.get(LIST_STORE_KEY).then((list) => {
        const storredList = JSON.parse(list || '[]');

        setList(storredList);

        if (!storredList.length) return;

        API.getItemsData(storredList.map(({ id }) => id)).then((data) => {
          const updatedList = normalizeAssetList(data);

          setList(updatedList);
          watchPrices(updatedList);
        });
      });
    };

    if (!defaultAssets.length) {
      loadItemsFromStore();
    } else {
      store.get(FIRST_BOOT_KEY).then((res) => {
        if (res !== '1') {
          store.save(FIRST_BOOT_KEY, '1');

          API.getItemsData(defaultAssets).then((list) => {
            const defaultList = normalizeAssetList(list);

            updateListInStore(defaultList);
            setList(defaultList);
            watchPrices(defaultList);
          });
        } else {
          loadItemsFromStore();
        }
      });
    }

    return closeSocket;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          'rgba(255,183,63,1)',
          'rgba(230,103,255,1)',
          'rgba(139,224,255,1)',
        ]}
        locations={[0, 0.37, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <SafeAreaView
          style={[
            styles.container,
            list.length ? {} : styles['container--empty'],
          ]}
        >
          <Navbar appName={AppJSON.expo.name} />
          <AddItemForm addItem={addItem} list={list} />
          <List list={list} removeItemFromList={removeItemFromList} />
        </SafeAreaView>
      </LinearGradient>
    </View>
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
  'container--empty': {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '50%',
    flex: 1,
  },
  text: {
    color: '#fff',
  },
});
