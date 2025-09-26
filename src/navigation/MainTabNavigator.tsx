import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { getVariantStyle } from '../theme/typography';
import { colors } from '../theme/colors';

// Main Screens
import { HomeScreen } from '../screens/main/HomeScreen';
import { CategoriesScreen } from '../features/trivia/presentation/screens/CategoriesScreen';
import { RewardsScreen } from '../screens/rewards/RewardsScreen';
import { RafflesScreen } from '../screens/raffles/RafflesScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

// Types
import { MainTabParamList } from '@shared/domain/types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const AnimatedTabIcon = Animated.createAnimatedComponent(Ionicons);

export const MainTabNavigator: React.FC = () => {
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
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            />
          );
        },
        tabBarActiveTintColor: colors.primary600,
        tabBarInactiveTintColor: isDark ? colors.muted : colors.textSecondary,
        tabBarStyle: {
          backgroundColor: isDark ? colors.surface : colors.background,
          borderTopColor: isDark ? colors.border : colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter_500Medium',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
        }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoriesScreen}
        options={{
          tabBarLabel: 'Categorías',
        }}
      />
      <Tab.Screen 
        name="Rewards" 
        component={RewardsScreen}
        options={{
          tabBarLabel: 'Premios',
        }}
      />
      <Tab.Screen 
        name="Raffles" 
        component={RafflesScreen}
        options={{
          tabBarLabel: 'Sorteos',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};
