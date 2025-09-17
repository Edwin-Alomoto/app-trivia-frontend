import React, { useEffect, useRef } from 'react';
import { Animated, ViewProps } from 'react-native';

type Props = ViewProps & {
  duration?: number;
  slideOffset?: number; // px desplazamiento vertical inicial
  scaleFrom?: number;   // escala inicial para entrar con spring
  enableSlide?: boolean;
  enableScale?: boolean;
};

const EntryAnimator: React.FC<Props> = ({
  duration = 1000,
  slideOffset = 20,
  scaleFrom = 0.98,
  enableSlide = true,
  enableScale = true,
  style,
  children,
  ...rest
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(slideOffset)).current;
  const scaleAnim = useRef(new Animated.Value(scaleFrom)).current;

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ];

    if (enableSlide) {
      animations.push(
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: Math.max(200, Math.floor(duration * 0.8)),
          useNativeDriver: true,
        })
      );
    }

    if (enableScale) {
      animations.push(
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  }, [duration, enableScale, enableSlide, fadeAnim, scaleAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: enableSlide ? slideAnim : 0 },
            { scale: enableScale ? scaleAnim : 1 },
          ],
        },
      ]}
      {...rest}
    >
      {children}
    </Animated.View>
  );
};

export default EntryAnimator;


