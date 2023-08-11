import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
  async save(keyString, value) {
    return AsyncStorage.setItem(keyString, value);
  },
  async get(keyString) {
    return AsyncStorage.getItem(keyString);
  },
};
