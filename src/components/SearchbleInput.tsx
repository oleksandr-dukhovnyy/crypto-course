import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  // Keyboard,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { AnimatedFadeIn } from './Animated';
import { Button } from './Button';
import { SuggestionsList } from './SuggestionsLits';
import { ViewContext, DefaultsListContext, ThemeContext } from '../contexts';
import { getLogs } from '../utils/logs';
import { colors } from '../styles';

const minSymbs = 2;

interface Props {
  placeholder: string;
  onSearch(searchStr: string): void;
  suggestions: Asset.Item[];
  onSelected(item: Asset.Item): void;
  style?: App.StylesList;
  loading: boolean;
  cleanSearchResults(): void;
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
    setView,
  } = props;
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<any>(null);

  const view = useContext(ViewContext);
  const defaultList = useContext(DefaultsListContext);
  const theme = useContext(ThemeContext);

  // TODO: Remove magic value (topOffset)
  const topOffset = 185;

  const suggestionsListHeight = Dimensions.get('window').height - topOffset;

  const setSearch = (str: string) => {
    setValue(str);

    if (str.trim().length >= minSymbs) {
      onSearch(str.trim());
    } else {
      cleanSearchResults();
    }
  };

  const cancelSearch = () => {
    setValue('');
    cleanSearchResults();
    setFocused(false);
    if (inputRef.current !== null) inputRef.current?.blur();
  };

  const clearValue = () => {
    setValue('');
  };

  const selectItem = (suggestion: Asset.Item) => {
    // console.log('selectItem', suggestion);

    cancelSearch();
    onSelected(suggestion);
  };

  // const onEndEditing = () => {
  // if (inputRef.current !== null) inputRef.current?.blur();
  // setFocused(false);
  // };

  const onFocus = () => {
    setFocused(true);
  };

  // Keyboard.addListener('keyboardDidHide', () => {
  //   if (inputRef.current !== null) inputRef.current?.blur();
  //   setFocused(false);
  // });

  // Keyboard.addListener('keyboardDidShow', () => {
  //   setFocused(true);
  // });

  useEffect(() => {
    setView(focused ? 'search' : value.length ? 'search' : 'list');
  }, [focused]);

  useEffect(() => {
    if (':logstat'.startsWith(value)) {
      if (value === ':logstat') {
        alert(
          getLogs()
            .map(log => {
              const trace =
                typeof log.trace === 'string' ? [log.trace] : log.trace || [''];

              return `------------------------------------\n${(
                log.type || 'info'
              ).toUpperCase()}\n\n[trace]\n"${trace.join(
                ' > ',
              )}"\n\n[msg]\n${JSON.stringify(log.msg, null, 2)}`;
            })
            .join('\n\n'),
        );
      }
    }
  }, [value]);

  const styles =
    theme === 'light'
      ? StyleSheet.create(lightStyles)
      : StyleSheet.create({ ...lightStyles, ...darkStyles });

  const Loading = ({ loading, value }: { loading: boolean; value: string }) => {
    return (
      <>
        {loading ? (
          <Text style={styles.freeText}>Loading...</Text>
        ) : (
          <>
            {value.trim().length >= minSymbs ? (
              <Text style={styles.freeText}>
                Data by query "{value.trim()}" was not found...
              </Text>
            ) : (
              <Text style={styles.freeText}>
                Enter more that {minSymbs} symbols to search
              </Text>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <View style={styles.contain}>
      <View style={[styles.form, focused ? {} : { paddingRight: 15 }]}>
        <TouchableWithoutFeedback onPress={() => inputRef.current.focus()}>
          <View style={styles.input}>
            {focused ? (
              <Image
                style={styles.searchIcon}
                source={
                  theme === 'light'
                    ? require('../../assets/icons/search-active.png')
                    : require('../../assets/icons/search-active-dark.png')
                }
              />
            ) : (
              <Image
                style={styles.searchIcon}
                source={require(`../../assets/icons/search.png`)}
              />
            )}
            <TextInput
              ref={inputRef}
              value={value}
              style={[style, { color: styles.input.color }]}
              placeholderTextColor={styles.input._placeholderTextColor}
              onChangeText={setSearch}
              // onEndEditing={onEndEditing}
              onFocus={onFocus}
              placeholder={placeholder}
            />
          </View>
        </TouchableWithoutFeedback>
        {focused ? (
          <AnimatedFadeIn duration={500}>
            <Button
              style={styles.clearBtn}
              onClick={() => (value.length ? clearValue() : cancelSearch())}
            >
              <Text style={[styles.freeText, styles.resetButtonText]}>
                {value.length ? 'clear' : 'close'}
              </Text>
            </Button>
          </AnimatedFadeIn>
        ) : null}
      </View>

      {view === 'search' ? (
        <>
          {suggestions.length > 0 ? (
            <SuggestionsList
              list={suggestions}
              selectItem={selectItem}
              height={suggestionsListHeight}
            />
          ) : !value.length ? (
            <SuggestionsList
              list={defaultList}
              selectItem={selectItem}
              height={suggestionsListHeight}
            />
          ) : (
            <Loading loading={loading} value={value} />
          )}
        </>
      ) : null}
    </View>
  );
};

const lightStyles: StyleSheet.NamedStyles<any> = {
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
    paddingHorizontal: 14,
    borderRadius: 15,
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  hr: {
    width: '100%',
    backgroundColor: '#bbb',
    height: 1,
  },
  form: {
    flexDirection: 'row',
    paddingLeft: 15,
  },
  freeText: {
    color: '#fff',
    fontSize: 15,
  },
  clearBtn: {
    backgroundColor: 'transparent',
    paddingRight: 10,
    paddingLeft: 15,
    height: 52,
  },
  searchIcon: {
    width: 25,
    height: 25,
  },
  resetButtonText: {
    color: '#000',
  },
};

const darkStyles: StyleSheet.NamedStyles<any> = {
  suggestionsListContain: {
    ...lightStyles.suggestionsListContain,
    backgroundColor: colors.dark.background,
  },
  input: {
    ...lightStyles.input,
    // backgroundColor: '#5e5e5e',
    backgroundColor: colors.dark.background,
    color: colors.dark.white,

    // @ts-ignore
    _placeholderTextColor: '#aaa',
  },
  resetButtonText: {
    color: '#fff',
  },
};
