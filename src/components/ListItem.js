import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Button } from './Button';
import normalizePrice from '../utils/normalizePrice';
import { AnimatedFadeIn } from './Animated';

const GREEN = '#1dd648';
const RED = '#fe0000';
const BLACK = '#000';
const removeConfirmationHideTimeout = 6000;

export const ListItem = ({ listItem, removeItemFromList }) => {
  const [deletionConfirmation, setDeletionConfirmation] = useState(false);
  const [priceColor, setPriceColor] = useState(BLACK);

  let timeoutId = null;

  const closeAskToDelete = () => {
    clearTimeout(timeoutId);
    setDeletionConfirmation(false);
  };

  const askToDelete = () => {
    setDeletionConfirmation(true);

    timeoutId = setTimeout(closeAskToDelete, removeConfirmationHideTimeout);
  };

  let priceTimeout = null;

  useEffect(() => {
    setPriceColor(
      listItem._diff > 0 ? GREEN : listItem._diff < 0 ? RED : BLACK
    );

    clearTimeout(priceTimeout);
    priceTimeout = setTimeout(setPriceColor.bind(null, BLACK), 1200);
  }, [listItem.priceUsd]);

  return (
    <View style={{ position: 'relative', zIndex: 1 }}>
      <View style={styles.listItem}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontWeight: 700,
                fontSize: 17,
                opacity: listItem._freshData ? 1 : 0.3,
                flex: 1,
                minWidth: 250,
              }}
            >
              {listItem.name} ({listItem.symbol})
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
              <Text style={{ color: '#bbb' }}>Price:</Text>
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
            <Text style={{ color: '#bbb' }}>
              24h change: {listItem.changePercent24Hr}%
            </Text>
            <Text style={{ color: '#bbb' }}>
              24h volume: $
              {normalizePrice((+listItem.volumeUsd24Hr).toFixed(3))}
            </Text>
            <Text style={{ color: '#bbb' }}>
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
          <AnimatedFadeIn style={styles.deleteContain}>
            <View style={styles.deleteQuestion}>
              <Text>Remove</Text>
              <Text>
                <Text style={[{ fontWeight: 700 }, styles.deletionText]}>
                  {listItem.name}
                </Text>
                ?
              </Text>
            </View>
            <View
              style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}
            >
              <Button onClick={closeAskToDelete} style={styles.btnBorder}>
                <Text style={{ color: '#bbb' }}>No</Text>
              </Button>
              <Button
                onClick={removeItemFromList.bind(null, listItem.id)}
                style={styles.btnBorder}
              >
                <Text style={{ color: RED }}>Yes</Text>
              </Button>
            </View>
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
});
