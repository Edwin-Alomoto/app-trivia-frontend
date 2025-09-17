import React, { useRef } from 'react';
import { Animated, ViewProps } from 'react-native';

type Props = ViewProps & {
  scaleOnFocus?: number; // escala cuando enfoca
};

const FocusScaleView: React.FC<Props> = ({ children, style, scaleOnFocus = 1.01, ...rest }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const focusIn = () => {
    Animated.spring(scaleAnim, {
      toValue: scaleOnFocus,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const focusOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]} {...rest}>
      {typeof children === 'function'
        ? // Permite render prop para inyectar handlers
          // @ts-ignore
          children({ focusIn, focusOut })
        : children}
    </Animated.View>
  );
};

export default FocusScaleView;


