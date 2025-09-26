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
  Modal,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';
import { RootStackParamList } from '@shared/domain/types';

import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { registerUser, verifyEmail } from '../../domain/store/authSlice';
import { featureFlags } from '../../../../config/featureFlags';
import { useRegisterViewModel } from '../../domain/hooks/useRegisterViewModel';
import { registerScreenStyles } from './styles/RegisterScreen.styles';
import ErrorModal from '../../../../shared/presentation/components/ui/ErrorModal';
import { SuccessModal } from '../../../../shared/presentation/components/ui/SuccessModal';
import FormTextInput from '../components/FormTextInput';
import PasswordInput from '../components/PasswordInput';
import InlineDropdown from '../components/InlineDropdown';
import DatePickerField from '../components/DatePickerField';
import StrengthMeter from '../components/StrengthMeter';
import AuthFooter from '../components/AuthFooter';
import LoginHeader from '../components/LoginHeader';
import DecorativeBlobs from '../components/DecorativeBlobs';
import EntryAnimator from '../../../../shared/presentation/animations/EntryAnimator';
import FocusScaleView from '../../../../shared/presentation/animations/FocusScaleView';



// @ts-ignore - tipos del datepicker no requeridos en tiempo de compilación
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const vm = useRegisterViewModel();
  const shouldUseVM = featureFlags.useMVVMRegister;

  // Estados del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    gender: '',
    address: '',
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    gender: '',
    address: '',
    phone: '',
    password: '',
  });

  // Estados de validación
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [errorModal, setErrorModal] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const [successModal, setSuccessModal] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  // Visibilidad de password manejada dentro de PasswordInput
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [_isFirstNameFocused, _setIsFirstNameFocused] = useState(false);
  const [_isLastNameFocused, _setIsLastNameFocused] = useState(false);
  const [_isEmailFocused, _setIsEmailFocused] = useState(false);
  // Estado del DatePicker manejado dentro de DatePickerField
  const [_isGenderFocused, _setIsGenderFocused] = useState(false);
  const [_isPasswordFocused, _setIsPasswordFocused] = useState(false);
  const [_isGenderPickerOpen, _setIsGenderPickerOpen] = useState(false);

  // Referencias para animaciones
  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const _birthdateInputRef = useRef<TextInput>(null);
  const addressInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];
  const scaleAnim = useState(new Animated.Value(0.98))[0];
  const strengthAnim = useState(new Animated.Value(0))[0];
  const firstNameScaleAnim = useRef(new Animated.Value(1)).current;
  const lastNameScaleAnim = useRef(new Animated.Value(1)).current;
  const emailScaleAnim = useRef(new Animated.Value(1)).current;
  const _birthdateScaleAnim = useRef(new Animated.Value(1)).current; // focus visual (no requerido ahora)
  const genderScaleAnim = useRef(new Animated.Value(1)).current;
  const addressScaleAnim = useRef(new Animated.Value(1)).current;
  const phoneScaleAnim = useRef(new Animated.Value(1)).current;
  const passwordScaleAnim = useRef(new Animated.Value(1)).current;
  const registerButtonScaleAnim = useRef(new Animated.Value(1)).current;

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

  // formato de fecha manejado por DatePickerField

  const getBirthdateMinMax = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    const minDate = new Date(1900, 0, 1);
    return { minDate, maxDate };
  };

  // apertura del datepicker manejada por DatePickerField

  const handleRegisterPressIn = () => {
    if (isLoading || !acceptedTerms || !acceptedPrivacy) return;
    Animated.spring(registerButtonScaleAnim, {
      toValue: 0.98,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleRegisterPressOut = () => {
    Animated.spring(registerButtonScaleAnim, {
      toValue: 1,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  // Animación del indicador de fortaleza cuando aparece
  useEffect(() => {
    if (formData.password.length > 0) {
      Animated.timing(strengthAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(strengthAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [formData.password.length, strengthAnim]);

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

  // Validación de fortaleza de contraseña
  const validatePasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach(check => {
      if (check) strength += 20;
    });

    setPasswordStrength(strength);
    return strength >= 60; // Mínimo 3 criterios cumplidos
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      birthdate: '',
      gender: '',
      address: '',
      phone: '',
      password: '',
    };

    if (!formData.firstName) {
      newErrors.firstName = 'Ingresa tu nombre.';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Ingresa tu apellido.';
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
    } else if (!validatePasswordStrength(formData.password)) {
      newErrors.password = 'La contraseña no cumple con los requisitos de seguridad.';
    }

    if (!formData.birthdate) {
      newErrors.birthdate = 'Ingresa tu fecha de nacimiento.';
    } else if (!validateBirthdate(formData.birthdate)) {
      newErrors.birthdate = 'La fecha no es válida. Usa DD/MM/AAAA.';
    }

    if (!formData.gender) {
      newErrors.gender = 'Selecciona tu género.';
    }

    if (!formData.address) {
      newErrors.address = 'Ingresa tu dirección.';
    }

    if (!formData.phone) {
      newErrors.phone = 'Ingresa tu número de teléfono.';
    } else if (!/^\d{8,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'El teléfono debe tener entre 8 y 15 dígitos.';
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

      // Mapear formData al payload esperado por la API
      const registerPayload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        username: formData.email.split('@')[0], // Usar parte del email como username temporal
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        birth_date: formData.birthdate.split('/').reverse().join('-'), // Convertir DD/MM/AAAA a YYYY-MM-DD
        gender: formData.gender,
        status: 'ACTIVE',
      };

      console.log('🟣 [RegisterScreen] Enviando registro con payload:', JSON.stringify(registerPayload, null, 2));
      await dispatch(registerUser(registerPayload)).unwrap();
      console.log('🟣 [RegisterScreen] Registro exitoso, mostrando modal de éxito...');
      // Mostrar modal de éxito en lugar de navegar directamente
      setSuccessModal({ 
        visible: true, 
        message: 'Revisa tu correo electrónico para verificar tu cuenta antes de iniciar sesión.' 
      });
      
    } catch (registerError) {
      setErrorModal({ visible: true, message: (registerError as any)?.message || 'No pudimos crear tu cuenta. Inténtalo nuevamente.' });
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

    if (field === 'password') {
      validatePasswordStrength(value);
    }
  };

  // StrengthMeter se encarga de color y texto

  return (
    <SafeAreaView style={registerScreenStyles.container}>
      {/* Fondo con blobs orgánicos tenues */}
      <DecorativeBlobs variant="auth" style={registerScreenStyles.backgroundLayer} />
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={registerScreenStyles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={registerScreenStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header muy sutil */}
          <EntryAnimator
            style={[
              registerScreenStyles.header,
            ]}
          >
            <LoginHeader
              title="¡Únete a WinUp!"
              subtitle="Regístrate y empieza a ganar"
              containerStyle={registerScreenStyles.logoContainer}
            />
          </EntryAnimator>

          {/* Formulario muy sutil */}
          <EntryAnimator
            style={[
              registerScreenStyles.formContainer,
            ]}
          >
            <View style={registerScreenStyles.formCard}>
              {/* Campo Nombre */}
              <View style={registerScreenStyles.inputContainer}>
                <FocusScaleView style={[registerScreenStyles.animatedInputWrapper] as any}> 
                  <FormTextInput
                    ref={firstNameInputRef}
                    placeholder="Nombre"
                    value={formData.firstName}
                    onChangeText={(value) => updateFormData('firstName', value)}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onFocus={() => { animateFocusIn(firstNameScaleAnim); }}
                    onBlur={() => { animateFocusOut(firstNameScaleAnim); }}
                    onSubmitEditing={() => lastNameInputRef.current?.focus()}
                    error={errors.firstName}
                  />
                </FocusScaleView>
              </View>

              {/* Campo Apellido */}
              <View style={registerScreenStyles.inputContainer}>
                <FocusScaleView style={[registerScreenStyles.animatedInputWrapper] as any}> 
                  <FormTextInput
                    ref={lastNameInputRef}
                    placeholder="Apellido"
                    value={formData.lastName}
                    onChangeText={(value) => updateFormData('lastName', value)}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onFocus={() => { animateFocusIn(lastNameScaleAnim); }}
                    onBlur={() => { animateFocusOut(lastNameScaleAnim); }}
                    onSubmitEditing={() => emailInputRef.current?.focus()}
                    error={errors.lastName}
                  />
                </FocusScaleView>
              </View>

              {/* Campo Email */}
              <View style={registerScreenStyles.inputContainer}>
                <FocusScaleView style={[registerScreenStyles.animatedInputWrapper] as any}> 
                <FormTextInput
                  ref={emailInputRef}
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => { animateFocusIn(emailScaleAnim); }}
                  onBlur={() => { animateFocusOut(emailScaleAnim); }}
                  blurOnSubmit={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  error={errors.email}
                />
                </FocusScaleView>
              </View>

              {/* Campo Fecha de nacimiento (DatePicker nativo) */}
              <View style={registerScreenStyles.inputContainer}>
                <FocusScaleView style={[registerScreenStyles.animatedInputWrapper] as any}> 
                  <DatePickerField
                    value={formData.birthdate}
                    onChange={(formatted, _date) => {
                      updateFormData('birthdate', formatted);
                    }}
                    placeholder="Fecha de nacimiento (DD/MM/AAAA)"
                    minDate={getBirthdateMinMax().minDate}
                    maxDate={getBirthdateMinMax().maxDate}
                    containerStyle={[registerScreenStyles.pickerContainer] as any}
                  />
                </FocusScaleView>
                {errors.birthdate && (
                  <Text style={[getVariantStyle('caption'), registerScreenStyles.errorText]}>{errors.birthdate}</Text>
                )}
              </View>

              {/* Campo Género (Dropdown inline) */}
              <View style={registerScreenStyles.inputContainer}>
                <FocusScaleView style={[registerScreenStyles.animatedInputWrapper] as any}> 
                  <InlineDropdown
                    value={formData.gender}
                    onSelect={(option) => {
                      updateFormData('gender', option);
                      animateFocusOut(genderScaleAnim);
                    }}
                    options={['Femenino', 'Masculino', 'Otro', 'Prefiero no decirlo']}
                    placeholder="Selecciona tu género"
                    containerStyle={[registerScreenStyles.pickerContainer] as any}
                  />
                </FocusScaleView>
                {errors.gender && (
                  <Text style={[getVariantStyle('caption'), registerScreenStyles.errorText]}>{errors.gender}</Text>
                )}
              </View>

              {/* Campo Dirección */}
              <View style={registerScreenStyles.inputContainer}>
                <FocusScaleView style={[registerScreenStyles.animatedInputWrapper] as any}> 
                  <FormTextInput
                    ref={addressInputRef}
                    placeholder="Dirección"
                    value={formData.address}
                    onChangeText={(value) => updateFormData('address', value)}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onFocus={() => { animateFocusIn(addressScaleAnim); }}
                    onBlur={() => { animateFocusOut(addressScaleAnim); }}
                    onSubmitEditing={() => phoneInputRef.current?.focus()}
                    error={errors.address}
                  />
                </FocusScaleView>
              </View>

              {/* Campo Teléfono */}
              <View style={registerScreenStyles.inputContainer}>
                <FocusScaleView style={[registerScreenStyles.animatedInputWrapper] as any}> 
                  <FormTextInput
                    ref={phoneInputRef}
                    placeholder="Teléfono"
                    value={formData.phone}
                    onChangeText={(value) => updateFormData('phone', value)}
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    onFocus={() => { animateFocusIn(phoneScaleAnim); }}
                    onBlur={() => { animateFocusOut(phoneScaleAnim); }}
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    error={errors.phone}
                  />
                </FocusScaleView>
              </View>

              {/* Campo Contraseña */}
              <View style={registerScreenStyles.inputContainer}>
                <FocusScaleView style={[registerScreenStyles.animatedInputWrapper] as any}> 
                  <PasswordInput
                    ref={passwordInputRef}
                    placeholder="Contraseña"
                    value={formData.password}
                    onChangeText={(value) => updateFormData('password', value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => { animateFocusIn(passwordScaleAnim); }}
                    onBlur={() => { animateFocusOut(passwordScaleAnim); }}
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                    error={errors.password}
                    style={getVariantStyle('body')}
                  />
                </FocusScaleView>

                {/* Indicador de fortaleza de contraseña */}
                {formData.password.length > 0 && (
                  <Animated.View style={[registerScreenStyles.strengthContainer, { opacity: strengthAnim }]}>
                    <StrengthMeter strength={passwordStrength} />
                  </Animated.View>
                )}

                {/* Requisitos de contraseña */}
                {formData.password.length > 0 && (
                  <View style={registerScreenStyles.requirementsContainer}>
                    <Text style={[getVariantStyle('body'), registerScreenStyles.requirementsTitle]}>Tu contraseña debe incluir:</Text>
                    <View style={registerScreenStyles.requirementItem}>
                      <Ionicons
                        name={formData.password.length >= 8 ? "checkmark-circle" : "ellipse-outline"}
                        size={14}
                        color={formData.password.length >= 8 ? "#10B981" : "#94a3b8"}
                      />
                      <Text style={[getVariantStyle('body'), registerScreenStyles.requirementText]}>Al menos 8 caracteres</Text>
                    </View>
                    <View style={registerScreenStyles.requirementItem}>
                      <Ionicons
                        name={/[a-z]/.test(formData.password) ? "checkmark-circle" : "ellipse-outline"}
                        size={14}
                        color={/[a-z]/.test(formData.password) ? "#10B981" : "#94a3b8"}
                      />
                      <Text style={[getVariantStyle('body'), registerScreenStyles.requirementText]}>Al menos una letra minúscula</Text>
                    </View>
                    <View style={registerScreenStyles.requirementItem}>
                      <Ionicons
                        name={/[A-Z]/.test(formData.password) ? "checkmark-circle" : "ellipse-outline"}
                        size={14}
                        color={/[A-Z]/.test(formData.password) ? "#10B981" : "#94a3b8"}
                      />
                      <Text style={[getVariantStyle('body'), registerScreenStyles.requirementText]}>Al menos una letra mayúscula</Text>
                    </View>
                    <View style={registerScreenStyles.requirementItem}>
                      <Ionicons
                        name={/\d/.test(formData.password) ? "checkmark-circle" : "ellipse-outline"}
                        size={14}
                        color={/\d/.test(formData.password) ? "#10B981" : "#94a3b8"}
                      />
                      <Text style={[getVariantStyle('body'), registerScreenStyles.requirementText]}>Al menos un número</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Términos y Privacidad */}
              <View style={registerScreenStyles.termsContainer}>
                <TouchableOpacity
                  style={registerScreenStyles.checkboxContainer}
                  onPress={() => setAcceptedTerms(!acceptedTerms)}
                >
                  <View style={[registerScreenStyles.checkbox, acceptedTerms && registerScreenStyles.checkboxChecked]}>
                    {acceptedTerms && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                  <Text style={[getVariantStyle('body'), registerScreenStyles.termsText]}>
                    Acepto los{' '}
                    <Text style={[getVariantStyle('body'), registerScreenStyles.termsLink]}>Términos y Condiciones</Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={registerScreenStyles.checkboxContainer}
                  onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
                >
                  <View style={[registerScreenStyles.checkbox, acceptedPrivacy && registerScreenStyles.checkboxChecked]}>
                    {acceptedPrivacy && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                  <Text style={[getVariantStyle('body'), registerScreenStyles.termsText]}>
                    Acepto la{' '}
                    <Text style={[getVariantStyle('body'), registerScreenStyles.termsLink]}>Política de Privacidad</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Botón de registro */}
              <AnimatedTouchableOpacity
                style={[
                  registerScreenStyles.registerButton,
                  (!acceptedTerms || !acceptedPrivacy) && registerScreenStyles.registerButtonDisabled,
                  { transform: [{ scale: registerButtonScaleAnim }] }
                ]}
                onPress={handleRegister}
                onPressIn={handleRegisterPressIn}
                onPressOut={handleRegisterPressOut}
                disabled={!acceptedTerms || !acceptedPrivacy || isLoading}
              >
                <View style={registerScreenStyles.registerButtonContent}>
                  {isLoading ? (
                    <Text style={[getVariantStyle('body'), registerScreenStyles.registerButtonText, registerScreenStyles.boldText]}>Creando cuenta...</Text>
                  ) : (
                    <Text style={[getVariantStyle('body'), registerScreenStyles.registerButtonText, registerScreenStyles.boldText]}>Crear cuenta</Text>
                  )}
                </View>
              </AnimatedTouchableOpacity>

              {/* Footer */}
              <AuthFooter
                questionText="¿Ya tienes cuenta?"
                actionText="Iniciar sesión"
                onPress={() => navigation.navigate('Login' as never)}
                style={registerScreenStyles.footer}
              />
            </View>
          </EntryAnimator>
        </ScrollView>

        {/* Modal de Verificación de Email */}
        <Modal
          visible={showVerificationModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowVerificationModal(false)}
        >
          <View style={registerScreenStyles.modalOverlay}>
            <View style={registerScreenStyles.verificationModal}>
              <View style={registerScreenStyles.verificationHeader}>
                <Ionicons name="mail" size={32} color="#10B981" />
                <Text style={registerScreenStyles.verificationTitle}>¡Revisa tu correo!</Text>
                <Text style={registerScreenStyles.verificationSubtitle}>
                  Hemos enviado un enlace de verificación a:
                </Text>
                <Text style={registerScreenStyles.verificationEmail}>{formData.email}</Text>
              </View>

              <View style={registerScreenStyles.verificationContent}>
                <View style={registerScreenStyles.verificationSteps}>
                  <View style={registerScreenStyles.stepItem}>
                    <View style={registerScreenStyles.stepNumber}>1</View>
                    <Text style={registerScreenStyles.stepText}>Abre tu aplicación de correo</Text>
                  </View>
                  <View style={registerScreenStyles.stepItem}>
                    <View style={registerScreenStyles.stepNumber}>2</View>
                    <Text style={registerScreenStyles.stepText}>Busca el correo de WinUp</Text>
                  </View>
                  <View style={registerScreenStyles.stepItem}>
                    <View style={registerScreenStyles.stepNumber}>3</View>
                    <Text style={registerScreenStyles.stepText}>Haz clic en Verificar cuenta</Text>
                  </View>
                </View>

                <View style={registerScreenStyles.verificationActions}>
                  <TouchableOpacity
                    style={registerScreenStyles.verificationButton}
                    onPress={handleVerification}
                  >
                    <Text style={registerScreenStyles.verificationButtonText}>Ya verifiqué mi cuenta</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      registerScreenStyles.resendButton,
                      resendTimer > 0 && registerScreenStyles.resendButtonDisabled
                    ]}
                    onPress={handleResendVerification}
                    disabled={resendTimer > 0}
                  >
                    <Ionicons name="refresh" size={16} color="#6366f1" />
                    <Text style={registerScreenStyles.resendButtonText}>
                      {resendTimer > 0 
                        ? `Reenviar en ${resendTimer}s` 
                        : 'Reenviar verificación'
                      }
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de Error */}
        <ErrorModal
          visible={errorModal.visible}
          title="No pudimos crear tu cuenta"
          message={errorModal.message}
          onClose={() => setErrorModal({ visible: false, message: '' })}
          primaryActionLabel="Entendido"
        />

        {/* Modal de Éxito */}
        <SuccessModal
          visible={successModal.visible}
          title="¡Registro exitoso!"
          message={successModal.message}
          onPress={() => {
            setSuccessModal({ visible: false, message: '' });
            navigation.navigate('Login' as never);
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

