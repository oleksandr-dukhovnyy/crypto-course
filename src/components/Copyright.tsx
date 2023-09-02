import { View, Text, StyleSheet, Dimensions } from 'react-native';

const color = '#fff'; // #eee

const offset = 75;
const magic = 20;
const width = Dimensions.get('window').width - offset * 2 - magic;

export const Copyright = () => {
  return (
    <View style={styles.copyright}>
      <Text style={styles.copyrightText}>ⓒ</Text>
      <Text style={styles.copyrightText}> script@vip-person.net</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  copyright: {
    borderTopColor: color,
    borderTopWidth: 1,
    marginVertical: 15,
    alignItems: 'baseline',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    paddingTop: 4,

    marginHorizontal: 'auto',
    width,
    left: offset,
  },
  copyrightText: {
    color,
    fontSize: 13,
  },
});
