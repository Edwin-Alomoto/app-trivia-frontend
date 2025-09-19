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
  TextInput,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';
import { RootStackParamList } from '@shared/domain/types';
import { forgotPasswordStyles } from '../styles/forgotPasswordStyles';

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
            <View style={forgotPasswordStyles.logoContainer}>
              <Image 
                source={require('../../../../assets/adaptive-icon.png')}
                style={forgotPasswordStyles.logoImage}
                resizeMode="contain"
              />
              <Text style={[getVariantStyle('h1'), { color: colors.textPrimary }]}>Recuperar contraseña</Text>
              <Text style={[getVariantStyle('subtitle'), { color: colors.textSecondary }]}>Te ayudamos a recuperar tu cuenta</Text>
            </View>
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
                <>
                  <View style={forgotPasswordStyles.inputContainer}>
                    <Animated.View style={[forgotPasswordStyles.animatedInputWrapper, { transform: [{ scale: emailScaleAnim }] }]}>
                      <TextInput
                        style={[getVariantStyle('body'), forgotPasswordStyles.basicInput]}
                        placeholder="Correo electrónico"
                        placeholderTextColor={colors.muted}
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
                      />
                    </Animated.View>
                    {!!emailError && (
                      <Text style={[getVariantStyle('caption'), forgotPasswordStyles.errorText]}>{emailError}</Text>
                    )}
                  </View>

                  <AnimatedTouchableOpacity
                    style={[forgotPasswordStyles.loginButton, isLoading && forgotPasswordStyles.loginButtonDisabled, { transform: [{ scale: sendButtonScaleAnim }] }]}
                    onPress={handleSendResetEmail}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                    disabled={isLoading}
                  >
                    <View style={forgotPasswordStyles.loginButtonContent}>
                      <Text style={[getVariantStyle('body'), forgotPasswordStyles.loginButtonText, forgotPasswordStyles.boldText]}>
                        {isLoading ? 'Enviando correo...' : 'Enviar correo de recuperación'}
                      </Text>
                    </View>
                  </AnimatedTouchableOpacity>

                  <TouchableOpacity style={forgotPasswordStyles.forgotPasswordContainer} onPress={handleBackToLogin}>
                    <Text style={[getVariantStyle('body'), forgotPasswordStyles.forgotPasswordText]}>Volver al inicio de sesión</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={forgotPasswordStyles.successContainer}>
                    <View style={forgotPasswordStyles.successIcon}>
                      <Ionicons name="checkmark-circle" size={64} color="#10B981" />
                    </View>
                    <Text style={[getVariantStyle('h2'), forgotPasswordStyles.successTitle]}>¡Correo enviado!</Text>
                    <Text style={[getVariantStyle('body'), forgotPasswordStyles.successSubtitle]}>
                      Hemos enviado un enlace de recuperación a:
                    </Text>
                    <Text style={[getVariantStyle('body'), forgotPasswordStyles.successEmail]}>{email}</Text>
                    <Text style={[getVariantStyle('body'), forgotPasswordStyles.successInstructions]}>
                      Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                    </Text>
                  </View>

                  <AnimatedTouchableOpacity
                    style={[forgotPasswordStyles.loginButton, { transform: [{ scale: sendButtonScaleAnim }] }]}
                    onPress={handleBackToLogin}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                  >
                    <View style={forgotPasswordStyles.loginButtonContent}>
                      <Text style={[getVariantStyle('body'), forgotPasswordStyles.loginButtonText, forgotPasswordStyles.boldText]}>Volver al inicio de sesión</Text>
                    </View>
                  </AnimatedTouchableOpacity>
                </>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};