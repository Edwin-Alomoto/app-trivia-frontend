import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, View, SafeAreaView, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
  AuthHeader, 
  FormInput, 
  PasswordInput, 
  PrimaryButton, 
  AuthLink,
  DateInput
} from './components';
import { DecorativeBackground } from '../shared/components/DecorativeBackground';
import { commonStyles } from '../shared/styles/common.styles';
import { authStyles } from '../shared/styles/auth.styles';

interface RegisterViewProps {
  onBackToLogin: () => void;
}

export default function RegisterView({ onBackToLogin }: RegisterViewProps): React.JSX.Element {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);

  const genderOptions = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Femenino', value: 'femenino' },
    { label: 'No binario', value: 'no-binario' },
    { label: 'Prefiero no decir', value: 'prefiero-no-decir' }
  ];

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !gender || !birthDate || !password || !confirmPassword) return;
    if (password !== confirmPassword) return;
    
    setIsLoading(true);
    // Simular registro
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleBackToLogin = () => {
    onBackToLogin();
  };

  const handleGenderSelect = (selectedGender: string) => {
    setGender(selectedGender);
    setShowGenderModal(false);
  };

  const getGenderDisplayText = () => {
    if (!gender) return 'Selecciona tu género';
    const option = genderOptions.find(opt => opt.value === gender);
    return option ? option.label : 'Selecciona tu género';
  };

  const isFormValid = firstName && lastName && email && gender && birthDate && password && confirmPassword && password === confirmPassword;

  return (
    <SafeAreaView style={commonStyles.container}>
      <DecorativeBackground />
      <StatusBar style="light" />
      
      <ScrollView 
        contentContainerStyle={commonStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader 
          title="¡Únete a WinUp!"
          subtitle="Crea tu cuenta para comenzar"
        />

        <View style={commonStyles.formContainer}>
          <FormInput
            label="Nombre"
            placeholder="Tu nombre"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoComplete="given-name"
          />

          <FormInput
            label="Apellido"
            placeholder="Tu apellido"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            autoComplete="family-name"
          />

          <FormInput
            label="Email"
            placeholder="Tu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>Género</Text>
            <TouchableOpacity
              style={authStyles.dropdownButton}
              onPress={() => setShowGenderModal(true)}
            >
              <Text style={[
                authStyles.dropdownButtonText,
                !gender && authStyles.placeholderText
              ]}>
                {getGenderDisplayText()}
              </Text>
              <Text style={authStyles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          <DateInput
            label="Fecha de nacimiento"
            placeholder="DD/MM/AAAA"
            value={birthDate}
            onChangeText={setBirthDate}
          />
          
          <PasswordInput
            label="Contraseña"
            placeholder="Tu contraseña"
            value={password}
            onChangeText={setPassword}
            autoComplete="new-password"
          />

          <PasswordInput
            label="Confirmar contraseña"
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoComplete="new-password"
          />
          
          <PrimaryButton
            title="Crear cuenta"
            onPress={handleRegister}
            loading={isLoading}
            disabled={!isFormValid || isLoading}
          />
        </View>

        <View style={commonStyles.centerContainer}>
          <AuthLink
            text="¿Ya tienes una cuenta?"
            linkText="Inicia sesión aquí"
            onPress={handleBackToLogin}
          />
        </View>
      </ScrollView>

      {/* Modal para selección de género */}
      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <TouchableOpacity
          style={authStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGenderModal(false)}
        >
          <View style={authStyles.modalContent}>
            <Text style={authStyles.modalTitle}>Selecciona tu género</Text>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  authStyles.modalOption,
                  gender === option.value && authStyles.modalOptionSelected
                ]}
                onPress={() => handleGenderSelect(option.value)}
              >
                <Text style={[
                  authStyles.modalOptionText,
                  gender === option.value && authStyles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}


