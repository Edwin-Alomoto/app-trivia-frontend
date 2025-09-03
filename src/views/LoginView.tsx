import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
  AuthHeader, 
  FormInput, 
  PasswordInput, 
  PrimaryButton, 
  AuthLink 
} from './components/auth';
import { DecorativeBackground } from './components/DecorativeBackground';
import { commonStyles } from './styles/common.styles';
import { authStyles } from './styles/auth.styles';
import { theme } from './styles/theme';

interface LoginViewProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
  onSubscription: () => void;
}

export default function LoginView({ onForgotPassword, onSignUp, onSubscription }: LoginViewProps): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    // Simular login
    setTimeout(() => {
      setIsLoading(false);
      onSubscription(); // Navegar a la pantalla de suscripción
    }, 2000);
  };

  const handleForgotPassword = () => {
    onForgotPassword();
  };

  const handleSignUp = () => {
    onSignUp();
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <DecorativeBackground />
      <StatusBar style="light" />
      
      <ScrollView 
        contentContainerStyle={commonStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader 
          title="¡Bienvenido a WinUp!"
          subtitle="Accede a tu cuenta para continuar"
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
          
          {/* <View style={{ marginTop: theme.spacing.md }}>
            <AuthLink
              text="¿Quieres ver las opciones de suscripción?"
              linkText="Ver planes"
              onPress={onSubscription}
            />
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


