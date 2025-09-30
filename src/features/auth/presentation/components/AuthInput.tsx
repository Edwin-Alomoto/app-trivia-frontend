import React, { useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface AuthInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  inputRef?: React.RefObject<TextInput>;
  isFocused?: boolean;
  secureTextEntry?: boolean;
  showToggle?: boolean;
  onTogglePassword?: () => void;
  autoComplete?: 'email' | 'password' | 'new-password' | 'current-password' | 'name' | 'username' | 'tel' | 'url';
  textContentType?: 'none' | 'password' | 'newPassword' | 'oneTimeCode' | 'emailAddress' | 'name' | 'nickname' | 'username' | 'URL';
  blurOnSubmit?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  returnKeyType = 'done',
  onSubmitEditing,
  onFocus,
  onBlur,
  inputRef,
  isFocused = false,
  secureTextEntry = false,
  showToggle = false,
  onTogglePassword,
  autoComplete,
  textContentType,
  blurOnSubmit = true,
}) => {
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

  return (
    <View style={styles.inputContainer}>
      <Animated.View
        style={[
          styles.animatedInputWrapper,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {secureTextEntry ? (
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
              secureTextEntry={secureTextEntry}
              autoCapitalize={autoCapitalize}
              autoCorrect={autoCorrect}
              onFocus={handleFocus}
              onBlur={handleBlur}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
              autoComplete={autoComplete}
              textContentType={textContentType}
              blurOnSubmit={blurOnSubmit}
            />
            {showToggle && (
              <TouchableOpacity
                onPress={onTogglePassword}
                style={styles.eyeButton}
              >
                <Ionicons 
                  name={secureTextEntry ? "eye-off" : "eye"} 
                  size={20} 
                  color={colors.muted} 
                />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TextInput
            ref={inputRef}
            style={[
              getVariantStyle('body'),
              styles.basicInput,
              isFocused && styles.inputFocused,
              error && styles.inputError,
            ]}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            onFocus={handleFocus}
            onBlur={handleBlur}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            autoComplete={autoComplete}
            textContentType={textContentType}
            blurOnSubmit={blurOnSubmit}
          />
        )}
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
  basicInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.textPrimary,
    minHeight: 56,
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
    borderColor: colors.gold,
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: colors.gold,
    marginTop: 6,
    marginLeft: 4,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
