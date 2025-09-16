import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
    <SafeAreaView style={styles.container}>
      {/* Fondo con blobs orgánicos tenues */}
      <View pointerEvents="none" style={styles.backgroundLayer}>
        <View style={styles.blobTop} />
        <View style={styles.blobCenter} />
        <View style={styles.blobBottom} />
      </View>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header con animación (idéntico al Login) */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../../../../assets/adaptive-icon.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={[getVariantStyle('h1'), { color: colors.textPrimary }]}>Recuperar contraseña</Text>
              <Text style={[getVariantStyle('subtitle'), { color: colors.textSecondary }]}>Te ayudamos a recuperar tu cuenta</Text>
            </View>
          </Animated.View>

          {/* Formulario con animación (idéntico al Login) */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.formCard}>
              {!isEmailSent ? (
                <>
                  <View style={styles.inputContainer}>
                    <Animated.View style={[styles.animatedInputWrapper, { transform: [{ scale: emailScaleAnim }] }]}>
                      <TextInput
                        style={[getVariantStyle('body'), styles.basicInput]}
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
                      <Text style={[getVariantStyle('caption'), styles.errorText]}>{emailError}</Text>
                    )}
                  </View>

                  <AnimatedTouchableOpacity
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled, { transform: [{ scale: sendButtonScaleAnim }] }]}
                    onPress={handleSendResetEmail}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                    disabled={isLoading}
                  >
                    <View style={styles.loginButtonContent}>
                      <Text style={[getVariantStyle('body'), styles.loginButtonText, styles.boldText]}>
                        {isLoading ? 'Enviando correo...' : 'Enviar correo de recuperación'}
                      </Text>
                    </View>
                  </AnimatedTouchableOpacity>

                  <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleBackToLogin}>
                    <Text style={[getVariantStyle('body'), styles.forgotPasswordText]}>Volver al inicio de sesión</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.successContainer}>
                    <View style={styles.successIcon}>
                      <Ionicons name="checkmark-circle" size={64} color="#10B981" />
                    </View>
                    <Text style={[getVariantStyle('h2'), styles.successTitle]}>¡Correo enviado!</Text>
                    <Text style={[getVariantStyle('body'), styles.successSubtitle]}>
                      Hemos enviado un enlace de recuperación a:
                    </Text>
                    <Text style={[getVariantStyle('body'), styles.successEmail]}>{email}</Text>
                    <Text style={[getVariantStyle('body'), styles.successInstructions]}>
                      Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                    </Text>
                  </View>

                  <AnimatedTouchableOpacity
                    style={[styles.loginButton, { transform: [{ scale: sendButtonScaleAnim }] }]}
                    onPress={handleBackToLogin}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                  >
                    <View style={styles.loginButtonContent}>
                      <Text style={[getVariantStyle('body'), styles.loginButtonText, styles.boldText]}>Volver al inicio de sesión</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  blobTop: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    top: -200,
    left: -150,
    backgroundColor: 'rgba(210, 180, 254, 0.08)',
  },
  blobCenter: {
    position: 'absolute',
    width: 450,
    height: 450,
    borderRadius: 225,
    top: 180,
    alignSelf: 'center',
    backgroundColor: 'rgba(230, 213, 255, 0.06)',
  },
  blobBottom: {
    position: 'absolute',
    width: 700,
    height: 700,
    borderRadius: 350,
    bottom: -300,
    right: -200,
    backgroundColor: 'rgba(230, 213, 255, 0.06)',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 72,
    height: 72,
    marginBottom: 28,
  },
  formContainer: {
    flex: 1,
  },
  formCard: {
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  basicInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.textPrimary,
    minHeight: 56,
  },
  animatedInputWrapper: {
    borderRadius: 12,
  },
  errorText: {
    color: colors.error,
    marginTop: 6,
    marginLeft: 4,
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: colors.primary600,
  },
  loginButtonDisabled: {
    opacity: 0.5,
    backgroundColor: colors.muted,
  },
  loginButtonContent: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.onPrimary,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  forgotPasswordText: {
    color: colors.primary600,
    fontWeight: '500',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 16,
  },
  successSubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  successEmail: {
    fontWeight: '600',
    color: colors.textPrimary,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  successInstructions: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '600',
  },
});
