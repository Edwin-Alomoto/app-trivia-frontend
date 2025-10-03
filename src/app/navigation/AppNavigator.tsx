import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useLanguage } from '@shared/domain/contexts/LanguageContext';

// Auth Screens
import { LoginScreen } from '@features/auth/presentation/screens/LoginScreen';
import { RegisterScreen } from '@features/auth/presentation/screens/RegisterScreen';
import { ForgotPasswordScreen } from '@features/auth/presentation/screens/ForgotPasswordScreen';
import { ChangePasswordScreen } from '@features/auth/presentation/screens/ChangePasswordScreen';
import { ModeSelectionScreen } from '@features/auth/presentation/screens/ModeSelectionScreen';
// Purchase Screens
import { BuyPointsScreen } from '@features/purchases/presentation/screens/BuyPointsScreen';
// Main Screens
import { HomeScreen } from '@features/main/presentation/screens/HomeScreen';
import { CategoriesScreen } from '@features/main/presentation/screens/CategoriesScreen';
import { TriviaGameScreen } from '@features/game/presentation/screens/TriviaGameScreen';
import { PointsHistoryScreen } from '@features/points/presentation/screens/PointsHistoryScreen';
import { RewardsScreen } from '@features/rewards/presentation/screens/RewardsScreen';
import { RafflesScreen } from '@features/raffles/presentation/screens/RafflesScreen';
import { RouletteScreen } from '@features/raffles/presentation/screens/RouletteScreen';
import { MyRafflesScreen } from '@features/raffles/presentation/screens/MyRafflesScreen';
import { ProfileScreen } from '@features/profile/presentation/screens/ProfileScreen';
import { SettingsScreen } from '@features/profile/presentation/screens/SettingsScreen';
import { HelpScreen } from '@features/profile/presentation/screens/HelpScreen';
import { NotificationsScreen } from '@features/notifications/presentation/screens/NotificationsScreen';
import { SurveysScreen } from '@features/surveys/presentation/screens/SurveysScreen';
import { TestimonialsScreen } from '@features/testimonials/presentation/screens/TestimonialsScreen';
// Types
import { RootStackParamList, MainTabParamList } from '@shared/domain/types';
import { useAppSelector } from '@shared/domain/hooks/useAppSelector';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Ícono animado con efecto spring al enfocarse
const AnimatedTabIcon: React.FC<{ name: keyof typeof Ionicons.glyphMap; size: number; color: string; focused: boolean }> = ({ name, size, color, focused }) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, { damping: 14, stiffness: 180, mass: 0.9 });
    translateY.value = withSpring(focused ? -2 : 0, { damping: 14, stiffness: 180, mass: 0.9 });
  }, [focused, scale, translateY]);

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


const AppNavigator: React.FC = () => {
  const token = useAppSelector((s) => s.auth.token);
  const initialRouteName = token ? 'MainTabs' : 'Login';
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName as any}>
        {!token && (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
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
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  
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
        tabBarActiveTintColor: '#efb810',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.8)',
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopWidth: 1,
          borderTopColor: '#efb810',
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          height: 80 + Math.max(insets.bottom, 0),
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: -4 },
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
          color: '#ffffff',
        },
        tabBarLabelPosition: 'below-icon',
        tabBarButton: undefined,
        headerShown: false,
        tabBarItemStyle: {
          minHeight: 60,
          paddingVertical: 4,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          tabBarLabel: t('nav.home'),
          tabBarAccessibilityLabel: `${t('nav.home')}, pestaña 1 de 5`,
        }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoriesScreen}
        options={{ 
          tabBarLabel: t('nav.trivia'),
          tabBarAccessibilityLabel: `${t('nav.trivia')}, pestaña 2 de 5`,
        }}
      />
      <Tab.Screen 
        name="Rewards" 
        component={RewardsScreen}
        options={{ 
          tabBarLabel: t('nav.rewards'),
          tabBarAccessibilityLabel: `${t('nav.rewards')}, pestaña 3 de 5`,
        }}
      />
      <Tab.Screen 
        name="Raffles" 
        component={RafflesScreen}
        options={{ 
          tabBarLabel: t('nav.raffles'),
          tabBarAccessibilityLabel: `${t('nav.raffles')}, pestaña 4 de 5`,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          tabBarLabel: t('nav.profile'),
          tabBarAccessibilityLabel: `${t('nav.profile')}, pestaña 5 de 5`,
        }}
      />
    </Tab.Navigator>
  );
};

export { AppNavigator };
