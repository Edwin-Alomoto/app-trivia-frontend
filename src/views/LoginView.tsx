import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
  AuthHeader, 
  FormInput, 
  PasswordInput, 
  PrimaryButton, 
  AuthLink 
} from './components/auth';
import { commonStyles } from './styles/common.styles';
import { authStyles } from './styles/auth.styles';

export default function LoginView(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    // Simular login
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleForgotPassword = () => {
    // Navegar a pantalla de recuperar contraseña
    console.log('Navegar a recuperar contraseña');
  };

  const handleSignUp = () => {
    // Navegar a pantalla de registro
    console.log('Navegar a registro');
  };

  return (
    <KeyboardAvoidingView 
      style={commonStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      <ScrollView 
        contentContainerStyle={commonStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader 
          title="Bienvenido"
          subtitle="Inicia sesión para continuar"
        />

        <View style={commonStyles.formContainer}>
          <FormInput
            label="Email"
            placeholder="Tu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          
          <PasswordInput
            label="Contraseña"
            placeholder="Tu contraseña"
            value={password}
            onChangeText={setPassword}
            autoComplete="password"
          />
          
          <View style={authStyles.forgotPasswordContainer}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={authStyles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>
          
          <PrimaryButton
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={isLoading}
            disabled={!email || !password || isLoading}
          />
        </View>

        <View style={commonStyles.centerContainer}>
          <AuthLink
            text="¿No tienes una cuenta?"
            linkText="Regístrate aquí"
            onPress={handleSignUp}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


