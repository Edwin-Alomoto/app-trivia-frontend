import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthInput } from '../AuthInput';
import { AuthButton } from '../AuthButton';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface ForgotPasswordFormProps {
  // Form data
  email: string;
  error: string;
  
  // Handlers
  onEmailChange: (email: string) => void;
  onSendReset: () => void;
  onBackToLogin: () => void;
  
  // Focus state
  isEmailFocused: boolean;
  onEmailFocus: () => void;
  onEmailBlur: () => void;
  
  // Loading state
  isLoading: boolean;
  
  // Ref
  emailInputRef: React.RefObject<any>;
  
  style?: any;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  email,
  error,
  onEmailChange,
  onSendReset,
  onBackToLogin,
  isEmailFocused,
  onEmailFocus,
  onEmailBlur,
  isLoading,
  emailInputRef,
  style,
}) => {
  return (
    <View style={[styles.form, style]}>
      {/* Campo Email */}
      <AuthInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={onEmailChange}
        error={error}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={onEmailFocus}
        onBlur={onEmailBlur}
        inputRef={emailInputRef}
        isFocused={isEmailFocused}
        returnKeyType="go"
        onSubmitEditing={onSendReset}
        autoComplete="email"
        textContentType="emailAddress"
      />

      {/* Botón de envío */}
      <AuthButton
        title={isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
        onPress={onSendReset}
        disabled={isLoading}
        loading={isLoading}
        gradient="gold"
      />

      {/* Footer */}
      <View style={styles.footerContainer}>
        <Text style={[getVariantStyle('body'), styles.footerText]}>¿Recordaste tu contraseña?</Text>
        <TouchableOpacity onPress={onBackToLogin}>
          <Text style={[getVariantStyle('body'), styles.linkText]}>Volver al login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#ffffff',
    marginBottom: 8,
  },
  linkText: {
    color: colors.gold,
    fontWeight: '600',
  },
});
