import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface PasswordInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  inputRef?: React.RefObject<TextInput>;
  isFocused?: boolean;
  autoComplete?: 'password' | 'new-password' | 'current-password';
  textContentType?: 'password' | 'newPassword' | 'oneTimeCode';
  blurOnSubmit?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder = 'Contraseña',
  value,
  onChangeText,
  error,
  returnKeyType = 'go',
  onSubmitEditing,
  onFocus,
  onBlur,
  inputRef,
  isFocused = false,
  autoComplete = 'password',
  textContentType = 'password',
  blurOnSubmit = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    onFocus?.();
    Animated.spring(scaleAnim, {
      toValue: 1.01,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    onBlur?.();
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.inputContainer}>
      <Animated.View
        style={[
          styles.animatedInputWrapper,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View
          style={[
            styles.passwordContainer,
            isFocused && styles.inputFocused,
            error && styles.inputError,
          ]}
          onTouchStart={() => inputRef?.current?.focus()}
        >
          <TextInput
            ref={inputRef}
            style={[getVariantStyle('body'), styles.passwordInput]}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={handleFocus}
            onBlur={handleBlur}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            autoComplete={autoComplete}
            textContentType={textContentType}
            blurOnSubmit={blurOnSubmit}
          />
          <TouchableOpacity
            onPress={togglePassword}
            style={styles.eyeButton}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color={colors.muted} 
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
      {error && (
        <Text style={[getVariantStyle('caption'), styles.errorText]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  animatedInputWrapper: {
    borderRadius: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    minHeight: 56,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: colors.primary600,
    backgroundColor: colors.surface,
    shadowColor: colors.primary600,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: colors.error,
    marginTop: 6,
    marginLeft: 4,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
