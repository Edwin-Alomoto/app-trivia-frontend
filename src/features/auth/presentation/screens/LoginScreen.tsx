import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import { colors } from '@theme/colors';
import { RootStackParamList } from '@shared/domain/types';

import { useAppDispatch } from '@shared/domain/hooks/useAppDispatch';
import { useAppSelector } from '@shared/domain/hooks/useAppSelector';
import { featureFlags } from '@config/featureFlags';

import { loginUser } from '../../domain/store/authSlice';
import { useLoginViewModel } from '../../domain/hooks/useLoginViewModel';
import { loginStyles } from '../styles/loginStyles';
import { 
  LoginForm,
  LoginHeader
} from '../components';


type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const { width: _width, height: _height } = Dimensions.get('window');

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
  const [rememberMe, setRememberMe] = useState(false);

  // Referencias para animaciones
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];
  const scaleAnim = useState(new Animated.Value(0.98))[0];

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
    <SafeAreaView style={loginStyles.container}>
      {/* Fondo con blobs orgánicos tenues */}
      <View pointerEvents="none" style={loginStyles.backgroundLayer}>
        <View style={loginStyles.blobTop} />
        <View style={loginStyles.blobCenter} />
        <View style={loginStyles.blobBottom} />
      </View>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={loginStyles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={loginStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View 
            style={[
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <LoginHeader />
          </Animated.View>

          {/* Formulario */}
          <Animated.View
            style={[
              loginStyles.formContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim }, 
                  { scale: scaleAnim }
                ],
              },
            ]}
          >
            <View style={loginStyles.formCard}>
              <LoginForm
                formData={formData}
                errors={errors}
                rememberMe={rememberMe}
                onFormDataChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                onRememberMeToggle={() => setRememberMe(!rememberMe)}
                onLogin={handleLogin}
                onForgotPassword={handleForgotPassword}
                onRegister={handleRegister}
                isEmailFocused={isEmailFocused}
                isPasswordFocused={isPasswordFocused}
                onEmailFocus={() => setIsEmailFocused(true)}
                onEmailBlur={() => setIsEmailFocused(false)}
                onPasswordFocus={() => setIsPasswordFocused(true)}
                onPasswordBlur={() => setIsPasswordFocused(false)}
                isLoading={isLoading}
                emailInputRef={emailInputRef as React.RefObject<TextInput>}
                passwordInputRef={passwordInputRef as React.RefObject<TextInput>}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};