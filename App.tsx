import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import LoginView from './src/views/LoginView';
import ResetPasswordView from './src/views/ResetPasswordView';
import RegisterView from './src/views/RegisterView';
import { theme } from './src/views/styles/theme';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'resetPassword' | 'register'>('login');

  const navigateToResetPassword = () => {
    setCurrentScreen('resetPassword');
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  const navigateToRegister = () => {
    setCurrentScreen('register');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'login' ? (
        <LoginView 
          onForgotPassword={navigateToResetPassword} 
          onSignUp={navigateToRegister}
        />
      ) : currentScreen === 'resetPassword' ? (
        <ResetPasswordView onBackToLogin={navigateToLogin} />
      ) : (
        <RegisterView onBackToLogin={navigateToLogin} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
});
