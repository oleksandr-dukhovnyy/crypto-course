import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

interface Props {
  children: JSX.Element;
  duration?: number;
  style?: App.StylesList;
}

export const AnimatedFadeIn = (props: Props) => {
  const { children, style = {}, duration = 500 } = props;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{
        ...style,
        opacity: fadeAnim,
      }}
    >
      {children}
    </Animated.View>
  );
};
