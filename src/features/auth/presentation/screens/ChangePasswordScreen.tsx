import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useAppDispatch } from '@shared/domain/hooks/useAppDispatch';
import { useAppSelector } from '@shared/domain/hooks/useAppSelector';
import { changePassword } from '../../domain/store/authSlice';
import { PasswordInput } from '../components/PasswordInput';
import { AuthButton } from '../components/AuthButton';
import { ModalAlert } from '../components/ModalAlert';
import { Background } from '../../../../assets';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';
import { useLanguage } from '@shared/domain/contexts/LanguageContext';

type ChangePasswordScreenNavigationProp = any;

const { width: _width, height: _height } = Dimensions.get('window');

export const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation<ChangePasswordScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { isLoading } = useAppSelector((state) => state.auth);

  // Estados del formulario
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // Estados de focus
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  // Estados de modales
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Referencias para inputs
  const newPasswordInputRef = useRef<any>(null);
  const confirmPasswordInputRef = useRef<any>(null);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleFormDataChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      newPassword: '',
      confirmPassword: '',
    };

    // Validar nueva contraseña
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = t('auth.error.newPasswordRequired') || 'La nueva contraseña es requerida';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t('auth.error.passwordMinLength') || 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = t('auth.error.confirmPasswordRequired') || 'La confirmación de contraseña es requerida';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.error.passwordsDoNotMatch') || 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(changePassword({
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      })).unwrap();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowSuccessModal(true);
      
    } catch (error: any) {
      setErrorMessage(error || 'Error al cambiar la contraseña');
      setShowErrorModal(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleBackToSettings = () => {
    navigation.goBack();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <ImageBackground source={Background} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.headerGradient}>
              <View style={styles.headerContent}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBackToSettings}
                  accessibilityRole="button"
                  accessibilityLabel="Volver"
                >
                  <Ionicons name="arrow-back" size={28} color="#efb810" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                  <Text style={[getVariantStyle('h1'), styles.title]}>Cambiar Contraseña</Text>
                  <Text style={[getVariantStyle('subtitle'), styles.subtitle]}>Actualiza tu contraseña</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Formulario */}
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
              <Text style={[getVariantStyle('h3'), styles.formTitle]}>
                Ingresa tu información
              </Text>
              
              <View style={styles.form}>
                {/* Nueva Contraseña */}
                <PasswordInput
                  placeholder="Nueva contraseña"
                  value={formData.newPassword}
                  onChangeText={(value) => handleFormDataChange('newPassword', value)}
                  error={errors.newPassword}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                  onFocus={() => setIsNewPasswordFocused(true)}
                  onBlur={() => setIsNewPasswordFocused(false)}
                  inputRef={newPasswordInputRef}
                  isFocused={isNewPasswordFocused}
                  autoComplete="new-password"
                  textContentType="newPassword"
                />

                {/* Confirmar Nueva Contraseña */}
                <PasswordInput
                  placeholder="Confirmar nueva contraseña"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleFormDataChange('confirmPassword', value)}
                  error={errors.confirmPassword}
                  returnKeyType="go"
                  onSubmitEditing={handleChangePassword}
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onBlur={() => setIsConfirmPasswordFocused(false)}
                  inputRef={confirmPasswordInputRef}
                  isFocused={isConfirmPasswordFocused}
                  autoComplete="new-password"
                  textContentType="newPassword"
                />

                {/* Botón de Cambiar Contraseña */}
                <AuthButton
                  title={isLoading ? "Cambiando..." : "Cambiar Contraseña"}
                  onPress={handleChangePassword}
                  disabled={isLoading}
                  loading={isLoading}
                  gradient="gold"
                />

                {/* Footer */}
                <View style={styles.footerContainer}>
                  <TouchableOpacity onPress={handleBackToSettings}>
                    <Text style={[getVariantStyle('body'), styles.linkText]}>
                      Volver a configuración
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal de Error */}
      <ModalAlert
        visible={showErrorModal}
        title="Error"
        message={errorMessage}
        onClose={handleErrorModalClose}
        type="error"
      />

      {/* Modal de Éxito */}
      <ModalAlert
        visible={showSuccessModal}
        title="¡Éxito!"
        message="Tu contraseña ha sido cambiada exitosamente"
        onClose={handleSuccessModalClose}
        type="success"
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  header: {
    backgroundColor: 'transparent',
    paddingTop: 20,
    paddingBottom: 4,
    paddingHorizontal: 20,
  },
  headerGradient: {
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 3,
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  subtitle: {
    color: '#ffffff',
    opacity: 0.8,
  },
  formContainer: {
    padding: 20,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  formTitle: {
    color: colors.gold,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  form: {
    width: '100%',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 8,
  },
  linkText: {
    color: colors.gold,
    fontWeight: '600',
  },
});
