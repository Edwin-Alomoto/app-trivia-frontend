import React, { useState, useRef } from 'react';
import {View,Text,ScrollView,KeyboardAvoidingView,Platform,TouchableOpacity,TextInput,StatusBar,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';
import { RootStackParamList } from '@shared/domain/types';

import EntryAnimator from '../../../../shared/presentation/animations/EntryAnimator';
import AnimatedButton from '../components/AnimatedButton';
import DecorativeBlobs from '../components/DecorativeBlobs';
import { loginUser } from '../../domain/store/authSlice';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { featureFlags } from '../../../../config/featureFlags';
import { useLoginViewModel } from '../../domain/hooks/useLoginViewModel';
import { loginScreenStyles } from './styles/LoginScreen.styles';
import ErrorModal from '../../../../shared/presentation/components/ui/ErrorModal';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

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
  const [errorModal, setErrorModal] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const [forgotPasswordModal, setForgotPasswordModal] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });

  // Referencias para inputs
  const passwordInputRef = useRef<TextInput>(null);

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
        if (!res.ok) throw new Error(res.error || 'Credenciales inválidas');
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
      setErrorModal({ visible: true, message: loginError?.message || 'Credenciales inválidas' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Manejar recuperación de contraseña
  const handleForgotPassword = () => {
    if (!formData.email) {
      setForgotPasswordModal({ 
        visible: true, 
        message: 'Ingresa tu email para recuperar tu contraseña.' 
      });
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setForgotPasswordModal({ 
        visible: true, 
        message: 'Ingresa un email válido para continuar.' 
      });
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
    <>
    <SafeAreaView style={loginScreenStyles.container}>
      {/* Fondo con blobs orgánicos tenues */}
      <DecorativeBlobs variant="auth" style={loginScreenStyles.backgroundLayer} />
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={loginScreenStyles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={loginScreenStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header muy sutil */}
          <EntryAnimator style={loginScreenStyles.header}>
            <View style={loginScreenStyles.logoContainer}>
              <Image 
                source={require('../../../../../assets/adaptive-icon.png')}
                style={loginScreenStyles.logoImage}
                resizeMode="contain"
              />
              <Text style={[getVariantStyle('h1'), { color: colors.textPrimary }]}>¡Bienvenido a WinUp!</Text>
              <Text style={[getVariantStyle('subtitle'), { color: colors.textSecondary }]}>Acumula puntos y gana premios.</Text>
            </View>
          </EntryAnimator>

          {/* Formulario muy sutil */}
          <EntryAnimator style={loginScreenStyles.formContainer}>
            <View style={loginScreenStyles.formCard}>
              {/* Campo Email (diseño básico) */}
              <View style={loginScreenStyles.inputContainer}>
                <TextInput
                  style={loginScreenStyles.basicInput}
                  placeholder="Correo electrónico"
                  placeholderTextColor={colors.muted}
                  value={formData.email}
                  onChangeText={(value) => _updateFormData('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  blurOnSubmit={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
                {errors.email && (
                  <Text style={[getVariantStyle('caption'), loginScreenStyles.errorText]}>{errors.email}</Text>
                )}
              </View>

              {/* Campo Contraseña (diseño básico con toggle) */}
              <View style={loginScreenStyles.inputContainer}>
                <View style={loginScreenStyles.passwordContainer}>
                  <TextInput
                    style={loginScreenStyles.passwordInput}
                    placeholder="Contraseña"
                    placeholderTextColor={colors.muted}
                    value={formData.password}
                    onChangeText={(value) => _updateFormData('password', value)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    ref={passwordInputRef}
                    returnKeyType="go"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={loginScreenStyles.eyeButton}
                  >
                    <Ionicons 
                      name={showPassword ? 'eye-off' : 'eye'} 
                      size={20} 
                      color={colors.muted} 
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={[getVariantStyle('caption'), loginScreenStyles.errorText]}>{errors.password}</Text>
                )}
              </View>

              {/* Opción Recordarme */}
              <TouchableOpacity
                style={loginScreenStyles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[
                  loginScreenStyles.checkbox, 
                  rememberMe && loginScreenStyles.checkboxChecked
                ]}>
                  {rememberMe && <Ionicons name="checkmark" size={10} color="#fff" />}
                </View>
                <Text style={[getVariantStyle('body'), loginScreenStyles.rememberMeText]}>Mantener sesión iniciada</Text>
              </TouchableOpacity>

              {/* Botón de login muy sutil */}
              <AnimatedButton
                style={[loginScreenStyles.loginButton, isLoading && loginScreenStyles.loginButtonDisabled]}
                onPress={handleLogin}
                isLoading={isLoading}
              >
                <View style={loginScreenStyles.loginButtonContent}>
                  {isLoading ? (
                    <Text style={[getVariantStyle('body'), loginScreenStyles.loginButtonText, loginScreenStyles.boldText]}>Iniciando sesión...</Text>
                  ) : (
                    <Text style={[getVariantStyle('body'), loginScreenStyles.loginButtonText, loginScreenStyles.boldText]}>
                      Iniciar sesión
                    </Text>
                  )}
                </View>
              </AnimatedButton>

              {/* Enlace recuperar contraseña */}
              <TouchableOpacity
                style={loginScreenStyles.forgotPasswordContainer}
                onPress={handleForgotPassword}
              >
                <Text style={[getVariantStyle('body'), loginScreenStyles.forgotPasswordText]}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <View style={loginScreenStyles.footer}>
                <Text style={[getVariantStyle('body'), loginScreenStyles.footerText]}>¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={[getVariantStyle('body'), loginScreenStyles.linkText, loginScreenStyles.boldText]}>Regístrate</Text>
                </TouchableOpacity>
              </View>
            </View>
        </EntryAnimator>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    <ErrorModal
      visible={errorModal.visible}
      title="No pudimos iniciar sesión"
      message={errorModal.message}
      onClose={() => setErrorModal({ visible: false, message: '' })}
      primaryActionLabel="Entendido"
    />
    <ErrorModal
      visible={forgotPasswordModal.visible}
      title="Correo requerido"
      message={forgotPasswordModal.message}
      onClose={() => setForgotPasswordModal({ visible: false, message: '' })}
      primaryActionLabel="Entendido"
    />
    </>
  );
};

