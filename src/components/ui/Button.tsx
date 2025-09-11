import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getVariantStyle } from '../../theme/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: boolean;
  gradientColors?: Readonly<[string, string, ...string[]]>;
  fullWidth?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onLongPress?: () => void;
  haptics?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  gradient = false,
  gradientColors = [colors.primary600, colors.primary400],
  fullWidth = false,
  testID,
  accessibilityLabel,
  leftIcon,
  rightIcon,
  onLongPress,
  haptics = false,
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    style,
  ];

  const textStyleCombined = [
    getVariantStyle('body'),
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const handlePress = () => {
    if (!disabled && !loading) {
      if (haptics) {
        Haptics.selectionAsync();
      }
      onPress();
    }
  };

  if (gradient && variant === 'primary') {
    const gradientColorsResolved = (Array.isArray(gradientColors) && gradientColors.length >= 2
      ? gradientColors
      : [colors.primary600, colors.primary400]) as Readonly<[string, string, ...string[]]>;
    return (
      <TouchableOpacity
        style={[styles.button, styles[size], disabled && styles.disabled, fullWidth && styles.fullWidth, style]}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        onLongPress={onLongPress}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
      >
        <LinearGradient
          colors={gradientColorsResolved}
          style={[styles.gradient, styles[size]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              {leftIcon && <Ionicons name={leftIcon} size={18} color="#fff" style={styles.iconLeft} />}
              <Text style={textStyleCombined}>{title}</Text>
              {rightIcon && <Ionicons name={rightIcon} size={18} color="#fff" style={styles.iconRight} />}
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      onLongPress={onLongPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#fff' : '#667eea'}
          size="small"
        />
      ) : (
        <>
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={18}
              color={variant === 'primary' ? '#fff' : '#667eea'}
              style={styles.iconLeft}
            />
          )}
          <Text style={textStyleCombined}>{title}</Text>
          {rightIcon && (
            <Ionicons
              name={rightIcon}
              size={18}
              color={variant === 'primary' ? '#fff' : '#667eea'}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  gradient: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  fullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  // Variants
  primary: {
    backgroundColor: colors.primary600,
  },
  secondary: {
    backgroundColor: colors.primary025,
    borderWidth: 1,
    borderColor: colors.primary100,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary600,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#495057',
  },
  outlineText: {
    color: colors.primary600,
  },
  ghostText: {
    color: colors.primary600,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    opacity: 0.5,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
