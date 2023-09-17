import React, { useContext, useState } from 'react';
import { ViewContext, ListContext, ThemeContext } from '../contexts';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { ListItem } from './ListItem';
import { Copyright } from './Copyright';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { colors } from '../styles';

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
            source={
              theme === 'light'
                ? require('../../assets/icons/edit.png')
                : require('../../assets/icons/edit-dark.png')
            }
            style={[styles.actionIcon, { opacity: editable ? 0.6 : 1 }]}
            // style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const IconThemeToggle = () => {
    return (
      <View style={{ marginRight: -9 }}>
        <TouchableOpacity style={styles.actionIconWrapper} onPress={toggleDarkMode}>
          <Image
            style={styles.actionIcon}
            source={
              theme === 'light'
                ? require('../../assets/icons/moon.png')
                : require('../../assets/icons/moon-dark.png')
            }
          />
        </TouchableOpacity>
      </View>
    );
  };

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const toTem = (n: number): string => (n < 10 ? '0' : '') + n;
  const now = new Date();
  const weekDay = days[now.getDay()];
  const dd = toTem(now.getDate());
  const MM = toTem(now.getMonth() + 1);
  const YYYY = now.getFullYear();

  const currentDate = `${weekDay}   ${[dd, MM, YYYY].join('.')}`;

  const styles = StyleSheet.create(
    theme === 'light' ? lightStyles : { ...lightStyles, ...darkStyles },
  );

  return view === 'list' ? (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.dateContain}>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
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

const lightStyles: StyleSheet.NamedStyles<any> = {
  container: {
    flex: 1,
  },
  iconContainer: {
    gap: 10,
    marginBottom: 8,
    paddingBottom: 20,
    marginLeft: 'auto',
    flexDirection: 'row',
    paddingHorizontal: 14 + 10,
    // paddingLeft: 14 + 12,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 2,
  },
  footerContainer: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  actionIconWrapper: {
    width: 58,
    height: 58,
    marginVertical: -30,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'coral',
  },
  actionIcon: {
    width: 18,
    height: 18,
  },
  dateContain: {
    height: 58,
    marginVertical: -30,
    marginHorizontal: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'coral',
    // ma
    flex: 1,
  },
  date: {
    textAlign: 'center',
    color: colors.light.white,
    // fontWeight: '700',
    fontSize: 17,
  },
};

const darkStyles: StyleSheet.NamedStyles<any> = {
  date: {
    ...lightStyles.date,
    color: colors.dark.background,
  },
};

export default List;
