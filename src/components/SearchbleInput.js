import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { AnimatedFadeIn } from './Animated';
import { Button } from './Button';

const minSymbs = 2;

export const SearchbleInput = ({
  placeholder = '...',
  onSearch,
  suggestions /* { id: string, title: string, disabledText: string }[] */,
  onSelected,
  style,
  loading,
  cleanSearchResults,
  showBottomLine = false,
}) => {
  const [value, setValue] = useState('');

  const setSearch = (str) => {
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

  const selectItem = (suggestion) => {
    onSelected(suggestion);
    clearValue();
  };

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
                paddingRight: 0,
                paddingLeft: 15,
              }}
              onClick={clearValue}
            >
              <Text style={styles.freeText}>clear</Text>
            </Button>
          </AnimatedFadeIn>
        ) : null}
      </View>

      {value.length ? (
        <>
          {suggestions.length ? (
            <View style={styles.suggestionsList}>
              <Shadow
                style={styles.shadow}
                stretch
                offset={[0, 5]}
                startColor={'#00000030'}
                disabled={!value.length}
              >
                <View style={styles.suggestionsListContain}>
                  <ScrollView>
                    {suggestions.map((suggestion, i, arr) => {
                      return (
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
                          {i < arr.length - 1 ? (
                            <View style={styles.hr}></View>
                          ) : null}
                        </View>
                      );
                    })}
                  </ScrollView>
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

              <View
                style={
                  showBottomLine ? [styles.hr, { backgroundColor: '#fff' }] : []
                }
              ></View>
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
    flex: 1,
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
    position: 'absolute',
    top: 58,
    zIndex: 10,
    width: '100%',
    gap: 15,
  },
  contain: {
    gap: 15,
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    zIndex: 5,
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
