import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import LoginView from './src/views/auth/LoginView';
import ResetPasswordView from './src/views/auth/ResetPasswordView';
import RegisterView from './src/views/auth/RegisterView';
import SubscriptionView from './src/views/subscription/SubscriptionView';
import HomeView from './src/views/home/HomeView';
import { theme } from './src/views/shared/styles/theme';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'resetPassword' | 'register' | 'subscription' | 'home'>('login');

  const navigateToResetPassword = () => {
    setCurrentScreen('resetPassword');
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  const navigateToRegister = () => {
    setCurrentScreen('register');
  };

  const navigateToSubscription = () => {
    setCurrentScreen('subscription');
  };

  const navigateToHome = () => {
    setCurrentScreen('home');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'login' ? (
        <LoginView 
          onForgotPassword={navigateToResetPassword} 
          onSignUp={navigateToRegister}
          onSubscription={navigateToSubscription}
        />
      ) : currentScreen === 'resetPassword' ? (
        <ResetPasswordView onBackToLogin={navigateToLogin} />
      ) : currentScreen === 'register' ? (
        <RegisterView onBackToLogin={navigateToLogin} />
      ) : currentScreen === 'subscription' ? (
        <SubscriptionView onBackToLogin={navigateToLogin} onNavigateToHome={navigateToHome} />
      ) : (
        <HomeView />
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
