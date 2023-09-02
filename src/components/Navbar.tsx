import { View, Text, StyleSheet } from 'react-native';

export const Navbar = ({ appName }: { appName: string }) => {
  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>{appName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    alignItems: 'center',
    // marginBottom: 25,
  },
  title: {
    fontWeight: '900',
    fontSize: 32,
    color: '#fff',
  },
});
