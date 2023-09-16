import React, { useContext, useState } from 'react';
import { ViewContext, ListContext, ThemeContext } from '../contexts';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ListItem } from './ListItem';
import { Copyright } from './Copyright';
import DraggableFlatList from 'react-native-draggable-flatlist';

interface Props {
  removeItemFromList(id: string): void;
  setList(newList: Asset.Item[]): Promise<void>;
  setTheme(theme: App.Theme): void;
}

export const List = (props: Props) => {
  const { removeItemFromList } = props;
  const view = useContext(ViewContext);
  const list = useContext(ListContext);
  const theme = useContext(ThemeContext);
  const [editable, setEditable] = useState<boolean>(false);

  const toggleEditable = () => {
    setEditable(!editable);
  };

  const toggleDarkMode = () => {
    props.setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  function keyExtractor(item: Asset.Item): string {
    return item.id;
  }

  const renderItem = ({
    item,
    drag,
    isActive,
  }: {
    item: Asset.Item;
    drag(): void;
    isActive: boolean;
  }) => {
    return (
      <ListItem
        drag={drag}
        key={item.id}
        listItem={item}
        editable={editable}
        draggingNow={isActive}
        toggleEditable={toggleEditable}
        removeItemFromList={removeItemFromList}
      />
    );
  };

  const IconEdit = () => {
    return (
      <View>
        <TouchableOpacity style={styles.actionIconWrapper} onPress={toggleEditable}>
          <Image
            source={require('../../assets/icons/edit.png')}
            style={[styles.actionIcon, { opacity: editable ? 1 : 0.6 }]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const IconThemeToggle = () => {
    const iconStyle: { [key: string]: any }[] = [styles.actionIcon];

    if (theme === 'dark') {
      iconStyle.push({
        transform: [{ rotate: '250deg' }],
      });
    }

    return (
      <View>
        <TouchableOpacity style={styles.actionIconWrapper} onPress={toggleDarkMode}>
          <Image
            style={iconStyle}
            source={
              theme === 'dark'
                ? require('../../assets/icons/moon.png')
                : require('../../assets/icons/sun.png')
            }
          />
        </TouchableOpacity>
      </View>
    );
  };

  return view === 'list' ? (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconThemeToggle />
        <IconEdit />
      </View>
      <View style={styles.listContainer}>
        <DraggableFlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onDragEnd={({ data }) => props.setList(data)}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={styles.footerContainer}>
        <Copyright />
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    gap: 24,
    marginBottom: 8,
    paddingBottom: 20,
    marginLeft: 'auto',
    flexDirection: 'row',
    paddingHorizontal: 30,
  },
  listContainer: {
    flex: 1,
  },
  footerContainer: {
    height: 20,
    // marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#c2c2c2',
  },
  actionIconWrapper: {
    width: 58,
    height: 58,
    marginVertical: -29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    width: 18,
    height: 18,
  },
});

export default List;
