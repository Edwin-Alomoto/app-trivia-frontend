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
  Image,
  ImageBackground,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';
import { RootStackParamList } from '@shared/domain/types';

import { forgotPasswordStyles } from '../styles/forgotPasswordStyles';
import { 
  ForgotPasswordForm,
  SuccessMessage,
  ModalAlert
} from '../components';
import { useAppDispatch, useAppSelector } from '@shared/domain/hooks';
import { forgotPassword } from '../../domain/store/authSlice';
import { Background, Letter } from '../../../../assets';
import { useLanguage } from '@shared/domain/contexts/LanguageContext';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;
type ForgotPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const route = useRoute<ForgotPasswordScreenRouteProp>();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  
  const [email, setEmail] = useState(route.params?.email || '');
  const [emailError, setEmailError] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  // Usar estado de carga de Redux en lugar de local
  const { isLoading } = useAppSelector((state) => state.auth);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];
  const scaleAnim = useState(new Animated.Value(0.98))[0];
  const emailInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Animaciones de entrada muy suaves
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
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
      setEmailError(t('auth.error.emailRequired'));
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(t('auth.error.invalidEmail'));
      return;
    }

    setEmailError('');

    try {
      console.log('Enviando solicitud de recuperación de contraseña para:', email);
      await dispatch(forgotPassword({ email })).unwrap();
      
      console.log('Email de recuperación enviado exitosamente');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsEmailSent(true);
      
    } catch (error: any) {
      console.error('Error al enviar email de recuperación:', error);
      
      // Determinar tipo de error y mensaje específico
      let errorTitle = t('auth.error.resetEmailFailed');
      let errorMessage = 'No se pudo enviar el email de recuperación.';
      
      if (error?.message) {
        if (error.message.includes('Network')) {
          errorTitle = 'Error de conexión';
          errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
        } else if (error.message.includes('timeout')) {
          errorTitle = 'Tiempo de espera agotado';
          errorMessage = 'El servidor tardó demasiado en responder. Inténtalo de nuevo.';
        } else if (error.message.includes('404')) {
          errorTitle = 'Email no encontrado';
          errorMessage = 'No existe una cuenta con este email. Verifica la dirección.';
        } else if (error.message.includes('429')) {
          errorTitle = 'Demasiados intentos';
          errorMessage = 'Has enviado demasiadas solicitudes. Espera unos minutos antes de intentar de nuevo.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setShowErrorModal(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground source={Background} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={forgotPasswordStyles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={forgotPasswordStyles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={forgotPasswordStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header con animación */}
            <Animated.View 
              style={[
                forgotPasswordStyles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={forgotPasswordStyles.header}>
                <View style={forgotPasswordStyles.logoContainer}>
                  <Image 
                    source={Letter}
                    style={forgotPasswordStyles.logoImage}
                    resizeMode="stretch"
                  />
                  <Text style={[getVariantStyle('h1'), forgotPasswordStyles.title]}>
                    {t('auth.forgotPassword')}
                  </Text>
                  <Text style={[getVariantStyle('subtitle'), forgotPasswordStyles.subtitle]}>
                    {t('auth.resetPassword')}
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Formulario con animación */}
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
                  <SuccessMessage email={email} onBackToLogin={handleBackToLogin} />
                )}
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      
      {/* Modal de Error */}
      <ModalAlert
        visible={showErrorModal}
        title="Error de recuperación"
        message="No se pudo enviar el email de recuperación. Inténtalo de nuevo."
        onClose={() => setShowErrorModal(false)}
      />
    </ImageBackground>
  );
};