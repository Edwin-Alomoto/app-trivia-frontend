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

import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { resetPassword } from '../../domain/store/authSlice';
import LoginHeader from '../components/LoginHeader';
import PasswordInput from '../components/PasswordInput';
import AuthFooter from '../components/AuthFooter';
import DecorativeBlobs from '../components/DecorativeBlobs';
import EntryAnimator from '../../../../shared/presentation/animations/EntryAnimator';
import { forgotPasswordScreenStyles } from './styles/ForgotPasswordScreen.styles';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type ResetPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ResetPassword'>;
type ResetPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const route = useRoute<ResetPasswordScreenRouteProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];
  const scaleAnim = useState(new Animated.Value(0.98))[0];
  const newPasswordScaleAnim = useRef(new Animated.Value(1)).current;
  const confirmPasswordScaleAnim = useRef(new Animated.Value(1)).current;
  const resetButtonScaleAnim = useRef(new Animated.Value(1)).current;

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
    Animated.spring(resetButtonScaleAnim, {
      toValue: 0.98,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(resetButtonScaleAnim, {
      toValue: 1,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula';
    }
    if (!/\d/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    return '';
  };

  const handleResetPassword = async () => {
    // Validar nueva contraseña
    const passwordValidation = validatePassword(newPassword);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    // Validar confirmación
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      return;
    }

    // Limpiar errores
    setPasswordError('');
    setConfirmPasswordError('');

    try {
      console.log('🟣 [ResetPasswordScreen] Enviando restablecimiento con token:', route.params?.token);
      await dispatch(resetPassword({
        token: route.params?.token || '',
        newPassword,
        confirmPassword,
      })).unwrap();
      console.log('🟢 [ResetPasswordScreen] Restablecimiento exitoso');
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsPasswordReset(true);
      
    } catch (error) {
      console.log('🔴 [ResetPasswordScreen] Error:', error);
      Alert.alert('Error', error as string || 'No se pudo restablecer la contraseña. Inténtalo de nuevo.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login' as never);
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
          {/* Header con animación */}
          <EntryAnimator style={forgotPasswordScreenStyles.header}>
            <LoginHeader
              title="Nueva contraseña"
              subtitle="Ingresa tu nueva contraseña"
              logoSource={require('../../../../../assets/adaptive-icon.png')}
              containerStyle={forgotPasswordScreenStyles.logoContainer}
              logoStyle={forgotPasswordScreenStyles.logoImage as any}
            />
          </EntryAnimator>

          {/* Formulario con animación */}
          <EntryAnimator style={forgotPasswordScreenStyles.formContainer}>
            <View style={forgotPasswordScreenStyles.formCard}>
              {!isPasswordReset ? (
                <>
                  <View style={forgotPasswordScreenStyles.inputContainer}>
                    <Animated.View style={[forgotPasswordScreenStyles.animatedInputWrapper, { transform: [{ scale: newPasswordScaleAnim }] }]}>
                      <PasswordInput
                        placeholder="Nueva contraseña"
                        value={newPassword}
                        onChangeText={(value) => {
                          setNewPassword(value);
                          if (passwordError) setPasswordError('');
                        }}
                        onFocus={() => animateFocusIn(newPasswordScaleAnim)}
                        onBlur={() => animateFocusOut(newPasswordScaleAnim)}
                        returnKeyType="next"
                        error={passwordError}
                        style={getVariantStyle('body')}
                      />
                    </Animated.View>
                  </View>

                  <View style={forgotPasswordScreenStyles.inputContainer}>
                    <Animated.View style={[forgotPasswordScreenStyles.animatedInputWrapper, { transform: [{ scale: confirmPasswordScaleAnim }] }]}>
                      <PasswordInput
                        placeholder="Confirmar nueva contraseña"
                        value={confirmPassword}
                        onChangeText={(value) => {
                          setConfirmPassword(value);
                          if (confirmPasswordError) setConfirmPasswordError('');
                        }}
                        onFocus={() => animateFocusIn(confirmPasswordScaleAnim)}
                        onBlur={() => animateFocusOut(confirmPasswordScaleAnim)}
                        returnKeyType="done"
                        onSubmitEditing={handleResetPassword}
                        error={confirmPasswordError}
                        style={getVariantStyle('body')}
                      />
                    </Animated.View>
                  </View>

                  <AnimatedTouchableOpacity
                    style={[forgotPasswordScreenStyles.loginButton, isLoading && forgotPasswordScreenStyles.loginButtonDisabled, { transform: [{ scale: resetButtonScaleAnim }] }]}
                    onPress={handleResetPassword}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                    disabled={isLoading}
                  >
                    <View style={forgotPasswordScreenStyles.loginButtonContent}>
                      <Text style={[getVariantStyle('body'), forgotPasswordScreenStyles.loginButtonText, forgotPasswordScreenStyles.boldText]}>
                        {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
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
                    <Text style={[getVariantStyle('h2'), forgotPasswordScreenStyles.successTitle]}>¡Contraseña restablecida!</Text>
                    <Text style={[getVariantStyle('body'), forgotPasswordScreenStyles.successSubtitle]}>
                      Tu contraseña ha sido restablecida exitosamente.
                    </Text>
                    <Text style={[getVariantStyle('body'), forgotPasswordScreenStyles.successInstructions]}>
                      Ahora puedes iniciar sesión con tu nueva contraseña.
                    </Text>
                  </View>

                  <AnimatedTouchableOpacity
                    style={[forgotPasswordScreenStyles.loginButton, { transform: [{ scale: resetButtonScaleAnim }] }]}
                    onPress={handleBackToLogin}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                  >
                    <View style={forgotPasswordScreenStyles.loginButtonContent}>
                      <Text style={[getVariantStyle('body'), forgotPasswordScreenStyles.loginButtonText, forgotPasswordScreenStyles.boldText]}>Ir al inicio de sesión</Text>
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
