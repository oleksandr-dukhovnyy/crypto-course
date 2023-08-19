import React, { useContext } from 'react';
import { ViewContext, ListContext } from '../contexts';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { ListItem } from './ListItem';
import { Copyright } from './Copyright';

interface Props {
  removeItemFromList(id: string): void;
}

// TODO: Remove magic value (topOffset)
const topOffset = 200; // 194
const listHeight: number = Dimensions.get('window').height - topOffset;

export const List = (props: Props) => {
  const { removeItemFromList } = props;
  const view = useContext(ViewContext);
  const list = useContext(ListContext);

  return view === 'list' ? (
    <ScrollView>
      <View style={styles.list}>
        {list.map(listItem => {
          return (
            <ListItem
              key={listItem.id}
              listItem={listItem}
              removeItemFromList={removeItemFromList}
            />
          );
        })}
        <View style={{ height: 1 }} />
        <Copyright />
      </View>
    </ScrollView>
  ) : null;
};

const styles = StyleSheet.create({
  list: {
    flexDirection: 'column',
    position: 'relative',
    gap: 14,
    minHeight: listHeight,
    paddingBottom: 65, // 90
  },
});
