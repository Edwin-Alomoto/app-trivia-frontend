import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';
import { RootStackParamList } from '@shared/domain/types';

import LoginHeader from '../components/LoginHeader';
import FormTextInput from '../components/FormTextInput';
import AuthFooter from '../components/AuthFooter';
import DecorativeBlobs from '../components/DecorativeBlobs';
import EntryAnimator from '../../../../shared/presentation/animations/EntryAnimator';
import { forgotPasswordScreenStyles } from './styles/ForgotPasswordScreen.styles';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;
type ForgotPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const route = useRoute<ForgotPasswordScreenRouteProp>();
  
  const [email, setEmail] = useState(route.params?.email || '');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];
  const scaleAnim = useState(new Animated.Value(0.98))[0];
  const emailScaleAnim = useRef(new Animated.Value(1)).current;
  const sendButtonScaleAnim = useRef(new Animated.Value(1)).current;

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

  const animateFocusIn = (scaleRef: Animated.Value) => {
    Animated.spring(scaleRef, {
      toValue: 1.01,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const animateFocusOut = (scaleRef: Animated.Value) => {
    Animated.spring(scaleRef, {
      toValue: 1,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressIn = () => {
    if (isLoading) return;
    Animated.spring(sendButtonScaleAnim, {
      toValue: 0.98,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(sendButtonScaleAnim, {
      toValue: 1,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

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
    <SafeAreaView style={forgotPasswordScreenStyles.container}>
      {/* Fondo con blobs orgánicos tenues */}
      <DecorativeBlobs variant="auth" style={forgotPasswordScreenStyles.backgroundLayer} />
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={forgotPasswordScreenStyles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={forgotPasswordScreenStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header con animación (idéntico al Login) */}
          <EntryAnimator style={forgotPasswordScreenStyles.header}>
            <LoginHeader
              title="Recuperar contraseña"
              subtitle="Te ayudamos a recuperar tu cuenta"
              logoSource={require('../../../../../assets/adaptive-icon.png')}
              containerStyle={forgotPasswordScreenStyles.logoContainer}
              logoStyle={forgotPasswordScreenStyles.logoImage as any}
            />
          </EntryAnimator>

          {/* Formulario con animación (idéntico al Login) */}
          <EntryAnimator style={forgotPasswordScreenStyles.formContainer}>
            <View style={forgotPasswordScreenStyles.formCard}>
              {!isEmailSent ? (
                <>
                  <View style={forgotPasswordScreenStyles.inputContainer}>
                    <Animated.View style={[forgotPasswordScreenStyles.animatedInputWrapper, { transform: [{ scale: emailScaleAnim }] }]}>
                      <FormTextInput
                        placeholder="Correo electrónico"
                        value={email}
                        onChangeText={(value) => {
                          setEmail(value);
                          if (emailError) setEmailError('');
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        textContentType="emailAddress"
                        onFocus={() => animateFocusIn(emailScaleAnim)}
                        onBlur={() => animateFocusOut(emailScaleAnim)}
                        returnKeyType="send"
                        onSubmitEditing={handleSendResetEmail}
                        error={emailError}
                      />
                    </Animated.View>
                  </View>

                  <AnimatedTouchableOpacity
                    style={[forgotPasswordScreenStyles.loginButton, isLoading && forgotPasswordScreenStyles.loginButtonDisabled, { transform: [{ scale: sendButtonScaleAnim }] }]}
                    onPress={handleSendResetEmail}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                    disabled={isLoading}
                  >
                    <View style={forgotPasswordScreenStyles.loginButtonContent}>
                      <Text style={[getVariantStyle('body'), forgotPasswordScreenStyles.loginButtonText, forgotPasswordScreenStyles.boldText]}>
                        {isLoading ? 'Enviando correo...' : 'Enviar correo de recuperación'}
                      </Text>
                    </View>
                  </AnimatedTouchableOpacity>

                  <AuthFooter
                    questionText=""
                    actionText="Volver al inicio de sesión"
                    onPress={handleBackToLogin}
                    style={forgotPasswordScreenStyles.forgotPasswordContainer}
                  />
                </>
              ) : (
                <>
                  <View style={forgotPasswordScreenStyles.successContainer}>
                    <View style={forgotPasswordScreenStyles.successIcon}>
                      <Ionicons name="checkmark-circle" size={64} color="#10B981" />
                    </View>
                    <Text style={[getVariantStyle('h2'), forgotPasswordScreenStyles.successTitle]}>¡Correo enviado!</Text>
                    <Text style={[getVariantStyle('body'), forgotPasswordScreenStyles.successSubtitle]}>
                      Hemos enviado un enlace de recuperación a:
                    </Text>
                    <Text style={[getVariantStyle('body'), forgotPasswordScreenStyles.successEmail]}>{email}</Text>
                    <Text style={[getVariantStyle('body'), forgotPasswordScreenStyles.successInstructions]}>
                      Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                    </Text>
                  </View>

                  <AnimatedTouchableOpacity
                    style={[forgotPasswordScreenStyles.loginButton, { transform: [{ scale: sendButtonScaleAnim }] }]}
                    onPress={handleBackToLogin}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                  >
                    <View style={forgotPasswordScreenStyles.loginButtonContent}>
                      <Text style={[getVariantStyle('body'), forgotPasswordScreenStyles.loginButtonText, forgotPasswordScreenStyles.boldText]}>Volver al inicio de sesión</Text>
                    </View>
                  </AnimatedTouchableOpacity>
                </>
              )}
            </View>
          </EntryAnimator>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

