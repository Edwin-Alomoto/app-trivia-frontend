import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  TextInput,
  StatusBar,
  Image,
  ImageBackground,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';
import { RootStackParamList } from '@shared/domain/types';

import { useAppDispatch } from '@shared/domain/hooks/useAppDispatch';
import { useAppSelector } from '@shared/domain/hooks/useAppSelector';
import { registerUser, verifyEmail } from '../../domain/store/authSlice';
import { featureToggles } from '@config/featureToggles';
import { useRegisterViewModel } from '../../domain/hooks/useRegisterViewModel';
import { registerStyles } from '../styles/registerStyles';
import { Background, Letter } from '../../../../assets';
import {
  RegisterForm,
  RegisterHeader,
  VerificationModal
} from '../components/register';



type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const { width: _width, height: _height } = Dimensions.get('window');

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const vm = useRegisterViewModel();
  const shouldUseVM = featureToggles.useAdvancedRegister;

  // Estados del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    address: '',
    phone: '',
    email: '',
    birthdate: '',
    gender: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    address: '',
    phone: '',
    email: '',
    birthdate: '',
    gender: '',
    password: '',
  });

  // Estados de validación
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isBirthdateFocused, setIsBirthdateFocused] = useState(false);
  const [showBirthdatePicker, setShowBirthdatePicker] = useState(false);
  const [birthdateValue, setBirthdateValue] = useState<Date | undefined>(undefined);
  const [isGenderFocused, setIsGenderFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isGenderPickerOpen, setIsGenderPickerOpen] = useState(false);

  // Referencias para animaciones
  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];
  const scaleAnim = useState(new Animated.Value(0.98))[0];

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


  const formatDateDDMMYYYY = (date: Date) => {
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getBirthdateMinMax = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    const minDate = new Date(1900, 0, 1);
    return { minDate, maxDate };
  };

  const handleOpenBirthdatePicker = () => {
    const { maxDate } = getBirthdateMinMax();
    if (!birthdateValue) {
      setBirthdateValue(maxDate);
    }
    setShowBirthdatePicker(true);
    setIsBirthdateFocused(true);
  };

  const handleBirthdateChange = (
    event: any,
    selectedDate?: Date,
  ) => {
    if (event.type === 'dismissed') {
      setShowBirthdatePicker(false);
      setIsBirthdateFocused(false);
      return;
    }
    if (selectedDate) {
      setBirthdateValue(selectedDate);
      const formatted = formatDateDDMMYYYY(selectedDate);
      updateFormData('birthdate', formatted);
    }
    if (Platform.OS === 'android') {
      setShowBirthdatePicker(false);
      setIsBirthdateFocused(false);
    }
  };



  // Timer para reenvío de verificación
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Validación de email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateBirthdate = (date: string) => {
    const match = date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return false;
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);
    const d = new Date(year, month, day);
    if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return false;
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    return d <= minDate;
  };


  // Validación del formulario
  const validateForm = () => {
    const newErrors: any = {
      firstName: '',
      lastName: '',
      username: '',
      address: '',
      phone: '',
      email: '',
      birthdate: '',
      gender: '',
      password: '',
    };

    if (!formData.firstName) {
      newErrors.firstName = 'Ingresa tu nombre.';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Ingresa tu apellido.';
    }
    if (!formData.username) {
      newErrors.username = 'Ingresa tu nombre de usuario.';
    }
    if (!formData.address) {
      newErrors.address = 'Ingresa tu dirección.';
    }
    if (!formData.phone) {
      newErrors.phone = 'Ingresa tu teléfono.';
    }
    if (!formData.email) {
      newErrors.email = 'Ingresa tu correo electrónico.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido.';
    }

    if (!formData.password) {
      newErrors.password = 'Ingresa tu contraseña.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!formData.birthdate) {
      newErrors.birthdate = 'Ingresa tu fecha de nacimiento.';
    } else if (!validateBirthdate(formData.birthdate)) {
      newErrors.birthdate = 'La fecha no es válida. Usa DD/MM/AAAA.';
    }

    if (!formData.gender) {
      newErrors.gender = 'Selecciona tu género.';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Manejar registro
  const handleRegister = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      Alert.alert(
        'Términos y Privacidad',
        'Debes aceptar los Términos y Condiciones y la Política de Privacidad para continuar'
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (shouldUseVM && vm) {
        vm.setField('email', formData.email);
        vm.setField('password', formData.password);
        vm.setField('acceptedTerms', acceptedTerms);
        vm.setField('acceptedPrivacy', acceptedPrivacy);
        const res = await vm.submit();
        if (!res.ok) throw new Error(res.error || 'Error al registrar');
        return;
      }

      await dispatch(registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        birthdate: formData.birthdate,
        gender: formData.gender,
      })).unwrap();
      // En el backend actual, no requiere verificación de email para emitir tokens.
      // Mostramos éxito y navegamos a selección de modo o tabs.
      Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada.');
      navigation.navigate('ModeSelection' as never);
      
    } catch (registerError) {
      Alert.alert(
        'Error',
        'No pudimos crear tu cuenta. Inténtalo nuevamente.'
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Manejar verificación
  const handleVerification = async () => {
    try {
      if (shouldUseVM && vm) {
        const res = await vm.verify();
        if (!res.ok) throw new Error('No verificado');
      } else {
        setShowVerificationModal(false);
        await dispatch(verifyEmail('mock_verification_token')).unwrap();
      }
      Alert.alert(
        '¡Cuenta verificada!',
        'Tu cuenta ha sido verificada exitosamente. ¡Bienvenido a WinUp!',
        [
          {
            text: '¡Empezar!',
            onPress: () => navigation.navigate('ModeSelection' as never)
          }
        ]
      );
    } catch (verificationError) {
      Alert.alert(
        'Error de verificación',
        'No se pudo verificar tu cuenta. Inténtalo de nuevo.'
      );
    }
  };

  // Reenviar verificación
  const handleResendVerification = () => {
    if (shouldUseVM && vm) {
      vm.resendVerification();
    } else {
      setResendTimer(60);
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Verificación reenviada',
      'Hemos enviado un nuevo correo de verificación a tu correo electrónico.'
    );
  };

  // Actualizar datos del formulario
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

  };


  return (
    <ImageBackground source={Background} style={{ flex: 1 }} resizeMode="cover">
    <SafeAreaView style={registerStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={registerStyles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={registerStyles.scrollContent}
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
            <View style={registerStyles.header}>
              <View style={registerStyles.logoContainer}>
                <Image 
                  source={Letter}
                  style={registerStyles.logoImage}
                  resizeMode="stretch"
                />
                <Text style={[getVariantStyle('h1'), registerStyles.title]}>
                  ¡Únete a WinUp!
                </Text>
                <Text style={[getVariantStyle('subtitle'), registerStyles.subtitle]}>
                  Regístrate y empieza a ganar
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Formulario */}
          <Animated.View
            style={[
              registerStyles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <View style={registerStyles.formCard}>
              <RegisterForm
                formData={formData}
                errors={errors}
                acceptedTerms={acceptedTerms}
                acceptedPrivacy={acceptedPrivacy}
                onFormDataChange={updateFormData}
                onTermsToggle={() => setAcceptedTerms(!acceptedTerms)}
                onPrivacyToggle={() => setAcceptedPrivacy(!acceptedPrivacy)}
                onRegister={handleRegister}
                onLoginPress={() => navigation.navigate('Login' as never)}
                isFirstNameFocused={isFirstNameFocused}
                isLastNameFocused={isLastNameFocused}
                isEmailFocused={isEmailFocused}
                isBirthdateFocused={isBirthdateFocused}
                isGenderFocused={isGenderFocused}
                isPasswordFocused={isPasswordFocused}
                onFirstNameFocus={() => setIsFirstNameFocused(true)}
                onFirstNameBlur={() => setIsFirstNameFocused(false)}
                onLastNameFocus={() => setIsLastNameFocused(true)}
                onLastNameBlur={() => setIsLastNameFocused(false)}
                onEmailFocus={() => setIsEmailFocused(true)}
                onEmailBlur={() => setIsEmailFocused(false)}
                onBirthdateFocus={() => setIsBirthdateFocused(true)}
                onBirthdateBlur={() => setIsBirthdateFocused(false)}
                onGenderFocus={() => setIsGenderFocused(true)}
                onGenderBlur={() => setIsGenderFocused(false)}
                onPasswordFocus={() => setIsPasswordFocused(true)}
                onPasswordBlur={() => setIsPasswordFocused(false)}
                showBirthdatePicker={showBirthdatePicker}
                onToggleBirthdatePicker={handleOpenBirthdatePicker}
                birthdateValue={birthdateValue}
                onBirthdateChange={handleBirthdateChange}
                minDate={getBirthdateMinMax().minDate}
                maxDate={getBirthdateMinMax().maxDate}
                isGenderPickerOpen={isGenderPickerOpen}
                onGenderToggle={() => setIsGenderPickerOpen(prev => !prev)}
                isLoading={isLoading}
                firstNameInputRef={firstNameInputRef as React.RefObject<TextInput>}
                lastNameInputRef={lastNameInputRef as React.RefObject<TextInput>}
                emailInputRef={emailInputRef as React.RefObject<TextInput>}
                passwordInputRef={passwordInputRef as React.RefObject<TextInput>}
              />
            </View>
          </Animated.View>
        </ScrollView>

        {/* Modal de Verificación de Email */}
        <VerificationModal
          visible={showVerificationModal}
          email={formData.email}
          onClose={() => setShowVerificationModal(false)}
          onVerify={handleVerification}
          onResend={handleResendVerification}
          resendTimer={resendTimer}
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
    </ImageBackground>
  );
};
