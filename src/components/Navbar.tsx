import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../contexts';
import { colors } from '../styles';

export const Navbar = ({ appName }: { appName: string }) => {
  const theme = useContext(ThemeContext);

  const styles = StyleSheet.create(
    theme === 'light' ? lightStyles : { ...lightStyles, ...darkStyles },
  );

  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>{appName}</Text>
    </View>
  );
};

const lightStyles: StyleSheet.NamedStyles<any> = {
  navbar: {
    alignItems: 'center',
    // marginBottom: 25,
  },
  title: {
    fontWeight: '900',
    fontSize: 32,
    color: '#fff',
  },
};

const darkStyles: StyleSheet.NamedStyles<any> = {
  title: {
    ...lightStyles.title,
    color: colors.dark.background,
  },
};
