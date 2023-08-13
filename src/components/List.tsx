import { View, StyleSheet, ScrollView } from 'react-native';
import { ListItem } from './ListItem';

interface Props {
  list: Asset.Item[];
  removeItemFromList(id: string): void;
  view: App.View;
}

export const List = (props: Props) => {
  const { list = [], removeItemFromList, view } = props;

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
