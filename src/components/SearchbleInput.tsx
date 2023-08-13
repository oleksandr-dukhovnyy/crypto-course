import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { AnimatedFadeIn } from './Animated';
import { Button } from './Button';

const minSymbs = 2;

interface Props {
  placeholder: string;
  onSearch(searchStr: string): void;
  suggestions: Asset.Item[];
  onSelected(item: Asset.Item): void;
  style?: App.StylesList;
  loading: boolean;
  cleanSearchResults(): void;
  view: App.View;
  setView(view: App.View): void;
}

export const SearchbleInput = (props: Props) => {
  const {
    placeholder = '...',
    onSearch,
    suggestions,
    onSelected,
    style,
    loading,
    cleanSearchResults,
    view,
    setView,
  } = props;
  const [value, setValue] = useState('');

  const setSearch = (str: string) => {
    setValue(str);

    if (str.trim().length >= minSymbs) {
      onSearch(str.trim());
    } else {
      cleanSearchResults();
    }
  };

  const clearValue = () => {
    setValue('');
    cleanSearchResults();
  };

  const selectItem = (suggestion: Asset.Item) => {
    onSelected(suggestion);
    clearValue();
  };

  useEffect(() => {
    setView(value.length ? 'search' : 'list');
  }, [value]);

  const keyExtractor = ({ id }: Asset.Item) => id;

  return (
    <View style={styles.contain}>
      <View style={styles.form}>
        <TextInput
          value={value}
          style={[styles.input, style]}
          onChangeText={setSearch}
          placeholder={placeholder}
        />
        {value ? (
          <AnimatedFadeIn duration={500}>
            <Button
              style={{
                backgroundColor: 'transparent',
                paddingRight: 10,
                paddingLeft: 15,
              }}
              onClick={clearValue}
            >
              <Text style={styles.freeText}>clear</Text>
            </Button>
          </AnimatedFadeIn>
        ) : null}
      </View>

      {value.length && view === 'search' ? (
        <>
          {suggestions && suggestions.length ? (
            <View style={styles.suggestionsList}>
              <Shadow
                stretch
                offset={[0, 5]}
                startColor={'#00000030'}
                disabled={!value.length}
              >
                <View style={styles.suggestionsListContain}>
                  <FlatList
                    data={suggestions}
                    keyExtractor={keyExtractor}
                    renderItem={({ item: suggestion, index: i }) => (
                      <View key={suggestion.id}>
                        <TouchableOpacity
                          onPress={() =>
                            suggestion.disabledText
                              ? () => {}
                              : selectItem(suggestion)
                          }
                        >
                          <View style={styles.suggestionsListItem}>
                            <Text
                              style={{
                                opacity: suggestion.disabledText ? 0.3 : 1,
                              }}
                            >
                              {`${suggestion.symbol} (${
                                suggestion.name
                              }): $${(+suggestion.priceUsd).toFixed(5)}`}
                            </Text>

                            {suggestion.disabledText ? (
                              <Text>{suggestion.disabledText}</Text>
                            ) : null}
                          </View>
                        </TouchableOpacity>
                        {i < suggestions.length - 1 ? (
                          <View style={styles.hr}></View>
                        ) : null}
                      </View>
                    )}
                  />
                </View>
              </Shadow>
            </View>
          ) : (
            <>
              {loading ? (
                <Text style={styles.freeText}>Loading...</Text>
              ) : (
                <>
                  {value.trim().length >= minSymbs ? (
                    <Text style={styles.freeText}>
                      Data by query "{value}" was not found...
                    </Text>
                  ) : (
                    <Text style={styles.freeText}>
                      Enter more that {minSymbs} symbols to search
                    </Text>
                  )}
                </>
              )}

              {/* <View
                style={
                  showBottomLine ? [styles.hr, { backgroundColor: '#fff' }] : []
                }
              ></View> */}
            </>
          )}
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  suggestionsListContain: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    height: 600,
  },
  suggestionsListItem: {
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  suggestionsList: {
    position: 'relative',
    top: 0,
    width: '100%',
    gap: 15,
  },
  contain: {
    gap: 15,
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    flex: 1,
  },
  hr: {
    width: '100%',
    backgroundColor: '#cecece',
    height: 1,
  },
  form: {
    flexDirection: 'row',
  },
  freeText: {
    color: '#fff',
    fontSize: 15,
  },
});
