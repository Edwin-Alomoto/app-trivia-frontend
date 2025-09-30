import React, { useRef } from 'react';
import { Text, StyleSheet, Animated, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';
import { gradients } from '@theme/gradients';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  gradient?: 'purple' | 'gold' | 'bronze';
  textColor?: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  gradient,
  textColor,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.99,
      tension: 90,
      friction: 14,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 90,
      friction: 14,
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
    textColor ? { color: textColor } : null,
  ];

  return (
    <AnimatedTouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      {gradient ? (
        <LinearGradient
          colors={gradients[gradient] as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBackground}
        >
          <View style={styles.buttonContent}>
            {loading ? (
              <Text style={textStyles}>Cargando...</Text>
            ) : (
              <Text style={textStyles}>{title}</Text>
            )}
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.buttonContent}>
          {loading ? (
            <Text style={textStyles}>Cargando...</Text>
          ) : (
            <Text style={textStyles}>{title}</Text>
          )}
        </View>
      )}
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
  gradientBackground: {
    borderRadius: 12,
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
