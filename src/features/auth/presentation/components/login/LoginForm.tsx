import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from '@theme/colors';
import { AuthInput } from '../AuthInput';
import { PasswordInput } from '../PasswordInput';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { RememberMeCheckbox } from '../RememberMeCheckbox';
import { getVariantStyle } from '@theme/typography';

interface LoginFormProps {
  // Form data
  formData: {
    email: string;
    password: string;
  };
  errors: {
    email: string;
    password: string;
  };
  rememberMe: boolean;
  
  // Handlers
  onFormDataChange: (field: string, value: string) => void;
  onRememberMeToggle: () => void;
  onLogin: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
  
  // Focus states
  isEmailFocused: boolean;
  isPasswordFocused: boolean;
  
  // Focus handlers
  onEmailFocus: () => void;
  onEmailBlur: () => void;
  onPasswordFocus: () => void;
  onPasswordBlur: () => void;
  
  // Loading state
  isLoading: boolean;
  
  // Refs
  emailInputRef: React.RefObject<any>;
  passwordInputRef: React.RefObject<any>;
  
  style?: any;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  errors,
  rememberMe,
  onFormDataChange,
  onRememberMeToggle,
  onLogin,
  onForgotPassword,
  onRegister,
  isEmailFocused,
  isPasswordFocused,
  onEmailFocus,
  onEmailBlur,
  onPasswordFocus,
  onPasswordBlur,
  isLoading,
  emailInputRef,
  passwordInputRef,
  style,
}) => {
  return (
    <View style={[styles.form, style]}>
      {/* Campo Email */}
      <AuthInput
        placeholder="Correo electrónico"
        value={formData.email}
        onChangeText={(value) => onFormDataChange('email', value)}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={onEmailFocus}
        onBlur={onEmailBlur}
        inputRef={emailInputRef}
        isFocused={isEmailFocused}
        blurOnSubmit={false}
        returnKeyType="next"
        onSubmitEditing={() => passwordInputRef.current?.focus()}
        autoComplete="email"
        textContentType="emailAddress"
      />

      {/* Campo Contraseña */}
      <PasswordInput
        placeholder="Contraseña"
        value={formData.password}
        onChangeText={(value) => onFormDataChange('password', value)}
        error={errors.password}
        onFocus={onPasswordFocus}
        onBlur={onPasswordBlur}
        inputRef={passwordInputRef}
        isFocused={isPasswordFocused}
        returnKeyType="go"
        onSubmitEditing={onLogin}
        autoComplete="password"
        textContentType="password"
        blurOnSubmit={true}
      />

      {/* Opción Recordarme */}
      <RememberMeCheckbox
        checked={rememberMe}
        onToggle={onRememberMeToggle}
        text="Mantener sesión iniciada"
      />

      {/* Botón de login */}
      <AuthButton
        title={isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        onPress={onLogin}
        disabled={isLoading}
        loading={isLoading}
        variant="primary"
        gradient="gold"
      />

      {/* Enlace recuperar contraseña */}
      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={onForgotPassword}
      >
        <Text style={[getVariantStyle('body'), styles.forgotPasswordText]}>
          ¿Olvidaste tu contraseña?
        </Text>
      </TouchableOpacity>

      

      {/* Footer */}
      <AuthFooter
        text="¿No tienes cuenta? "
        linkText="Regístrate"
        onLinkPress={onRegister}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.gold,
    fontWeight: '600',
  },
  testCredentialsContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  testCredentialsTitle: {
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: 8,
  },
  testCredentialsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#28a745',
    borderRadius: 6,
  },
  testCredentialsText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
