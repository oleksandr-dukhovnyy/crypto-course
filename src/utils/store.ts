import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
  async save(keyString: string, value: any) {
    return AsyncStorage.setItem(keyString, value);
  },
  async get(keyString: string) {
    return AsyncStorage.getItem(keyString);
  },
};
