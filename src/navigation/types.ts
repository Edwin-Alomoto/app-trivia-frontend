import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';

import type { RootStackParamList, MainTabParamList } from '../types';

export type RootStackNav = StackNavigationProp<RootStackParamList>;
export type MainTabNav = BottomTabNavigationProp<MainTabParamList>;

export type AppNavigationProp = CompositeNavigationProp<MainTabNav, RootStackNav>;

export const useAppNavigation = () => useNavigation<AppNavigationProp>();


