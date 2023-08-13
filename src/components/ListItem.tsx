import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Button } from './Button';
import normalizePrice from '../utils/normalizePrice';
import { AnimatedFadeIn } from './Animated';

const GREEN = '#1dd648';
const RED = '#fe0000';
const BLACK = '#000';
const GRAY = '#bbb';
const removeConfirmationHideTimeout = 6000;

interface Props {
  listItem: Asset.Item;
  removeItemFromList(id: string): void;
}

export const ListItem = (props: Props) => {
  const { listItem, removeItemFromList } = props;
  const [deletionConfirmation, setDeletionConfirmation] = useState(false);
  const [priceColor, setPriceColor] = useState(BLACK);

  let timeoutId: undefined | number;

  const closeAskToDelete = () => {
    clearTimeout(timeoutId);
    setDeletionConfirmation(false);
  };

  const askToDelete = () => {
    setDeletionConfirmation(true);

    timeoutId = window.setTimeout(
      closeAskToDelete,
      removeConfirmationHideTimeout
    );
  };

  let priceTimeout: undefined | number;

  useEffect(() => {
    setPriceColor(
      listItem._diff > 0 ? GREEN : listItem._diff < 0 ? RED : BLACK
    );

    clearTimeout(priceTimeout);
    priceTimeout = window.setTimeout(setPriceColor.bind(null, BLACK), 1200);
  }, [listItem.priceUsd]);

  return (
    <View style={{ position: 'relative' }}>
      <View style={styles.listItem}>
        <View>
          <View style={styles.header}>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 17,
                opacity: listItem._freshData ? 1 : 0.3,
                flex: 1,
                minWidth: 250,
              }}
            >
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
              <Text style={styles.grayText}>Price:</Text>
              <Text
                style={{
                  color: priceColor,
                  fontSize: 17,
                  opacity: listItem._freshData ? 1 : 0.3,
                }}
              >
                ${normalizePrice(listItem.priceUsd)}
              </Text>
            </View>
            <Text style={styles.grayText}>
              24h change: {listItem.changePercent24Hr}%
            </Text>
            <Text style={styles.grayText}>
              24h volume: $
              {normalizePrice((+listItem.volumeUsd24Hr).toFixed(3))}
            </Text>
            <Text style={styles.grayText}>
              Market cap: ${normalizePrice((+listItem.marketCapUsd).toFixed(3))}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={askToDelete}>
          <Image
            style={styles.closeBtn}
            source={require('../../assets/icons/close.png')}
          />
        </TouchableOpacity>
      </View>

      {deletionConfirmation && (
        <View style={styles.absoluteFit}>
          <AnimatedFadeIn style={styles.deleteContain} duration={100}>
            <>
              <View style={styles.deleteQuestion}>
                <Text style={{ color: RED }}>Remove</Text>
                <Text>
                  <Text style={[{ fontWeight: '700' }, styles.deletionText]}>
                    {listItem.name}
                  </Text>
                </Text>
              </View>
              <View style={styles.deleteControlls}>
                <Button onClick={closeAskToDelete} style={styles.btnBorder}>
                  <Text style={styles.grayText}>No</Text>
                </Button>
                <Button
                  onClick={removeItemFromList.bind(null, listItem.id)}
                  style={styles.btnBorder}
                >
                  <Text style={{ color: RED }}>Yes</Text>
                </Button>
              </View>
            </>
          </AnimatedFadeIn>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingLeft: 20,
    paddingRight: 12,
    borderRadius: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  flexRow: {
    flexDirection: 'row',
  },
  closeBtn: {
    width: 20,
    height: 20,
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
    backgroundColor: '#fffffff0',
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
    borderColor: '#cecece',
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
  header: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  deleteControlls: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
});
