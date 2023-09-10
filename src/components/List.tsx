import React, { useContext, useState } from 'react';
import { ViewContext, ListContext } from '../contexts';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { ListItem } from './ListItem';
import { Copyright } from './Copyright';
import DraggableFlatList from 'react-native-draggable-flatlist';

interface Props {
  removeItemFromList(id: string): void;
  setList(newList: Asset.Item[]): Promise<void>;
}

// TODO: Remove magic value (topOffset)
const topOffset = 280; // 194
const diff = Dimensions.get('window').height - topOffset;
const listHeight = diff < 0 ? 0 : diff;

const ICON_SIZE = 18;
const ICON_AREA = 20;

export const List = (props: Props) => {
  const { removeItemFromList } = props;
  const view = useContext(ViewContext);
  const list = useContext(ListContext);
  const [editable, setEditable] = useState<boolean>(false);

  const toggleEditable = () => {
    setEditable(!editable);
  };

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

  const Icon = () => {
    return (
      <View>
        <TouchableOpacity style={styles.actionIconWrapper} onPress={toggleEditable}>
          <Image
            source={require(`../../assets/icons/edit.png`)}
            style={[styles.actionIcon, { opacity: editable ? 1 : 0.6 }]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return view === 'list' ? (
    <View style={{ flex: 1 }}>
      <View
        style={{
          marginTop: -12,
          marginBottom: -2,
          paddingBottom: ICON_AREA,
          width: '100%',
          alignItems: 'center',
          // justifyContent: 'space-between',
          justifyContent: 'flex-end',
          flexDirection: 'row',
          paddingHorizontal: 30,
        }}
      >
        {/*
        <Icon /> 
        <Icon /> 
        <Icon />
        */}
        <Icon />
      </View>
      <View style={styles.list}>
        <DraggableFlatList
          data={list}
          style={{
            height: '100%',
            minHeight: listHeight,
          }}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onDragEnd={({ data }) => props.setList(data)}
        />
        <View style={{ position: 'absolute', bottom: 0 }}>
          <View style={{ height: 1 }} />
          <Copyright />
        </View>
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  list: {
    flexDirection: 'column',
    position: 'relative',
    gap: 14,
    minHeight: listHeight,
    paddingBottom: 65, // 90
    // borderColor: 'red',
    // borderBottomWidth: 1,
    // borderTopWidth: 1,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
  },
  actionIconWrapper: {
    width: ICON_SIZE + ICON_AREA * 2,
    height: ICON_SIZE + ICON_AREA * 2,
    marginVertical: -ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});
