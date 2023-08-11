import { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AddItemForm } from './src/components/AddItemForm.js';
import { Navbar } from './src/components/Navbar.js';
import { List } from './src/components/List.js';
import AppJSON from './app.json';
import API from './src/utils/API.js';
import store from 'react-native-simple-store';

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

export default function App() {
  const [list, setList] = useState([]);

  const updateListInStore = (newList, source = '') => {
    console.log('updateListInStore', source);

    return store.save(
      'list',
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
        updateListInStore(newList, 'updatePrices');
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

    const newList = [newItem, ...list];
    setList(newList);

    watchPrices(newList);

    await updateListInStore(newList, 'addItem');
  };

  const removeItemFromList = async (id) => {
    closeSocket();
    const newList = list.filter((item) => item.id !== id);

    setList(newList);
    await updateListInStore(newList, 'removeItemFromList');
    watchPrices();
  };

  useEffect(() => {
    store.get('list').then((list) => {
      const storredList = JSON.parse(list || '[]');

      console.log('store.get', storredList.length);

      setList(storredList);

      if (!storredList.length) return;

      API.getItemsData(storredList.map(({ id }) => id)).then((data) => {
        console.log('data.length', data.length);

        const updatedList = data.map((item) => {
          const newItem = {
            ...item,
            priceUsd: (+item.priceUsd).toFixed(2),
            changePercent24Hr: (+item.changePercent24Hr).toFixed(4),
            _freshData: true,
            _diff: 0,
          };

          return newItem;
        });

        setList(updatedList);
        watchPrices(updatedList);
      });
    });

    return closeSocket;
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        <View
          style={[
            styles.container,
            list.length ? {} : styles['container--empty'],
          ]}
        >
          <Navbar appName={AppJSON.expo.name} />
          <AddItemForm addItem={addItem} list={list} />
          <List list={list} removeItemFromList={removeItemFromList} />
        </View>
      </LinearGradient>
    </SafeAreaView>
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
    padding: 20,
    borderRadius: 15,
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
