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
  Image,
  ImageBackground,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';
import { RootStackParamList } from '@shared/domain/types';
import { useAppDispatch, useLoginAnimations } from '@shared/domain/hooks';
import { useAppSelector } from '@shared/domain/hooks/useAppSelector';
import { featureToggles } from '@config/featureToggles';
import { useLanguage } from '@shared/domain/contexts/LanguageContext';
import { ModalAlert } from '../components/ModalAlert';
import { Background, Letter } from '../../../../assets';

import { loginUser, checkAuthStatus, updateUserProfile } from '../../domain/store/authSlice';
import { fetchUserProfile } from '@features/profile/domain/store/profileSlice';
import { useLoginViewModel } from '../../domain/hooks/useLoginViewModel';
import { loginStyles } from '../styles/loginStyles';
import { 
  LoginForm
} from '../components';


type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const { width: _width, height: _height } = Dimensions.get('window');

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);

  // MVVM (desactivado por defecto)
  const vm = useLoginViewModel();
  const shouldUseVM = featureToggles.useAdvancedLogin;

  // Estados del formulario
  const [formData, setFormData] = useState({
    email: 'usuario888@ejemplo.com',
    password: 'nuevaPassword123!',
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

  // Animaciones globales
  const { animationValues } = useLoginAnimations();

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [modal, setModal] = useState<{ visible: boolean; title: string; message: string }>(
    { visible: false, title: '', message: '' }
  );

  // Las animaciones se ejecutan automáticamente con useLoginAnimations


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
      newErrors.email = t('auth.error.emailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('auth.error.invalidEmail');
    }

    if (!formData.password) {
      newErrors.password = t('auth.error.passwordRequired');
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Manejar login
  const handleLogin = async () => {
    if (!featureToggles.useLoginBypass) {
      if (!validateForm()) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
    }

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Bypass temporal de login sin API
      if (featureToggles.useLoginBypass) {
        const nowIso = new Date().toISOString();
        const mockedAccess = 'dev-access-token';
        const mockedRefresh = 'dev-refresh-token';
        const mockedUser = {
          id: 'dev-user-id',
          email: formData.email || 'dev@example.com',
          name: 'Dev User',
          alias: 'devuser',
          points: 0,
          createdAt: nowIso,
          preferences: { notifications: true, language: 'es', sound: true, haptics: true },
          subscriptionStatus: 'not_subscribed',
        } as any;

        await SecureStore.setItemAsync('auth_access_token', mockedAccess);
        await SecureStore.setItemAsync('auth_refresh_token', mockedRefresh);
        await SecureStore.setItemAsync('user_data', JSON.stringify(mockedUser));

        const state = await dispatch(checkAuthStatus()).unwrap();
        if (state?.user?.subscriptionStatus === 'not_subscribed') {
          navigation.navigate('ModeSelection' as never);
        } else {
          navigation.navigate('MainTabs' as never);
        }
        return;
      }

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

      // Verificar perfil del usuario para decidir navegación inmediata
      try {
        const profile = await dispatch(fetchUserProfile()).unwrap();
        const userType = String(profile?.user_type || '').toUpperCase();
        
        // Sincronizar estado de suscripción con el perfil
        const subscriptionStatus = userType === 'PREMIUM' ? 'subscribed' : 
                                 userType === 'DEMO' ? 'demo' : 'not_subscribed';
        dispatch(updateUserProfile({ subscriptionStatus } as any));
        
        // Guardar user_type en SecureStore
        await SecureStore.setItemAsync('user_type', userType);
        
        // Navegar según el tipo de usuario
        if (userType === 'DEMO' || userType === 'PREMIUM') {
          navigation.navigate('MainTabs' as never);
        } else {
          navigation.navigate('ModeSelection' as never);
        }
      } catch (error) {
        console.warn('Error al obtener perfil del usuario:', error);
        // Si falla la consulta del perfil, usar el estado local
        if (result.user.subscriptionStatus === 'not_subscribed') {
          navigation.navigate('ModeSelection' as never);
        } else {
          navigation.navigate('MainTabs' as never);
        }
      }
      
    } catch (loginError: any) {
      console.error('Error en login:', loginError);
      
      // Determinar tipo de error y mensaje específico
      let errorTitle = t('auth.error.loginFailed');
      let errorMessage = t('auth.error.invalidCredentials');
      
      if (loginError?.message) {
        if (loginError.message.includes('Network')) {
          errorTitle = 'Error de conexión';
          errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
        } else if (loginError.message.includes('timeout')) {
          errorTitle = 'Tiempo de espera agotado';
          errorMessage = 'El servidor tardó demasiado en responder. Inténtalo de nuevo.';
        } else if (loginError.message.includes('401') || loginError.message.includes('credenciales')) {
          errorTitle = t('auth.error.invalidCredentials');
          errorMessage = 'Email o contraseña incorrectos. Verifica tus datos.';
        } else if (loginError.message.includes('500')) {
          errorTitle = 'Error del servidor';
          errorMessage = 'Ocurrió un error interno. Inténtalo más tarde.';
        } else {
          errorMessage = loginError.message;
        }
      }
      
      setModal({
        visible: true,
        title: errorTitle,
        message: errorMessage,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Manejar recuperación de contraseña
  const handleForgotPassword = () => {
    if (!formData.email) {
      setModal({ visible: true, title: 'Email requerido', message: 'Ingresa tu email para recuperar tu contraseña.' });
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setModal({ visible: true, title: 'Email inválido', message: 'Ingresa un email válido.' });
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

  // Limpiar errores de Redux cuando se actualiza el formulario
  useEffect(() => {
    if (authError) {
      dispatch(clearError());
    }
  }, [formData.email, formData.password, dispatch, authError]);

  return (
    <ImageBackground source={Background} style={{ flex: 1 }} resizeMode="cover">
      <ModalAlert
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ visible: false, title: '', message: '' })}
      />
    <SafeAreaView style={loginStyles.container}>
      {/* Fondo con blobs removido para usar solo la imagen de fondo */}
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
                opacity: animationValues.fadeAnim,
                transform: [{ translateY: animationValues.slideAnim }],
              },
            ]}
          >
            <View style={loginStyles.header}>
              <View style={loginStyles.logoContainer}>
                <Image 
                  source={Letter}
                  style={loginStyles.logoImage}
                  resizeMode="stretch"
                />
                <Text style={[getVariantStyle('h1'), loginStyles.title]}>
                  {t('auth.login')}
                </Text>
                <Text style={[getVariantStyle('subtitle'), loginStyles.subtitle]}>
                  Acumula puntos y gana premios.
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Formulario */}
          <Animated.View
            style={[
              loginStyles.formContainer,
              {
                opacity: animationValues.fadeAnim,
                transform: [
                  { translateY: animationValues.slideAnim }, 
                  { scale: animationValues.scaleAnim }
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
    </ImageBackground>
  );
};