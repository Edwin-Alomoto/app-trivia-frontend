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
import { useAppDispatch } from '@shared/domain/hooks/useAppDispatch';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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

    setIsLoading(true);
    setEmailError('');

    try {
      await dispatch(forgotPassword({ email })).unwrap();
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsEmailSent(true);
      
    } catch (error) {
      setShowErrorModal(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
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
        title={t('auth.error.resetEmailFailed')}
        message={t('auth.error.resetEmailFailed')}
        onClose={() => setShowErrorModal(false)}
      />
    </ImageBackground>
  );
};