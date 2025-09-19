import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import { colors } from '@theme/colors';
import { RootStackParamList } from '@shared/domain/types';

import { forgotPasswordStyles } from '../styles/forgotPasswordStyles';
import { 
  ForgotPasswordForm,
  ForgotPasswordHeader,
  SuccessMessage
} from '../components';


type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;
type ForgotPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const route = useRoute<ForgotPasswordScreenRouteProp>();
  
  const [email, setEmail] = useState(route.params?.email || '');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];
  const scaleAnim = useState(new Animated.Value(0.98))[0];
  const emailInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);


  const validateEmail = (emailToValidate: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailToValidate);
  };

  const handleSendResetEmail = async () => {
    if (!email) {
      setEmailError('Ingresa tu correo electrónico.');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('El correo electrónico no es válido.');
      return;
    }

    setIsLoading(true);
    setEmailError('');

    try {
      // Simular envío de email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsEmailSent(true);
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el correo de recuperación. Inténtalo de nuevo.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={forgotPasswordStyles.container}>
      {/* Fondo con blobs orgánicos tenues */}
      <View pointerEvents="none" style={forgotPasswordStyles.backgroundLayer}>
        <View style={forgotPasswordStyles.blobTop} />
        <View style={forgotPasswordStyles.blobCenter} />
        <View style={forgotPasswordStyles.blobBottom} />
      </View>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={forgotPasswordStyles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={forgotPasswordStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header con animación (idéntico al Login) */}
          <Animated.View 
            style={[
              forgotPasswordStyles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <ForgotPasswordHeader />
          </Animated.View>

          {/* Formulario con animación (idéntico al Login) */}
          <Animated.View
            style={[
              forgotPasswordStyles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <View style={forgotPasswordStyles.formCard}>
              {!isEmailSent ? (
                <ForgotPasswordForm
                  email={email}
                  error={emailError}
                  onEmailChange={(value) => {
                    setEmail(value);
                    if (emailError) setEmailError('');
                  }}
                  onSendReset={handleSendResetEmail}
                  onBackToLogin={handleBackToLogin}
                  isEmailFocused={isEmailFocused}
                  onEmailFocus={() => setIsEmailFocused(true)}
                  onEmailBlur={() => setIsEmailFocused(false)}
                  isLoading={isLoading}
                  emailInputRef={emailInputRef}
                />
              ) : (
                <SuccessMessage email={email} />
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};