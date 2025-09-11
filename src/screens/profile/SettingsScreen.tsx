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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { featureFlags } from '../../config/featureFlags';
import { useProfileViewModel } from '../../viewmodels/profile/useProfileViewModel';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const useMVVM = featureFlags.useMVVMSettings;
  const vm = useMVVM ? useProfileViewModel() : null;
  const { user } = useMVVM ? { user: vm!.user } : useAppSelector((state) => state.auth);
  
  // Estados de configuración
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [darkMode, setDarkMode] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

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
          onPress: () => {
            if (useMVVM && vm) {
              vm.logout();
            }
            Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente');
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
      'Eliminar Cuenta',
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es permanente y no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada exitosamente');
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Notificaciones',
      icon: 'notifications',
      color: ['#ff6b6b', '#ee5a52'],
      items: [
        {
          id: 'notifications',
          title: 'Notificaciones Push',
          subtitle: 'Recibe notificaciones de nuevos sorteos y premios',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
      ],
    },
    {
      title: 'Audio y Vibración',
      icon: 'volume-high',
      color: ['#42a5f5', '#2196f3'],
      items: [
        {
          id: 'sound',
          title: 'Efectos de Sonido',
          subtitle: 'Reproducir sonidos en la aplicación',
          type: 'switch',
          value: sound,
          onValueChange: setSound,
        },
        {
          id: 'haptics',
          title: 'Vibración',
          subtitle: 'Vibración al tocar botones',
          type: 'switch',
          value: haptics,
          onValueChange: setHaptics,
        },
      ],
    },
    {
      title: 'Preferencias',
      icon: 'settings',
      color: ['#66bb6a', '#4caf50'],
      items: [
        {
          id: 'language',
          title: 'Idioma',
          subtitle: language === 'es' ? 'Español' : 'English',
          type: 'select',
          onPress: () => {
            setLanguage(language === 'es' ? 'en' : 'es');
          },
        },
        {
          id: 'darkMode',
          title: 'Modo Oscuro',
          subtitle: 'Cambiar tema de la aplicación',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          id: 'autoPlay',
          title: 'Reproducción Automática',
          subtitle: 'Reproducir videos automáticamente',
          type: 'switch',
          value: autoPlay,
          onValueChange: setAutoPlay,
        },
      ],
    },
    {
      title: 'Cuenta',
      icon: 'person',
      color: ['#ab47bc', '#9c27b0'],
      items: [
        {
          id: 'profile',
          title: 'Editar Perfil',
          subtitle: 'Cambiar información personal',
          type: 'navigate',
          onPress: () => Alert.alert('Editar Perfil', 'Función próximamente'),
        },
        {
          id: 'password',
          title: 'Cambiar Contraseña',
          subtitle: 'Actualizar contraseña de seguridad',
          type: 'navigate',
          onPress: () => Alert.alert('Cambiar Contraseña', 'Función próximamente'),
        },
        {
          id: 'privacy',
          title: 'Privacidad',
          subtitle: 'Configurar privacidad de datos',
          type: 'navigate',
          onPress: () => Alert.alert('Privacidad', 'Función próximamente'),
        },
      ],
    },
    {
      title: 'Datos',
      icon: 'folder',
      color: ['#ffa726', '#ff9800'],
      items: [
        {
          id: 'export',
          title: 'Exportar Datos',
          subtitle: 'Descargar mis datos personales',
          type: 'navigate',
          onPress: () => Alert.alert('Exportar Datos', 'Función próximamente'),
        },
        {
          id: 'clear',
          title: 'Limpiar Datos',
          subtitle: 'Eliminar datos locales de la app',
          type: 'action',
          onPress: handleClearData,
        },
      ],
    },
    {
      title: 'Información',
      icon: 'information-circle',
      color: ['#26a69a', '#009688'],
      items: [
        {
          id: 'about',
          title: 'Acerca de',
          subtitle: 'Información de la aplicación',
          type: 'navigate',
          onPress: () => Alert.alert('Acerca de', 'TriviaMaster v1.0.0\nDesarrollado con ❤️'),
        },
        {
          id: 'terms',
          title: 'Términos y Condiciones',
          subtitle: 'Leer términos de uso',
          type: 'navigate',
          onPress: () => Alert.alert('Términos y Condiciones', 'Función próximamente'),
        },
        {
          id: 'privacy-policy',
          title: 'Política de Privacidad',
          subtitle: 'Leer política de privacidad',
          type: 'navigate',
          onPress: () => Alert.alert('Política de Privacidad', 'Función próximamente'),
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
          trackColor={{ false: '#e5e7eb', true: '#667eea' }}
          thumbColor={item.value ? '#fff' : '#f3f4f6'}
          ios_backgroundColor="#e5e7eb"
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
      <Card style={styles.sectionCard}>
        <LinearGradient
          colors={section.color}
          style={styles.sectionHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.sectionHeaderContent}>
            <Ionicons name={section.icon as any} size={24} color="#fff" />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        </LinearGradient>
        
        <View style={styles.sectionContent}>
          {section.items.map(renderSettingItem)}
        </View>
      </Card>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Ionicons name="settings" size={32} color="#fff" />
              <Text style={styles.title}>Configuración</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
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
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              style={styles.logoutButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="log-out" size={20} color="#fff" />
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteButtonText}>Eliminar Cuenta</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  headerInfo: {
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  userEmail: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  sectionsContainer: {
    padding: 20,
  },
  sectionCard: {
    marginBottom: 20,
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeader: {
    padding: 16,
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
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
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
});
