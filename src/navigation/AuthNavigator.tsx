import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../hooks/useAppSelector';
import { RootStackParamList, MainTabParamList } from '@shared/domain/types';

// Auth Screens
import { LoginScreen } from '../features/auth/presentation/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/presentation/screens/RegisterScreen';
import { ForgotPasswordScreen } from '../features/auth/presentation/screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../features/auth/presentation/screens/ResetPasswordScreen';
import { ModeSelectionScreen } from '../features/auth/presentation/screens/ModeSelectionScreen';

// Main Screens
import { MainTabNavigator } from './MainTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export const AuthNavigator: React.FC = () => {
  const { user, isLoading } = useAppSelector((state) => state.auth);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return null; // O un componente de loading
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Usuario autenticado - ir a MainTabs
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        ) : (
          // Usuario no autenticado - ir a Login
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
        
        {/* Screens de autenticación siempre disponibles */}
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="ModeSelection" component={ModeSelectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
