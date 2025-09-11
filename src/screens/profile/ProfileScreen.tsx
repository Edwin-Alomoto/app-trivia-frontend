import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
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
import { logoutUser } from '../../store/slices/authSlice';
import { fetchPointBalance } from '../../store/slices/pointsSlice';
import { featureFlags } from '../../config/featureFlags';
import { useProfileViewModel } from '../../viewmodels/profile/useProfileViewModel';
import { getVariantStyle } from '../../theme/typography';

const { width, height } = Dimensions.get('window');

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { balance } = useAppSelector((state) => state.points);
  const vm = featureFlags.useMVVMProfile ? useProfileViewModel() : null;

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    if (vm) {
      vm.refresh();
    } else {
      dispatch(fetchPointBalance());
    }
    
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
          onPress: () => (vm ? vm.logout() : dispatch(logoutUser())),
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'notifications',
      title: 'Notificaciones',
      subtitle: 'Gestiona tus notificaciones',
      icon: 'notifications-outline',
      color: ['#ff6b6b', '#ee5a52'],
      onPress: () => navigation.navigate('Notifications' as never),
    },
    {
      id: 'points-history',
      title: 'Historial de Puntos',
      subtitle: 'Ver todas tus transacciones',
      icon: 'time-outline',
      color: ['#42a5f5', '#2196f3'],
      onPress: () => navigation.navigate('PointsHistory' as never),
    },
    {
      id: 'my-rewards',
      title: 'Mis Premios',
      subtitle: 'Premios que has canjeado',
      icon: 'gift-outline',
      color: ['#66bb6a', '#4caf50'],
      onPress: () => navigation.navigate('MyRewards' as never),
    },
    {
      id: 'my-raffles',
      title: 'Mis Sorteos',
      subtitle: 'Sorteos en los que participas',
      icon: 'ticket-outline',
      color: ['#ab47bc', '#9c27b0'],
      onPress: () => navigation.navigate('MyRaffles' as never),
    },
    {
      id: 'settings',
      title: 'Configuración',
      subtitle: 'Ajustes de la aplicación',
      icon: 'settings-outline',
      color: ['#ffa726', '#ff9800'],
      onPress: () => navigation.navigate('Settings' as never),
    },
    {
      id: 'help',
      title: 'Ayuda y Soporte',
      subtitle: 'Centro de ayuda',
      icon: 'help-circle-outline',
      color: ['#26a69a', '#009688'],
      onPress: () => navigation.navigate('Help' as never),
    },
  ];

  const stats = [
    {
      label: 'Puntos Totales',
      value: balance.total.toLocaleString(),
      icon: 'wallet-outline',
      color: '#667eea',
    },
    {
      label: 'Puntos Ganados',
      value: balance.earned.toLocaleString(),
      icon: 'trending-up',
      color: '#10b981',
    },
    {
      label: 'Puntos Gastados',
      value: balance.spent.toLocaleString(),
      icon: 'trending-down',
      color: '#ef4444',
    },
    {
      label: 'Puntos Comprados',
      value: balance.purchased.toLocaleString(),
      icon: 'card',
      color: '#3b82f6',
    },
  ];

  const renderMenuItem = (item: any) => (
    <Animated.View
      key={item.id}
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <TouchableOpacity onPress={item.onPress}>
        <Card style={styles.menuItem}>
          <LinearGradient
            colors={item.color}
            style={styles.menuItemGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemIcon}>
                <Ionicons name={item.icon as any} size={24} color="#fff" />
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </View>
          </LinearGradient>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header - Igual que CategoriesScreen */}
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
                onPress={() => (navigation as any).goBack()}
                accessibilityRole="button"
                accessibilityLabel="Volver"
              >
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <View style={styles.headerInfo}>
                <Text style={[getVariantStyle('h1'), styles.title]}>Perfil</Text>
                <Text style={[getVariantStyle('subtitle'), styles.subtitle]}>Tu cuenta</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Datos de Usuario debajo del header */}
        <Animated.View
          style={[
            styles.userCardContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <Card style={styles.userCard}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
                  style={styles.avatar}
                >
                  <Ionicons name="person" size={40} color="#667eea" />
                </LinearGradient>
              </View>
              <View style={styles.userInfo}>
                <Text style={[getVariantStyle('h2'), styles.userNameText]}>{(vm ? vm.user : user)?.name || 'Usuario'}</Text>
                <Text style={[getVariantStyle('body'), styles.userEmailText]}>{(vm ? vm.user : user)?.email || 'usuario@test.com'}</Text>
                <View style={styles.userLevel}>
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.userLevelTextDark}>Nivel Trivia Master</Text>
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>📊 Estadísticas</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <Card key={index} style={styles.statCard}>
                <View style={styles.statContent}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                    <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </Card>
            ))}
          </View>
        </Animated.View>

        {/* Menu Section */}
        <Animated.View
          style={[
            styles.menuContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>⚙️ Opciones</Text>
          <View style={styles.menuList}>
            {menuItems.map(renderMenuItem)}
          </View>
        </Animated.View>

        {/* Logout Section */}
        <Animated.View
          style={[
            styles.logoutContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </Animated.View>

        {/* App Info */}
        <Animated.View
          style={[
            styles.appInfoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.appVersion}>WinUp v1.0.0</Text>
          <Text style={styles.appDescription}>
            La mejor app de trivia con premios increíbles
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 0,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 24,
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 3,
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    textAlign: 'left',
    marginRight:10,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    opacity: 1,
    textAlign: 'left',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  userLevel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userLevelText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  statsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  userCardContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    zIndex: 2,
  },
  userCard: {
    padding: 16,
    borderRadius: 16,
  },
  userNameText: {
    color: '#2d3748',
    marginBottom: 4,
  },
  userEmailText: {
    color: '#6b7280',
    marginBottom: 8,
  },
  userLevelTextDark: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  menuList: {
    gap: 12,
  },
  menuItem: {
    padding: 0,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemGradient: {
    padding: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  logoutButton: {
    borderRadius: 12,
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  appInfoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 12,
    color: '#a0aec0',
    textAlign: 'center',
  },
});
