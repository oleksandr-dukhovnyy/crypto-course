import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  VirtualizedList,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { ThemeContext } from '../contexts';
import { colors } from '../styles';

interface Props {
  list: Asset.Item[];
  height?: number; // 450
  selectItem(item: Asset.Item): void;
}

export const SuggestionsList = (props: Props) => {
  const { list, selectItem, height = 450 } = props;
  const theme = useContext(ThemeContext);

  function keyExtractor({ id }: Asset.Item) {
    return id;
  }

  const getItemCount = () => list.length;
  const getItem = (_data: any, index: number) => list[index];

  const styles = StyleSheet.create(
    theme === 'light' ? lightStyles : { ...lightStyles, ...darkStyles },
  );

  return (
    <KeyboardAvoidingView style={styles.suggestionsList}>
      <Shadow stretch offset={[0, 5]} startColor={'#00000030'}>
        <View style={[styles.suggestionsListContain, { height }]}>
          <VirtualizedList
            getItemCount={getItemCount}
            initialNumToRender={15}
            getItem={getItem}
            maxToRenderPerBatch={20}
            //
            data={list}
            keyExtractor={keyExtractor}
            renderItem={({ item: suggestion, index: i }) => (
              <View key={suggestion.id}>
                <TouchableOpacity
                  onPress={() =>
                    suggestion.disabledText ? () => {} : selectItem(suggestion)
                  }
                >
                  <View style={styles.suggestionsListItem}>
                    <Text
                      style={{
                        opacity: suggestion.disabledText ? 0.3 : 1,
                        ...styles.suggestionName,
                      }}
                    >
                      {`${suggestion.symbol} (${
                        suggestion.name
                      }): $${(+suggestion.priceUsd).toFixed(5)}`}
                    </Text>

                    {suggestion.disabledText ? (
                      <Text style={styles.disabledText}>{suggestion.disabledText}</Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
                {i < list.length - 1 ? <View style={styles.hr}></View> : null}
              </View>
            )}
          />
        </View>
      </Shadow>
    </KeyboardAvoidingView>
  );
};

//
const lightStyles: StyleSheet.NamedStyles<any> = {
  suggestionsList: {
    position: 'relative',
    top: 0,
    width: '100%',
    gap: 15,
  },
  suggestionsListItem: {
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  suggestionsListContain: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    // height: 450, // 340
    // flex: 1,
  },
  hr: {
    width: '100%',
    backgroundColor: '#cecece',
    height: 1,
  },
};

const darkStyles: StyleSheet.NamedStyles<any> = {
  suggestionsListContain: {
    ...lightStyles.suggestionsListContain,
    backgroundColor: '#5e5e5e',
  },
  suggestionName: {
    color: colors.dark.white,
  },
  disabledText: {
    color: colors.dark.white,
  },
};
