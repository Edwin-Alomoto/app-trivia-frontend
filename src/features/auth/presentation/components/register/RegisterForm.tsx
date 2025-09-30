import React from 'react';
import { View, StyleSheet } from 'react-native';

import { AuthInput } from '../AuthInput';
import { PasswordInput } from '../PasswordInput';
import { AuthButton } from '../AuthButton';
import { AuthFooter } from '../AuthFooter';
import { DatePickerInput } from './DatePickerInput';
import { DropdownInput } from './DropdownInput';
import { TermsAndPrivacySection } from './TermsAndPrivacySection';

interface RegisterFormProps {
  // Form data
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    birthdate: string;
    gender: string;
    password: string;
  };
  errors: {
    firstName: string;
    lastName: string;
    email: string;
    birthdate: string;
    gender: string;
    password: string;
  };
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  
  // Handlers
  onFormDataChange: (field: string, value: string) => void;
  onTermsToggle: () => void;
  onPrivacyToggle: () => void;
  onRegister: () => void;
  onLoginPress: () => void;
  
  // Focus states
  isFirstNameFocused: boolean;
  isLastNameFocused: boolean;
  isEmailFocused: boolean;
  isBirthdateFocused: boolean;
  isGenderFocused: boolean;
  isPasswordFocused: boolean;
  
  // Focus handlers
  onFirstNameFocus: () => void;
  onFirstNameBlur: () => void;
  onLastNameFocus: () => void;
  onLastNameBlur: () => void;
  onEmailFocus: () => void;
  onEmailBlur: () => void;
  onBirthdateFocus: () => void;
  onBirthdateBlur: () => void;
  onGenderFocus: () => void;
  onGenderBlur: () => void;
  onPasswordFocus: () => void;
  onPasswordBlur: () => void;
  
  // Date picker
  showBirthdatePicker: boolean;
  onToggleBirthdatePicker: () => void;
  birthdateValue?: Date;
  onBirthdateChange: (event: any, selectedDate?: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  
  // Gender picker
  isGenderPickerOpen: boolean;
  onGenderToggle: () => void;
  
  // Loading state
  isLoading: boolean;
  
  // Refs
  firstNameInputRef: React.RefObject<any>;
  lastNameInputRef: React.RefObject<any>;
  emailInputRef: React.RefObject<any>;
  passwordInputRef: React.RefObject<any>;
  
  style?: any;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  errors,
  acceptedTerms,
  acceptedPrivacy,
  onFormDataChange,
  onTermsToggle,
  onPrivacyToggle,
  onRegister,
  onLoginPress,
  isFirstNameFocused,
  isLastNameFocused,
  isEmailFocused,
  isBirthdateFocused,
  isGenderFocused,
  isPasswordFocused,
  onFirstNameFocus,
  onFirstNameBlur,
  onLastNameFocus,
  onLastNameBlur,
  onEmailFocus,
  onEmailBlur,
  onBirthdateFocus,
  onBirthdateBlur,
  onGenderFocus,
  onGenderBlur,
  onPasswordFocus,
  onPasswordBlur,
  showBirthdatePicker,
  onToggleBirthdatePicker,
  birthdateValue,
  onBirthdateChange,
  minDate,
  maxDate,
  isGenderPickerOpen,
  onGenderToggle,
  isLoading,
  firstNameInputRef,
  lastNameInputRef,
  emailInputRef,
  passwordInputRef,
  style,
}) => {
  const genderOptions = [
    { label: 'Femenino', value: 'Femenino' },
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Otro', value: 'Otro' },
    { label: 'Prefiero no decirlo', value: 'Prefiero no decirlo' }
  ];

  return (
    <View style={[styles.form, style]}>
      {/* Campo Nombre */}
      <AuthInput
        placeholder="Nombre"
        value={formData.firstName}
        onChangeText={(value) => onFormDataChange('firstName', value)}
        error={errors.firstName}
        autoCapitalize="words"
        returnKeyType="next"
        onFocus={onFirstNameFocus}
        onBlur={onFirstNameBlur}
        inputRef={firstNameInputRef}
        isFocused={isFirstNameFocused}
        onSubmitEditing={() => lastNameInputRef.current?.focus()}
        autoComplete="name"
        textContentType="name"
      />

      {/* Campo Apellido */}
      <AuthInput
        placeholder="Apellido"
        value={formData.lastName}
        onChangeText={(value) => onFormDataChange('lastName', value)}
        error={errors.lastName}
        autoCapitalize="words"
        returnKeyType="next"
        onFocus={onLastNameFocus}
        onBlur={onLastNameBlur}
        inputRef={lastNameInputRef}
        isFocused={isLastNameFocused}
        onSubmitEditing={() => emailInputRef.current?.focus()}
        autoComplete="name"
        textContentType="name"
      />

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
        onSubmitEditing={onToggleBirthdatePicker}
        autoComplete="email"
        textContentType="emailAddress"
      />

      {/* Campo Fecha de nacimiento */}
      <DatePickerInput
        placeholder="Fecha de nacimiento (DD/MM/AAAA)"
        value={formData.birthdate}
        onDateChange={(date) => onFormDataChange('birthdate', date)}
        error={errors.birthdate}
        isFocused={isBirthdateFocused}
        onFocus={onBirthdateFocus}
        onBlur={onBirthdateBlur}
        showPicker={showBirthdatePicker}
        onTogglePicker={onToggleBirthdatePicker}
        selectedDate={birthdateValue}
        onDatePickerChange={onBirthdateChange}
        minDate={minDate}
        maxDate={maxDate}
      />

      {/* Campo Género */}
      <DropdownInput
        placeholder="Selecciona tu género"
        value={formData.gender}
        onValueChange={(value) => onFormDataChange('gender', value)}
        options={genderOptions}
        error={errors.gender}
        isFocused={isGenderFocused}
        onFocus={onGenderFocus}
        onBlur={onGenderBlur}
        isOpen={isGenderPickerOpen}
        onToggle={onGenderToggle}
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
        returnKeyType="done"
        onSubmitEditing={onRegister}
        autoComplete="new-password"
        textContentType="newPassword"
      />

      {/* Términos y Privacidad */}
      <TermsAndPrivacySection
        acceptedTerms={acceptedTerms}
        acceptedPrivacy={acceptedPrivacy}
        onTermsToggle={onTermsToggle}
        onPrivacyToggle={onPrivacyToggle}
      />

      {/* Botón de registro */}
      <AuthButton
        title="Crear cuenta"
        onPress={onRegister}
        disabled={!acceptedTerms || !acceptedPrivacy || isLoading}
        loading={isLoading}
        variant="primary"
        gradient="gold"
      />

      {/* Footer */}
      <AuthFooter
        text="¿Ya tienes cuenta? "
        linkText="Iniciar sesión"
        onLinkPress={onLoginPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
});
