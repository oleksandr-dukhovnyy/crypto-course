import { View, Text, StyleSheet } from 'react-native';

export const Navbar = ({ appName }) => {
  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>{appName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '900',
    fontSize: 32,
    color: '#fff',
  },
});
