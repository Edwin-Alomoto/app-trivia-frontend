import React, { useRef } from 'react';
import { Text, StyleSheet, Animated, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const buttonStyles = [
    styles.button,
    variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
    (disabled || loading) && styles.buttonDisabled,
    { transform: [{ scale: scaleAnim }] },
  ];

  const textStyles = [
    getVariantStyle('body'),
    styles.buttonText,
    variant === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText,
    styles.boldText,
  ];

  return (
    <AnimatedTouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <Text style={textStyles}>Cargando...</Text>
        ) : (
          <Text style={textStyles}>{title}</Text>
        )}
      </View>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: colors.primary600,
  },
  secondaryButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary600,
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: colors.muted,
    borderColor: colors.muted,
  },
  buttonContent: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.onPrimary,
  },
  primaryButtonText: {
    color: colors.onPrimary,
  },
  secondaryButtonText: {
    color: colors.primary600,
  },
  boldText: {
    fontWeight: '600',
  },
});
