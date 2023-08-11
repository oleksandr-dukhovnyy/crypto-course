import { View, StyleSheet, ScrollView } from 'react-native';
import { ListItem } from './ListItem';

export const List = ({ list = [], removeItemFromList, view, setView }) => {
  return view === 'list' ? (
    <ScrollView>
      <View style={styles.list}>
        {list.map((listItem) => {
          return (
            <ListItem
              key={listItem.id}
              listItem={listItem}
              removeItemFromList={removeItemFromList}
            />
          );
        })}
      </View>
    </ScrollView>
  ) : null;
};

const styles = StyleSheet.create({
  list: {
    flexDirection: 'column',
    gap: 14,
  },
});
