import { View, StyleSheet, ScrollView } from 'react-native';
import { ListItem } from './ListItem';

export const List = ({ list: _list = [], removeItemFromList }) => {
  return (
    <ScrollView>
      <View style={styles.list}>
        {_list.map !== undefined
          ? _list.map((listItem) => {
              return (
                <ListItem
                  key={listItem.id}
                  listItem={listItem}
                  removeItemFromList={removeItemFromList}
                />
              );
            })
          : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    flexDirection: 'column',
    gap: 14,
  },
});
