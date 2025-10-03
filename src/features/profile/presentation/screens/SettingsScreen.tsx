import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Switch,
  Alert,
  ImageBackground,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useAppDispatch } from '@shared/domain/hooks/useAppDispatch';
import { useAppSelector } from '@shared/domain/hooks/useAppSelector';
import { updateProfile } from '../../domain/store/profileSlice';
import { logoutUser } from '@features/auth/domain/store/authSlice';
import { featureToggles } from '@config/featureToggles';
import { useProfileViewModel } from '../../domain/hooks/useProfileViewModel';
import { Background } from '../../../../assets';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';
import { useLanguage } from '@shared/domain/contexts/LanguageContext';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useLanguage();
  const useAdvanced = featureToggles.useAdvancedSettings;
  const vm = useAdvanced ? useProfileViewModel() : null;
  const { user } = useAdvanced ? { user: vm!.user } : useAppSelector((state) => state.auth);
  
  // Estados de configuración
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  
  // Estados del formulario de editar perfil
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [profileErrors, setProfileErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phone: '',
    address: '',
  });

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

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              // Mostrar loading si es necesario
              if (useAdvanced && vm) {
                vm.logout();
              } else {
                await dispatch(logoutUser()).unwrap();
              }
              
              // Feedback de éxito
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              
              // Reset navigation stack to Login screen
              (navigation as any).reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
              
            } catch (error) {
              // Manejar error
              Alert.alert(
                'Error', 
                'No se pudo cerrar sesión correctamente. Inténtalo de nuevo.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Forzar navegación a login en caso de error
                      (navigation as any).reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                      });
                    }
                  }
                ]
              );
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Limpiar Datos',
      '¿Estás seguro de que quieres limpiar todos los datos de la aplicación? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Datos limpiados', 'Los datos han sido limpiados exitosamente');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('button.deleteAccount'),
      t('message.deleteConfirm'),
      [
        {
          text: t('button.cancel'),
          style: 'cancel',
        },
        {
          text: t('button.deleteAccount'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(t('message.accountDeleted'), t('message.accountDeleted'));
          },
        },
      ]
    );
  };

  const handleLanguageChange = (newLanguage: 'es' | 'en') => {
    setLanguage(newLanguage);
    setShowLanguageModal(false);
  };

  // Funciones para el modal de editar perfil
  const handleEditProfile = () => {
    setShowEditProfileModal(true);
  };

  const handleProfileFormChange = (field: keyof typeof profileForm, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
    if (profileErrors[field as keyof typeof profileErrors]) {
      setProfileErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      phone: '',
      address: '',
    };

    if (!profileForm.firstName.trim()) {
      newErrors.firstName = t('auth.error.firstNameRequired') || 'El nombre es requerido';
    }

    if (!profileForm.lastName.trim()) {
      newErrors.lastName = t('auth.error.lastNameRequired') || 'El apellido es requerido';
    }

    if (!profileForm.email.trim()) {
      newErrors.email = t('auth.error.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      newErrors.email = t('auth.error.invalidEmail');
    }

    if (!profileForm.username.trim()) {
      newErrors.username = t('auth.error.usernameRequired') || 'El nombre de usuario es requerido';
    }

    setProfileErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      return;
    }

    try {
      // Preparar datos para la API (mapear campos del formulario a la API)
      const apiData = {
        email: profileForm.email,
        first_name: profileForm.firstName,
        last_name: profileForm.lastName,
        address: profileForm.address,
        username: profileForm.username,
        phone: profileForm.phone,
      };

      // Llamar a la API de actualización
      await dispatch(updateProfile(apiData)).unwrap();
      
      setShowEditProfileModal(false);
      Alert.alert(t('button.save'), 'Perfil actualizado exitosamente');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error?.message || 'No se pudo actualizar el perfil');
    }
  };

  const settingsSections = [
    {
      title: t('settings.notifications'),
      icon: 'notifications',
      color: ['#ff6b6b', '#ee5a52'],
      items: [
        {
          id: 'notifications',
          title: t('settings.notifications.push'),
          subtitle: t('settings.notifications.subtitle'),
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
      ],
    },
    {
      title: t('settings.preferences'),
      icon: 'settings',
      color: ['#66bb6a', '#4caf50'],
      items: [
        {
          id: 'sound',
          title: t('settings.sound'),
          subtitle: t('settings.sound.subtitle'),
          type: 'switch',
          value: sound,
          onValueChange: setSound,
        },
        {
          id: 'haptics',
          title: t('settings.haptics'),
          subtitle: t('settings.haptics.subtitle'),
          type: 'switch',
          value: haptics,
          onValueChange: setHaptics,
        },
        {
          id: 'language',
          title: t('settings.language'),
          subtitle: language === 'es' ? t('language.spanish') : t('language.english'),
          type: 'select',
          onPress: () => setShowLanguageModal(true),
        },
      ],
    },
    {
      title: t('settings.account'),
      icon: 'person',
      color: ['#ab47bc', '#9c27b0'],
      items: [
        {
          id: 'profile',
          title: t('settings.editProfile'),
          subtitle: t('settings.editProfile.subtitle'),
          type: 'navigate',
          onPress: handleEditProfile,
        },
        {
          id: 'password',
          title: t('settings.changePassword'),
          subtitle: t('settings.changePassword.subtitle'),
          type: 'navigate',
          onPress: () => (navigation as any).navigate('ChangePassword'),
        },
        {
          id: 'privacy',
          title: t('settings.privacy'),
          subtitle: t('settings.privacy.subtitle'),
          type: 'navigate',
          onPress: () => Alert.alert(t('settings.privacy'), t('message.comingSoon')),
        },
      ],
    },
    {
      title: t('settings.information'),
      icon: 'information-circle',
      color: ['#26a69a', '#009688'],
      items: [
        {
          id: 'about',
          title: t('settings.about'),
          subtitle: t('settings.about.subtitle'),
          type: 'navigate',
          onPress: () => Alert.alert(t('settings.about'), 'TriviaMaster v1.0.0\nDesarrollado con ❤️'),
        },
        {
          id: 'terms',
          title: t('settings.terms'),
          subtitle: t('settings.terms.subtitle'),
          type: 'navigate',
          onPress: () => Alert.alert(t('settings.terms'), t('message.comingSoon')),
        },
        {
          id: 'privacy-policy',
          title: t('settings.privacyPolicy'),
          subtitle: t('settings.privacyPolicy.subtitle'),
          type: 'navigate',
          onPress: () => Alert.alert(t('settings.privacyPolicy'), t('message.comingSoon')),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => (
    <View key={item.id} style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      
      {item.type === 'switch' && (
        <Switch
          value={item.value}
          onValueChange={item.onValueChange}
          trackColor={{ false: colors.primary050, true: colors.primary400 }}
          thumbColor={item.value ? colors.primary400 : colors.primary100}
          ios_backgroundColor={colors.primary050}
        />
      )}
      
      {item.type === 'select' && (
        <TouchableOpacity onPress={item.onPress}>
          <View style={styles.selectButton}>
            <Text style={styles.selectText}>{item.subtitle}</Text>
            <Ionicons name="chevron-forward" size={16} color="#6b7280" />
          </View>
        </TouchableOpacity>
      )}
      
      {item.type === 'navigate' && (
        <TouchableOpacity onPress={item.onPress}>
          <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        </TouchableOpacity>
      )}
      
      {item.type === 'action' && (
        <TouchableOpacity onPress={item.onPress}>
          <Ionicons name="chevron-forward" size={20} color="#ef4444" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSection = (section: any) => (
    <Animated.View
      key={section.title}
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderContent}>
            <Ionicons name={section.icon as any} size={24} color="#fff" />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        </View>
        
        <View style={styles.sectionContent}>
          {section.items.map(renderSettingItem)}
        </View>
      </View>
    </Animated.View>
  );

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
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back" size={28} color={colors.gold} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                  <Text style={[getVariantStyle('h1'), styles.title]}>{t('settings.title')}</Text>
                  <Text style={[getVariantStyle('subtitle'), styles.subtitle]}>{t('settings.subtitle')}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Secciones de Configuración */}
          <View style={styles.sectionsContainer}>
            {settingsSections.map(renderSection)}
          </View>

          {/* Botones de Acción */}
          <Animated.View
            style={[
              styles.actionsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >

            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Text style={styles.deleteButtonText}>{t('button.deleteAccount')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal de Selección de Idioma */}
      <Modal visible={showLanguageModal} transparent animationType="fade" onRequestClose={() => setShowLanguageModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.languageModal}>
            <Text style={[getVariantStyle('h2'), styles.modalTitle]}>{t('language.title')}</Text>
            
            <TouchableOpacity 
              style={[styles.languageOption, language === 'es' && styles.selectedOption]}
              onPress={() => handleLanguageChange('es')}
            >
              <Text style={[getVariantStyle('body'), styles.languageText]}>🇪🇸 {t('language.spanish')}</Text>
              {language === 'es' && <Ionicons name="checkmark" size={20} color={colors.gold} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.languageOption, language === 'en' && styles.selectedOption]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[getVariantStyle('body'), styles.languageText]}>🇺🇸 {t('language.english')}</Text>
              {language === 'en' && <Ionicons name="checkmark" size={20} color={colors.gold} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={[getVariantStyle('body'), styles.cancelText]}>{t('language.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Editar Perfil */}
      <Modal visible={showEditProfileModal} transparent animationType="fade" onRequestClose={() => setShowEditProfileModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.editProfileModal}>
            <Text style={[getVariantStyle('h2'), styles.modalTitle]}>{t('settings.editProfile')}</Text>
            
            <ScrollView style={styles.editProfileForm} showsVerticalScrollIndicator={false}>
              {/* Nombre */}
              <View style={styles.formField}>
                <Text style={[getVariantStyle('body'), styles.fieldLabel]}>{t('auth.firstName')}</Text>
                <TextInput
                  style={[styles.textInput, profileErrors.firstName && styles.inputError]}
                  value={profileForm.firstName}
                  onChangeText={(value) => handleProfileFormChange('firstName', value)}
                  placeholder={t('auth.firstName')}
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
                {profileErrors.firstName && (
                  <Text style={styles.errorText}>{profileErrors.firstName}</Text>
                )}
              </View>

              {/* Apellido */}
              <View style={styles.formField}>
                <Text style={[getVariantStyle('body'), styles.fieldLabel]}>{t('auth.lastName')}</Text>
                <TextInput
                  style={[styles.textInput, profileErrors.lastName && styles.inputError]}
                  value={profileForm.lastName}
                  onChangeText={(value) => handleProfileFormChange('lastName', value)}
                  placeholder={t('auth.lastName')}
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
                {profileErrors.lastName && (
                  <Text style={styles.errorText}>{profileErrors.lastName}</Text>
                )}
              </View>

              {/* Email */}
              <View style={styles.formField}>
                <Text style={[getVariantStyle('body'), styles.fieldLabel]}>{t('auth.email')}</Text>
                <TextInput
                  style={[styles.textInput, profileErrors.email && styles.inputError]}
                  value={profileForm.email}
                  onChangeText={(value) => handleProfileFormChange('email', value)}
                  placeholder={t('auth.email')}
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {profileErrors.email && (
                  <Text style={styles.errorText}>{profileErrors.email}</Text>
                )}
              </View>

              {/* Username */}
              <View style={styles.formField}>
                <Text style={[getVariantStyle('body'), styles.fieldLabel]}>{t('auth.username')}</Text>
                <TextInput
                  style={[styles.textInput, profileErrors.username && styles.inputError]}
                  value={profileForm.username}
                  onChangeText={(value) => handleProfileFormChange('username', value)}
                  placeholder={t('auth.username')}
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  autoCapitalize="none"
                />
                {profileErrors.username && (
                  <Text style={styles.errorText}>{profileErrors.username}</Text>
                )}
              </View>

              {/* Teléfono */}
              <View style={styles.formField}>
                <Text style={[getVariantStyle('body'), styles.fieldLabel]}>{t('auth.phone')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={profileForm.phone}
                  onChangeText={(value) => handleProfileFormChange('phone', value)}
                  placeholder={t('auth.phone')}
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Dirección */}
              <View style={styles.formField}>
                <Text style={[getVariantStyle('body'), styles.fieldLabel]}>{t('auth.address')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={profileForm.address}
                  onChangeText={(value) => handleProfileFormChange('address', value)}
                  placeholder={t('auth.address')}
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            {/* Botones */}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowEditProfileModal(false)}
              >
                <Text style={[getVariantStyle('body'), styles.cancelText]}>{t('button.cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={[getVariantStyle('body'), styles.saveText]}>{t('button.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  sectionsContainer: {
    padding: 20,
  },
  sectionCard: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    padding: 16,
    backgroundColor: 'rgba(239, 184, 16, 0.5)',
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  sectionContent: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectText: {
    fontSize: 14,
    color: '#374151',
    marginRight: 4,
  },
  actionsContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },
  // Modal de idioma - Mismo diseño que ModalAlert
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  languageModal: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: colors.primary900,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: 20,
  },
  modalTitle: {
    color: colors.gold,
    textAlign: 'center',
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedOption: {
    backgroundColor: 'rgba(239, 184, 16, 0.2)',
    borderWidth: 1,
    borderColor: colors.gold,
  },
  languageText: {
    color: '#ffffff',
    flex: 1,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.gold,
    fontWeight: '600',
  },

  // Modal de Editar Perfil
  editProfileModal: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 16,
    backgroundColor: colors.primary900,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: 20,
  },
  editProfileForm: {
    maxHeight: 400,
    marginBottom: 20,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: '#ffffff',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.gold,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: colors.primary900,
    fontWeight: '600',
  },
});
