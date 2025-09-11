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
  Modal,
  TextInput,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { registerUser, verifyEmail, clearError } from '../../store/slices/authSlice';
import { featureFlags } from '../../config/featureFlags';
import { useRegisterViewModel } from '../../viewmodels/auth/useRegisterViewModel';
import { RootStackParamList } from '../../types';
import { colors } from '../../theme/colors';
import { getVariantStyle } from '../../theme/typography';
// @ts-ignore - tipos del datepicker no requeridos en tiempo de compilación
import DateTimePicker from '@react-native-community/datetimepicker';
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const { width, height } = Dimensions.get('window');

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const vm = featureFlags.useMVVMRegister ? useRegisterViewModel() : null;

  // Estados del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    gender: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    gender: '',
    password: '',
  });

  // Estados de validación
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
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
  const birthdateInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];
  const scaleAnim = useState(new Animated.Value(0.98))[0];
  const strengthAnim = useState(new Animated.Value(0))[0];
  const firstNameScaleAnim = useRef(new Animated.Value(1)).current;
  const lastNameScaleAnim = useRef(new Animated.Value(1)).current;
  const emailScaleAnim = useRef(new Animated.Value(1)).current;
  const birthdateScaleAnim = useRef(new Animated.Value(1)).current;
  const genderScaleAnim = useRef(new Animated.Value(1)).current;
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
  }, []);

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
    animateFocusIn(birthdateScaleAnim);
  };

  const handleBirthdateChange = (
    event: any,
    selectedDate?: Date,
  ) => {
    if (event.type === 'dismissed') {
      setShowBirthdatePicker(false);
      setIsBirthdateFocused(false);
      animateFocusOut(birthdateScaleAnim);
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
      animateFocusOut(birthdateScaleAnim);
    }
  };

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
  }, [formData.password.length]);

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
      if (vm) {
        vm.setField('email', formData.email);
        vm.setField('password', formData.password);
        vm.setField('acceptedTerms', acceptedTerms);
        vm.setField('acceptedPrivacy', acceptedPrivacy);
        const res = await vm.submit();
        if (!res.ok) throw new Error(res.error || 'Error al registrar');
        return;
      }

      await dispatch(registerUser({
        email: formData.email,
        password: formData.password,
      })).unwrap();
      setShowVerificationModal(true);
      setResendTimer(60);
      
    } catch (error) {
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
      if (vm) {
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
    } catch (error) {
      Alert.alert(
        'Error de verificación',
        'No se pudo verificar tu cuenta. Inténtalo de nuevo.'
      );
    }
  };

  // Reenviar verificación
  const handleResendVerification = () => {
    if (vm) {
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

  // Obtener color de fortaleza de contraseña
  const getStrengthColor = () => {
    if (passwordStrength >= 80) return '#10B981';
    if (passwordStrength >= 60) return '#F59E0B';
    if (passwordStrength >= 40) return '#F97316';
    return '#EF4444';
  };

  // Obtener texto de fortaleza
  const getStrengthText = () => {
    if (passwordStrength >= 80) return 'Muy fuerte';
    if (passwordStrength >= 60) return 'Fuerte';
    if (passwordStrength >= 40) return 'Media';
    if (passwordStrength >= 20) return 'Débil';
    return 'Muy débil';
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
              <Text style={[getVariantStyle('h1'), { color: colors.textPrimary }]}>¡Únete a WinUp!</Text>
              <Text style={[getVariantStyle('subtitle'), { color: colors.textSecondary }]}>Regístrate y empieza a ganar</Text>
            </View>
          </Animated.View>

          {/* Formulario muy sutil */}
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
              {/* Campo Nombre */}
              <View style={styles.inputContainer}>
                <Animated.View style={[styles.animatedInputWrapper, { transform: [{ scale: firstNameScaleAnim }] }]}>
                  <TextInput
                    ref={firstNameInputRef}
                    style={[getVariantStyle('body'), styles.simpleInput, isFirstNameFocused && styles.inputFocused]}
                    placeholder="Nombre"
                    placeholderTextColor={colors.muted}
                    value={formData.firstName}
                    onChangeText={(value) => updateFormData('firstName', value)}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onFocus={() => { setIsFirstNameFocused(true); animateFocusIn(firstNameScaleAnim); }}
                    onBlur={() => { setIsFirstNameFocused(false); animateFocusOut(firstNameScaleAnim); }}
                    onSubmitEditing={() => lastNameInputRef.current?.focus()}
                  />
                </Animated.View>
                {errors.firstName && (
                  <Text style={[getVariantStyle('caption'), styles.errorText]}>{errors.firstName}</Text>
                )}
              </View>

              {/* Campo Apellido */}
              <View style={styles.inputContainer}>
                <Animated.View style={[styles.animatedInputWrapper, { transform: [{ scale: lastNameScaleAnim }] }]}>
                  <TextInput
                    ref={lastNameInputRef}
                    style={[getVariantStyle('body'), styles.simpleInput, isLastNameFocused && styles.inputFocused]}
                    placeholder="Apellido"
                    placeholderTextColor={colors.muted}
                    value={formData.lastName}
                    onChangeText={(value) => updateFormData('lastName', value)}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onFocus={() => { setIsLastNameFocused(true); animateFocusIn(lastNameScaleAnim); }}
                    onBlur={() => { setIsLastNameFocused(false); animateFocusOut(lastNameScaleAnim); }}
                    onSubmitEditing={() => emailInputRef.current?.focus()}
                  />
                </Animated.View>
                {errors.lastName && (
                  <Text style={[getVariantStyle('caption'), styles.errorText]}>{errors.lastName}</Text>
                )}
              </View>

              {/* Campo Email */}
              <View style={styles.inputContainer}>
                <Animated.View style={[styles.animatedInputWrapper, { transform: [{ scale: emailScaleAnim }] }]}>
                <TextInput
                  ref={emailInputRef}
                  style={[getVariantStyle('body'), styles.simpleInput, isEmailFocused && styles.inputFocused]}
                  placeholder=" C
                  orreo electrónico"
                  placeholderTextColor={colors.muted}
                  value={formData.email}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => { setIsEmailFocused(true); animateFocusIn(emailScaleAnim); }}
                  onBlur={() => { setIsEmailFocused(false); animateFocusOut(emailScaleAnim); }}
                  blurOnSubmit={false}
                  returnKeyType="next"
                  onSubmitEditing={handleOpenBirthdatePicker}
                />
                </Animated.View>
                {errors.email && (
                  <Text style={[getVariantStyle('caption'), styles.errorText]}>{errors.email}</Text>
                )}
              </View>

              {/* Campo Fecha de nacimiento (DatePicker nativo) */}
              <View style={styles.inputContainer}>
                <Animated.View style={[styles.animatedInputWrapper, { transform: [{ scale: birthdateScaleAnim }] }]}> 
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.pickerContainer, isBirthdateFocused && styles.inputFocused]}
                    onPress={handleOpenBirthdatePicker}
                  >
                    <Text style={[getVariantStyle('body'), styles.pickerText, !formData.birthdate && styles.pickerPlaceholder]}>
                      {formData.birthdate || 'Fecha de nacimiento (DD/MM/AAAA)'}
                    </Text>
                    <Ionicons name="calendar" size={18} color={colors.muted} />
                  </TouchableOpacity>
                </Animated.View>
                {showBirthdatePicker && (
                  <DateTimePicker
                    value={birthdateValue || getBirthdateMinMax().maxDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleBirthdateChange}
                    maximumDate={getBirthdateMinMax().maxDate}
                    minimumDate={getBirthdateMinMax().minDate}
                    locale="es-ES"
                  />
                )}
                {errors.birthdate && (
                  <Text style={[getVariantStyle('caption'), styles.errorText]}>{errors.birthdate}</Text>
                )}
              </View>

              {/* Campo Género (Dropdown inline) */}
              <View style={styles.inputContainer}>
                <Animated.View style={[styles.animatedInputWrapper, { transform: [{ scale: genderScaleAnim }] }]}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.pickerContainer, isGenderFocused && styles.inputFocused]}
                    onPress={() => {
                      setIsGenderPickerOpen(prev => !prev);
                      setIsGenderFocused(true);
                      animateFocusIn(genderScaleAnim);
                    }}
                  >
                    <Text style={[getVariantStyle('body'), styles.pickerText, !formData.gender && styles.pickerPlaceholder]}>
                      {formData.gender || 'Selecciona tu género'}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color={colors.muted} />
                  </TouchableOpacity>
                </Animated.View>
                {isGenderPickerOpen && (
                  <View style={styles.dropdownPanel}>
                    {['Femenino', 'Masculino', 'Otro', 'Prefiero no decirlo'].map(option => (
                      <TouchableOpacity
                        key={option}
                        style={styles.dropdownOption}
                        onPress={() => {
                          updateFormData('gender', option);
                          setIsGenderPickerOpen(false);
                          setIsGenderFocused(false);
                          animateFocusOut(genderScaleAnim);
                        }}
                      >
                        <Text style={[getVariantStyle('body'), { color: colors.textPrimary }]}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {errors.gender && (
                  <Text style={[getVariantStyle('caption'), styles.errorText]}>{errors.gender}</Text>
                )}
              </View>

              {/* Campo Contraseña */}
              <View style={styles.inputContainer}>
                <Animated.View style={[styles.animatedInputWrapper, { transform: [{ scale: passwordScaleAnim }] }]}>
                  <TextInput
                    ref={passwordInputRef}
                    style={[getVariantStyle('body'), styles.simpleInput, isPasswordFocused && styles.inputFocused]}
                    placeholder="Contraseña"
                    placeholderTextColor={colors.muted}
                    value={formData.password}
                    onChangeText={(value) => setFormData(prev => ({ ...prev, password: value }))}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => { setIsPasswordFocused(true); animateFocusIn(passwordScaleAnim); }}
                    onBlur={() => { setIsPasswordFocused(false); animateFocusOut(passwordScaleAnim); }}
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                  />
                </Animated.View>
                {errors.password && (
                  <Text style={[getVariantStyle('caption'), styles.errorText]}>{errors.password}</Text>
                )}

                {/* Indicador de fortaleza de contraseña */}
                {formData.password.length > 0 && (
                  <Animated.View
                    style={[
                      styles.strengthContainer,
                      {
                        opacity: strengthAnim,
                      },
                    ]}
                  >
                    <View style={styles.strengthBar}>
                      <View
                        style={[
                          styles.strengthFill,
                          {
                            width: `${passwordStrength}%`,
                            backgroundColor: getStrengthColor(),
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
                      {getStrengthText()}
                    </Text>
                  </Animated.View>
                )}

                {/* Requisitos de contraseña */}
                {formData.password.length > 0 && (
                  <View style={styles.requirementsContainer}>
                    <Text style={[getVariantStyle('body'), styles.requirementsTitle]}>Tu contraseña debe incluir:</Text>
                    <View style={styles.requirementItem}>
                      <Ionicons
                        name={formData.password.length >= 8 ? "checkmark-circle" : "ellipse-outline"}
                        size={14}
                        color={formData.password.length >= 8 ? "#10B981" : "#94a3b8"}
                      />
                      <Text style={[getVariantStyle('body'), styles.requirementText]}>Al menos 8 caracteres</Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <Ionicons
                        name={/[a-z]/.test(formData.password) ? "checkmark-circle" : "ellipse-outline"}
                        size={14}
                        color={/[a-z]/.test(formData.password) ? "#10B981" : "#94a3b8"}
                      />
                      <Text style={[getVariantStyle('body'), styles.requirementText]}>Al menos una letra minúscula</Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <Ionicons
                        name={/[A-Z]/.test(formData.password) ? "checkmark-circle" : "ellipse-outline"}
                        size={14}
                        color={/[A-Z]/.test(formData.password) ? "#10B981" : "#94a3b8"}
                      />
                      <Text style={[getVariantStyle('body'), styles.requirementText]}>Al menos una letra mayúscula</Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <Ionicons
                        name={/\d/.test(formData.password) ? "checkmark-circle" : "ellipse-outline"}
                        size={14}
                        color={/\d/.test(formData.password) ? "#10B981" : "#94a3b8"}
                      />
                      <Text style={[getVariantStyle('body'), styles.requirementText]}>Al menos un número</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Términos y Privacidad */}
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setAcceptedTerms(!acceptedTerms)}
                >
                  <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                    {acceptedTerms && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                  <Text style={[getVariantStyle('body'), styles.termsText]}>
                    Acepto los{' '}
                    <Text style={[getVariantStyle('body'), styles.termsLink]}>Términos y Condiciones</Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
                >
                  <View style={[styles.checkbox, acceptedPrivacy && styles.checkboxChecked]}>
                    {acceptedPrivacy && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                  <Text style={[getVariantStyle('body'), styles.termsText]}>
                    Acepto la{' '}
                    <Text style={[getVariantStyle('body'), styles.termsLink]}>Política de Privacidad</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Botón de registro */}
              <AnimatedTouchableOpacity
                style={[
                  styles.registerButton,
                  (!acceptedTerms || !acceptedPrivacy) && styles.registerButtonDisabled,
                  { transform: [{ scale: registerButtonScaleAnim }] }
                ]}
                onPress={handleRegister}
                onPressIn={handleRegisterPressIn}
                onPressOut={handleRegisterPressOut}
                disabled={!acceptedTerms || !acceptedPrivacy || isLoading}
              >
                <View style={styles.registerButtonContent}>
                  {isLoading ? (
                    <Text style={[getVariantStyle('body'), styles.registerButtonText, { fontWeight: '600' }]}>Creando cuenta...</Text>
                  ) : (
                    <Text style={[getVariantStyle('body'), styles.registerButtonText, { fontWeight: '600' }]}>Crear cuenta</Text>
                  )}
                </View>
              </AnimatedTouchableOpacity>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={[getVariantStyle('body'), styles.footerText]}>¿Ya tienes cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                  <Text style={[getVariantStyle('body'), styles.linkText, { fontWeight: '600' }]}>Iniciar sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Modal de Verificación de Email */}
        <Modal
          visible={showVerificationModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowVerificationModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.verificationModal}>
              <View style={styles.verificationHeader}>
                <Ionicons name="mail" size={32} color="#10B981" />
                <Text style={styles.verificationTitle}>¡Revisa tu correo!</Text>
                <Text style={styles.verificationSubtitle}>
                  Hemos enviado un enlace de verificación a:
                </Text>
                <Text style={styles.verificationEmail}>{formData.email}</Text>
              </View>

              <View style={styles.verificationContent}>
                <View style={styles.verificationSteps}>
                  <View style={styles.stepItem}>
                    <View style={styles.stepNumber}>1</View>
                    <Text style={styles.stepText}>Abre tu aplicación de correo</Text>
                  </View>
                  <View style={styles.stepItem}>
                    <View style={styles.stepNumber}>2</View>
                    <Text style={styles.stepText}>Busca el correo de WinUp</Text>
                  </View>
                  <View style={styles.stepItem}>
                    <View style={styles.stepNumber}>3</View>
                    <Text style={styles.stepText}>Haz clic en "Verificar cuenta"</Text>
                  </View>
                </View>

                <View style={styles.verificationActions}>
                  <TouchableOpacity
                    style={styles.verificationButton}
                    onPress={handleVerification}
                  >
                    <Text style={styles.verificationButtonText}>Ya verifiqué mi cuenta</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.resendButton,
                      resendTimer > 0 && styles.resendButtonDisabled
                    ]}
                    onPress={handleResendVerification}
                    disabled={resendTimer > 0}
                  >
                    <Ionicons name="refresh" size={16} color="#6366f1" />
                    <Text style={styles.resendButtonText}>
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
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 5,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 40,
  },
  logoImage: {
    width: 56,
    height: 56,
    marginBottom: 24,
  },
  appName: {
    marginBottom: 8,
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
  animatedInputWrapper: {
    borderRadius: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  inputFocused: {
    borderColor: colors.primary600,
    backgroundColor: '#ffffff',
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
  textInput: {
    flex: 1,
    color: colors.textPrimary,
    marginLeft: 12,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 6,
  },
  errorText: {
    color: colors.error,
    marginTop: 8,
    marginLeft: 4,
  },
  strengthContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  strengthBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  requirementsContainer: {
    marginTop: 16,
  },
  requirementsTitle: {
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    color: colors.textSecondary,
    marginLeft: 10,
  },
  termsContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 12,
    marginTop: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  termsText: {
    flex: 1,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary600,
    fontWeight: '500',
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: colors.primary600,
  },
  registerButtonDisabled: {
    opacity: 0.5,
    backgroundColor: colors.muted,
  },
  registerButtonContent: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  registerButtonText: {
    color: colors.onPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    color: colors.textSecondary,
  },
  linkText: {
    color: colors.primary600,
    fontWeight: '600',
  },
  // Estilos del Modal de Verificación
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationModal: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  genderModal: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  genderOption: {
    paddingVertical: 12,
  },
  verificationHeader: {
    padding: 28,
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
  },
  verificationTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  verificationSubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  verificationEmail: {
    fontWeight: '600',
    color: colors.primary600,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  verificationContent: {
    padding: 28,
  },
  verificationSteps: {
    marginBottom: 28,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary600,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepText: {
    color: colors.textPrimary,
    flex: 1,
  },
  verificationActions: {
    gap: 16,
  },
  verificationButton: {
    backgroundColor: colors.primary600,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  verificationButtonText: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary600,
    backgroundColor: '#ffffff',
  },
  resendButtonDisabled: {
    opacity: 0.6,
    borderColor: '#cbd5e1',
  },
  resendButtonText: {
    color: colors.primary600,
    marginLeft: 8,
  },
  simpleInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.textPrimary,
    minHeight: 56,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    color: colors.textPrimary,
  },
  pickerPlaceholder: {
    color: colors.muted,
  },
  dropdownPanel: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
