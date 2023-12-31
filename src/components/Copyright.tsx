import React, { useContext } from 'react';
import { ThemeContext } from '../contexts';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../styles';

const width = Dimensions.get('window').width - 130;

export const Copyright = () => {
  const theme = useContext(ThemeContext);
  const styles = StyleSheet.create(
    theme === 'light' ? lightStyles : { ...lightStyles, ...darkStyles },
  );
  // const styles = StyleSheet.create(lightStyles);

  return (
    <View style={styles.copyright}>
      <Text style={styles.copyrightText}>ⓒ</Text>
      <Text style={styles.copyrightText}> script@vip-person.net</Text>
    </View>
  );
};

const lightStyles: StyleSheet.NamedStyles<any> = {
  copyright: {
    width,
    bottom: 0,
    lineHeight: 1,
    paddingTop: 4,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: colors.dark.white,
    justifyContent: 'center',
    marginBottom: -3,
  },
  copyrightText: {
    fontSize: 13,
    color: colors.dark.white,
  },
};

const darkStyles: StyleSheet.NamedStyles<any> = {
  copyright: {
    ...lightStyles.copyright,
    borderTopColor: '#5e5e5e',
  },
  copyrightText: {
    ...lightStyles.copyrightText,
    color: '#5e5e5e',
  },
};
