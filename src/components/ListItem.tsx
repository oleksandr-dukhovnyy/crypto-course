import { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Button } from './Button';
import normalizePrice from '../utils/normalizePrice';
import { AnimatedFadeIn } from './Animated';
import { ThemeContext } from '../contexts';
import { colors } from '../styles';

const GREEN = '#1dd648';
const RED = '#fe0000';
const BLACK = '#000';
const GRAY = '#bbb';
const DARK_GRAY = '#aaa';
const LEFT_SIDE_TABLE_COLOR = DARK_GRAY;

const DEFAULT_PRICE_COLOR = '#0082e5';

const removeConfirmationHideTimeout = 6000;

interface Props {
  draggingNow: boolean;
  editable: boolean;
  listItem: Asset.Item;
  drag(): void;
  toggleEditable(): void;
  removeItemFromList(id: string): void;
}

const AREA = 12;
const ICON_SIZE = 16;

export const ListItem = (props: Props) => {
  const theme = useContext(ThemeContext);
  const { listItem, removeItemFromList } = props;
  const [deletionConfirmation, setDeletionConfirmation] = useState(false);
  const [priceColor, setPriceColor] = useState(DEFAULT_PRICE_COLOR);

  let timeoutId: undefined | number;

  const closeAskToDelete = () => {
    clearTimeout(timeoutId);
    setDeletionConfirmation(false);
  };

  const askToDelete = () => {
    setDeletionConfirmation(true);

    timeoutId = window.setTimeout(closeAskToDelete, removeConfirmationHideTimeout);
  };

  let priceTimeout: undefined | number;

  useEffect(() => {
    setPriceColor(
      listItem._diff > 0
        ? theme === 'light'
          ? '#1abf3e'
          : GREEN
        : listItem._diff < 0
        ? theme === 'light'
          ? RED
          : colors.dark.red
        : DEFAULT_PRICE_COLOR,
    );

    clearTimeout(priceTimeout);
    priceTimeout = window.setTimeout(setPriceColor.bind(null, DEFAULT_PRICE_COLOR), 1200);
  }, [listItem.priceUsd]);

  const styles =
    theme === 'light'
      ? StyleSheet.create(lightStyles)
      : StyleSheet.create({ ...lightStyles, ...darkStyles });

  return (
    <TouchableWithoutFeedback onLongPress={props.toggleEditable}>
      <View style={styles.contain}>
        <View style={styles.listItem}>
          <View style={{ flexDirection: 'row', gap: 24 - AREA }}>
            {props.editable ? (
              <TouchableWithoutFeedback
                onPressIn={props.drag}
                style={styles.dragContainer}
              >
                <View
                  style={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    height: ICON_SIZE + 48, // 48
                    width: ICON_SIZE + AREA * 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={styles.dragIcon}
                    source={require('../../assets/icons/equal.png')}
                  />
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <View
                style={{
                  width: 0, //ICON_SIZE + AREA,
                }}
              ></View>
            )}

            <View>
              <View style={styles.header}>
                <Text style={[styles.name, { opacity: listItem._freshData ? 1 : 0.3 }]}>
                  {listItem.symbol} ({listItem.name})
                </Text>
              </View>

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    gap: 4,
                  }}
                >
                  <Text style={{ color: LEFT_SIDE_TABLE_COLOR }}>Price:</Text>
                  <Text
                    style={{
                      color: priceColor,
                      fontSize: 17,
                      fontWeight: '700',
                      opacity: listItem._freshData ? 1 : 0.3,
                    }}
                  >
                    ${normalizePrice(listItem.priceUsd)}
                  </Text>
                </View>
                <Text style={styles.contentText}>
                  <Text style={{ color: LEFT_SIDE_TABLE_COLOR }}>24h change:</Text>{' '}
                  {listItem.changePercent24Hr}%
                </Text>
                <Text style={styles.contentText}>
                  <Text style={{ color: LEFT_SIDE_TABLE_COLOR }}>24h volume:</Text> $
                  {normalizePrice((+listItem.volumeUsd24Hr).toFixed(3))}
                </Text>
                <Text style={styles.contentText}>
                  <Text style={{ color: LEFT_SIDE_TABLE_COLOR }}>Market cap:</Text> $
                  {normalizePrice((+listItem.marketCapUsd).toFixed(3))}
                </Text>
              </View>
            </View>
          </View>

          {props.editable && (
            <TouchableOpacity
              onPress={askToDelete}
              style={{
                height: 16 + AREA * 2,
                width: 16 + AREA * 2,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: -AREA,
                marginTop: -AREA,
              }}
            >
              <Image
                style={styles.closeBtn}
                source={require('../../assets/icons/close.png')}
              />
            </TouchableOpacity>
          )}
        </View>

        {deletionConfirmation && (
          <View style={styles.absoluteFit}>
            <AnimatedFadeIn style={styles.deleteContain} duration={100}>
              <>
                <View style={styles.deleteQuestion}>
                  <Text style={styles.deletionConfirmationText}>Remove?</Text>
                  <Text>
                    <Text style={[{ fontWeight: '700' }, styles.deletionText]}>
                      {listItem.symbol} ({listItem.name})
                    </Text>
                  </Text>
                </View>
                <View style={styles.deleteControls}>
                  <Button onClick={closeAskToDelete} style={styles.btnBorder}>
                    <Text style={styles.grayText}>No</Text>
                  </Button>
                  <Button
                    onClick={removeItemFromList.bind(null, listItem.id)}
                    style={styles.btnBorder}
                  >
                    <Text style={{ color: styles.deletionConfirmationText.color }}>
                      Yes
                    </Text>
                  </Button>
                </View>
              </>
            </AnimatedFadeIn>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const lightStyles: StyleSheet.NamedStyles<any> = {
  contain: {
    position: 'relative',
    marginBottom: 14,
  },
  listItem: {
    backgroundColor: '#fff', // '#fafafa',
    paddingVertical: 12,
    paddingLeft: 24 - AREA,
    paddingRight: 12,
    borderRadius: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  flexRow: {
    flexDirection: 'row',
  },
  name: {
    fontWeight: '700',
    fontSize: 17,
    flex: 1,
    minWidth: 250,
  },
  closeBtn: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  absoluteFit: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  deleteContain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: colors.light.background + 'f0',
    borderRadius: 15,
    width: '100%',
    height: '100%',
  },
  freeText: {
    color: '#fff',
    fontSize: 15,
  },
  deletionText: {
    color: '#000',
    fontSize: 17,
  },
  btnBorder: {
    borderColor: GRAY,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  deleteQuestion: {
    flex: 1,
  },
  grayText: {
    color: GRAY,
  },
  contentText: {
    color: DARK_GRAY,
  },
  header: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  deleteControls: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  dragIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  dragContainer: {
    width: 25,
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flex: 1,
    backgroundColor: BLACK,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  deletionConfirmationText: {
    color: colors.light.red,
  },
};

const darkStyles: StyleSheet.NamedStyles<any> = {
  listItem: {
    ...lightStyles.listItem,
    backgroundColor: colors.dark.background,
  },
  name: {
    ...lightStyles.name,
    color: '#fff',
  },
  deleteContain: {
    ...lightStyles.deleteContain,
    backgroundColor: colors.dark.background + 'f0',
  },
  grayText: {
    ...lightStyles.grayText,
    color: colors.dark.background,
  },
  deletionText: {
    ...lightStyles.deletionText,
    color: colors.dark.white,
  },
  deletionConfirmationText: {
    ...lightStyles.deletionConfirmationText,
    color: colors.dark.red,
  },
};
