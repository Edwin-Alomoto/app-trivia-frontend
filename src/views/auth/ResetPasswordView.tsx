import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
  AuthHeader, 
  FormInput, 
  PrimaryButton, 
  AuthLink 
} from './components';
import { DecorativeBackground } from '../shared/components/DecorativeBackground';
import { commonStyles } from '../shared/styles/common.styles';
import { authStyles } from '../shared/styles/auth.styles';

interface ResetPasswordViewProps {
  onBackToLogin: () => void;
}

export default function ResetPasswordView({ onBackToLogin }: ResetPasswordViewProps): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) return;
    
    setIsLoading(true);
    // Simular envío de email
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleBackToLogin = () => {
    onBackToLogin();
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
          title="Restablecer Contraseña"
          subtitle="Ingresa tu email y te ayudaremos a recuperar tu contraseña"
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
          
          <PrimaryButton
            title="Recuperar Contraseña"
            onPress={handleResetPassword}
            loading={isLoading}
            disabled={!email || isLoading}
          />
        </View>

        <View style={commonStyles.centerContainer}>
          <AuthLink
            text="¿Recordaste tu contraseña?"
            linkText="Volver a iniciar sesión"
            onPress={handleBackToLogin}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


