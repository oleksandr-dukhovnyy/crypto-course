import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  onClick?(): void;
  style?: App.StylesList;
  children?: JSX.Element;
  rounded?: boolean;
}

export const Button = (props: Props) => {
  const { onClick = () => {}, style = {}, children, rounded = false } = props;

  const raito = 0.12;

  const styles = StyleSheet.create({
    defaultButtonStyles: {
      backgroundColor: '#fff',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rounded: {
      borderRadius:
        Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
      width: Dimensions.get('window').width * raito,
      height: Dimensions.get('window').width * raito,
    },
  });

  const buttonStyles = [styles.defaultButtonStyles, style];

  if (rounded) {
    buttonStyles.push(styles.rounded);
  }

  return (
    <TouchableOpacity onPress={onClick} style={buttonStyles}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
};
