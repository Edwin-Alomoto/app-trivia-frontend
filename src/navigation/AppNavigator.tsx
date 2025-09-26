import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { getVariantStyle } from '../theme/typography';
import { colors } from '../theme/colors';



// Auth Screens
import { LoginScreen } from '../features/auth/presentation/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/presentation/screens/RegisterScreen';
import { ForgotPasswordScreen } from '../features/auth/presentation/screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../features/auth/presentation/screens/ResetPasswordScreen';
import { ModeSelectionScreen } from '../features/auth/presentation/screens/ModeSelectionScreen';

// Purchase Screens
import { BuyPointsScreen } from '../screens/purchases/BuyPointsScreen';

// Main Screens
import { HomeScreen } from '../screens/main/HomeScreen';
import { CategoriesScreen } from '../features/trivia/presentation/screens/CategoriesScreen';
import { TriviaGameScreen } from '../features/game/presentation/screens/TriviaGameScreen';
import { PointsHistoryScreen } from '../screens/points/PointsHistoryScreen';
import { RewardsScreen } from '../screens/rewards/RewardsScreen';
import { RafflesScreen } from '../screens/raffles/RafflesScreen';
import { RouletteScreen } from '../screens/raffles/RouletteScreen';
import { MyRafflesScreen } from '../screens/raffles/MyRafflesScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { HelpScreen } from '../screens/profile/HelpScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { SurveysScreen } from '../screens/surveys/SurveysScreen';
import { TestimonialsScreen } from '../screens/testimonials/TestimonialsScreen';

// Types
import { RootStackParamList, MainTabParamList } from '@shared/domain/types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="ModeSelection" component={ModeSelectionScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="TriviaGame" component={TriviaGameScreen} />
        <Stack.Screen name="PointsHistory" component={PointsHistoryScreen} />
        <Stack.Screen name="BuyPoints" component={BuyPointsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />

        <Stack.Screen name="MyRaffles" component={MyRafflesScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="Surveys" component={SurveysScreen} />
        <Stack.Screen name="Testimonials" component={TestimonialsScreen} />
        <Stack.Screen name="Roulette" component={RouletteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainTabNavigator: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Rewards') {
            iconName = focused ? 'gift' : 'gift-outline';
          } else if (route.name === 'Raffles') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return (
            <AnimatedTabIcon
              name={iconName}
              size={size}
              color={color}
              focused={focused}
            />
          );
        },
        tabBarActiveTintColor: isDark ? colors.primary300 : colors.primary600,
        tabBarInactiveTintColor: isDark ? colors.muted : '#6c757d',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: colors.primary100,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          // Sombra / elevación para separar del contenido
          elevation: 14, // Android (más marcada)
          shadowColor: '#000', // iOS
          shadowOpacity: 0.22,
          shadowOffset: { width: 0, height: -3 },
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          ...getVariantStyle('caption'),
        },
        tabBarButton: (props) => (
          <TabBarTouchable {...props} />
        ),
        headerShown: false,
        tabBarItemStyle: {
          minHeight: 44,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          tabBarLabel: 'Inicio',
          tabBarAccessibilityLabel: 'Inicio, pestaña 1 de 5',
        }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoriesScreen}
        options={{ 
          tabBarLabel: 'Categorías',
          tabBarAccessibilityLabel: 'Categorías, pestaña 2 de 5',
        }}
      />
      <Tab.Screen 
        name="Rewards" 
        component={RewardsScreen}
        options={{ 
          tabBarLabel: 'Premios',
          tabBarAccessibilityLabel: 'Premios, pestaña 3 de 5',
        }}
      />
      <Tab.Screen 
        name="Raffles" 
        component={RafflesScreen}
        options={{ 
          tabBarLabel: 'Sorteos',
          tabBarAccessibilityLabel: 'Sorteos, pestaña 4 de 5',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          tabBarLabel: 'Perfil',
          tabBarAccessibilityLabel: 'Perfil, pestaña 5 de 5',
        }}
      />
    </Tab.Navigator>
  );
};


// Botón personalizado para mejorar accesibilidad, área táctil mínima y haptics
const TabBarTouchable: React.FC<any> = ({ onPress, onLongPress, accessibilityState, children, ...rest }) => {
  const handlePress = React.useCallback((e: any) => {
    if (!accessibilityState?.selected) {
      // Feedback ligero al cambiar de pestaña
      Haptics.selectionAsync().catch(() => {});
    }
    if (onPress) onPress(e);
  }, [onPress, accessibilityState?.selected]);

  return (
    <TouchableOpacity
      accessibilityRole="tab"
      accessibilityState={accessibilityState}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={handlePress}
      onLongPress={onLongPress}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
};

// Ícono animado con efecto spring al enfocarse
const AnimatedTabIcon: React.FC<{ name: keyof typeof Ionicons.glyphMap; size: number; color: string; focused: boolean }> = ({ name, size, color, focused }) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, { damping: 14, stiffness: 180, mass: 0.9 });
    translateY.value = withSpring(focused ? -2 : 0, { damping: 14, stiffness: 180, mass: 0.9 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
};

export { AppNavigator };
