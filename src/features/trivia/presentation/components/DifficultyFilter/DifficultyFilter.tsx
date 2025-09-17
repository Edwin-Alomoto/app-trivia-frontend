import React from 'react';
import { Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getVariantStyle } from '@theme/typography';
import { difficultyFilterStyles } from './DifficultyFilter.styles';

type DifficultyType = 'all' | 'easy' | 'medium' | 'hard';

interface DifficultyFilterProps {
  selectedDifficulty: DifficultyType;
  onDifficultyChange: (difficulty: DifficultyType) => void;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

const filterOptions = [
  { key: 'all' as const, label: 'Todas', icon: 'grid-outline' },
  { key: 'easy' as const, label: 'Fácil', icon: 'leaf-outline' },
  { key: 'medium' as const, label: 'Medio', icon: 'trending-up-outline' },
  { key: 'hard' as const, label: 'Difícil', icon: 'flame-outline' },
];

export const DifficultyFilter: React.FC<DifficultyFilterProps> = ({
  selectedDifficulty,
  onDifficultyChange,
  fadeAnim,
  slideAnim,
}) => {
  return (
    <Animated.View 
      style={[
        difficultyFilterStyles.filterContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={difficultyFilterStyles.filterScroll}
      >
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              difficultyFilterStyles.filterButton,
              selectedDifficulty === filter.key && difficultyFilterStyles.filterButtonActive
            ]}
            onPress={() => onDifficultyChange(filter.key)}
          >
            <LinearGradient
              colors={
                selectedDifficulty === filter.key 
                  ? ['#667eea', '#764ba2'] 
                  : ['#f8f9fa', '#e9ecef']
              }
              style={difficultyFilterStyles.filterButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={selectedDifficulty === filter.key ? '#fff' : '#6c757d'}
              />
              <Text style={[
                getVariantStyle('caption'),
                difficultyFilterStyles.filterButtonText,
                selectedDifficulty === filter.key && difficultyFilterStyles.filterButtonTextActive
              ]}>
                {filter.label}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
};
