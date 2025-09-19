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
  Dimensions,
  TextInput,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';
import { RootStackParamList } from '@shared/domain/types';

import { loginUser } from '../../domain/store/authSlice';
import { useAppDispatch } from '../../../../shared/domain/hooks/useAppDispatch';
import { useAppSelector } from '../../../../shared/domain/hooks/useAppSelector';
import { featureFlags } from '../../../../app/config/featureFlags';
import { useLoginViewModel } from '../../domain/hooks/useLoginViewModel';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const { width, height } = Dimensions.get('window');

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  // MVVM (desactivado por defecto)
  const vm = useLoginViewModel();
  const shouldUseVM = featureFlags.useMVVMLogin;

  // Estados del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // Estados de validación y UX
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Referencias para animaciones
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];
  const scaleAnim = useState(new Animated.Value(0.98))[0];
  // Animaciones de focus y botón
  const emailScaleAnim = useRef(new Animated.Value(1)).current;
  const passwordScaleAnim = useRef(new Animated.Value(1)).current;
  const loginButtonScaleAnim = useRef(new Animated.Value(1)).current;

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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

  const animateFocusIn = (scaleAnimRef: Animated.Value) => {
    Animated.parallel([
      Animated.spring(scaleAnimRef, {
        toValue: 1.01,
        tension: 120,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateFocusOut = (scaleAnimRef: Animated.Value) => {
    Animated.parallel([
      Animated.spring(scaleAnimRef, {
        toValue: 1,
        tension: 120,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLoginButtonPressIn = () => {
    if (isLoading) return;
    Animated.spring(loginButtonScaleAnim, {
      toValue: 0.98,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleLoginButtonPressOut = () => {
    Animated.spring(loginButtonScaleAnim, {
      toValue: 1,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  // Validación de email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      newErrors.email = 'Ingresa tu correo electrónico.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido.';
    }

    if (!formData.password) {
      newErrors.password = 'Ingresa tu contraseña.';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };



  // Manejar login
  const handleLogin = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (shouldUseVM && vm) {
        vm.setField('email', formData.email);
        vm.setField('password', formData.password);
        const res = await vm.submit();
        if (!res.ok) throw new Error(res.error || 'Error al iniciar sesión');
        const user = res.user;
        if (user.subscriptionStatus === 'not_subscribed') {
          navigation.navigate('ModeSelection' as never);
        } else {
          navigation.navigate('MainTabs' as never);
        }
        return;
      }

      const result = await dispatch(loginUser({
        email: formData.email,
        password: formData.password,
      })).unwrap();

      if (result.user.subscriptionStatus === 'not_subscribed') {
        navigation.navigate('ModeSelection' as never);
      } else {
        navigation.navigate('MainTabs' as never);
      }
      
    } catch (loginError: any) {
      Alert.alert('Error', loginError?.message || 'Credenciales incorrectas');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Manejar recuperación de contraseña
  const handleForgotPassword = () => {
    if (!formData.email) {
      Alert.alert('Email requerido', 'Ingresa tu email para recuperar tu contraseña.');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      Alert.alert('Email inválido', 'Ingresa un email válido.');
      return;
    }
    
    (navigation as any).navigate('ForgotPassword', { email: formData.email });
  };

  // Manejar registro
  const handleRegister = () => {
    navigation.navigate('Register' as never);
  };

  // Actualizar datos del formulario
  const _updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header muy sutil */}
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
                  source={require('../../../../assets/adaptive-icon.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              <Text style={[getVariantStyle('h1'), { color: colors.textPrimary }]}>¡Bienvenido a WinUp!</Text>
              <Text style={[getVariantStyle('subtitle'), { color: colors.textSecondary }]}>Acumula puntos y gana premios.</Text>
              </View>
            </Animated.View>

          {/* Formulario muy sutil */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim }, 
                  { scale: scaleAnim }
                ],
              },
            ]}
          >
            <View style={styles.formCard}>
              {/* Campo Email */}
              <View style={styles.inputContainer}>
                <Animated.View
                  style={[
                    styles.animatedInputWrapper,
                    { transform: [{ scale: emailScaleAnim }] },
                  ]}
                >
                <TextInput
                  ref={emailInputRef}
                  style={[getVariantStyle('body'), styles.basicInput, isEmailFocused && styles.inputFocused]}
                  placeholder="Correo electrónico"
                  placeholderTextColor={colors.muted}
                  value={formData.email}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  blurOnSubmit={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  onFocus={() => {
                    setIsEmailFocused(true);
                    animateFocusIn(emailScaleAnim);
                  }}
                  onBlur={() => {
                    setIsEmailFocused(false);
                    animateFocusOut(emailScaleAnim);
                  }}
                />
                </Animated.View>
                {errors.email && (
                  <Text style={[getVariantStyle('caption'), styles.errorText]}>{errors.email}</Text>
                )}
              </View>

              {/* Campo Contraseña */}
              <View style={styles.inputContainer}>
                <Animated.View
                  style={[
                    styles.animatedInputWrapper,
                    { transform: [{ scale: passwordScaleAnim }] },
                  ]}
                >
                <View
                  style={[styles.passwordContainer, isPasswordFocused && styles.inputFocused]}
                  onTouchStart={() => passwordInputRef.current?.focus()}
                >
                  <TextInput
                    ref={passwordInputRef}
                    style={[getVariantStyle('body'), styles.passwordInput]}
                    placeholder="Contraseña"
                    placeholderTextColor={colors.muted}
                    value={formData.password}
                    onChangeText={(value) => setFormData(prev => ({ ...prev, password: value }))}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => {
                      setIsPasswordFocused(true);
                      animateFocusIn(passwordScaleAnim);
                    }}
                    onBlur={() => {
                      setIsPasswordFocused(false);
                      animateFocusOut(passwordScaleAnim);
                    }}
                    returnKeyType="go"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color={colors.muted} 
                    />
                  </TouchableOpacity>
                </View>
                </Animated.View>
                {errors.password && (
                  <Text style={[getVariantStyle('caption'), styles.errorText]}>{errors.password}</Text>
                )}
              </View>

              {/* Opción Recordarme */}
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[
                  styles.checkbox, 
                  rememberMe && styles.checkboxChecked
                ]}>
                  {rememberMe && <Ionicons name="checkmark" size={10} color="#fff" />}
                </View>
                <Text style={[getVariantStyle('body'), styles.rememberMeText]}>Mantener sesión iniciada</Text>
              </TouchableOpacity>

              {/* Botón de login muy sutil */}
              <AnimatedTouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled
                , { transform: [{ scale: loginButtonScaleAnim }] }
                ]}
                onPress={handleLogin}
                onPressIn={handleLoginButtonPressIn}
                onPressOut={handleLoginButtonPressOut}
                disabled={isLoading}
              >
                <View style={styles.loginButtonContent}>
                  {isLoading ? (
                    <Text style={[getVariantStyle('body'), styles.loginButtonText, styles.boldText]}>Iniciando sesión...</Text>
                  ) : (
                    <Text style={[getVariantStyle('body'), styles.loginButtonText, styles.boldText]}>
                      Iniciar sesión
                    </Text>
                  )}
              </View>
              </AnimatedTouchableOpacity>

              {/* Enlace recuperar contraseña */}
              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={handleForgotPassword}
              >
                <Text style={[getVariantStyle('body'), styles.forgotPasswordText]}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={[getVariantStyle('body'), styles.footerText]}>¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={[getVariantStyle('body'), styles.linkText, styles.boldText]}>Regístrate</Text>
                </TouchableOpacity>
              </View>
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
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  blobTop: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    top: -width * 0.4,
    left: -width * 0.3,
    backgroundColor: 'rgba(210, 180, 254, 0.08)',
  },
  blobCenter: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    top: height * 0.18,
    alignSelf: 'center',
    backgroundColor: 'rgba(230, 213, 255, 0.06)',
  },
  blobBottom: {
    position: 'absolute',
    width: width * 1.4,
    height: width * 1.4,
    borderRadius: (width * 1.4) / 2,
    bottom: -width * 0.6,
    right: -width * 0.4,
    backgroundColor: 'rgba(230, 213, 255, 0.06)',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 36,
  },
  logoImage: {
    width: 72,
    height: 72,
    marginBottom: 28,
  },
  appName: {
    marginBottom: 6,
  },
  tagline: {
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  formCard: {
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },
  inputFocused: {
    borderColor: colors.primary600,
    backgroundColor: colors.surface,
    shadowColor: colors.primary600,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: '#fef2f2',
  },
  animatedInputWrapper: {
    borderRadius: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 12,
    paddingVertical: 0,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  errorText: {
    color: colors.error,
    marginTop: 6,
    marginLeft: 4,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary600,
    borderColor: colors.primary600,
  },
  rememberMeText: {
    color: colors.textSecondary,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
  },
  linkText: {
    color: colors.primary600,
    fontWeight: '600',
  },
  simpleInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.textPrimary,
    minHeight: 56,
  },
  basicInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 56,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    minHeight: 56,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  boldText: {
    fontWeight: '600',
  },
});
