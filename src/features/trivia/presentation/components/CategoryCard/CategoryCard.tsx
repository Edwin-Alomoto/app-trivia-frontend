import React from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getVariantStyle } from '@theme/typography';
import { Card } from '@shared/presentation/components/ui/Card';
import { Category } from '@/shared/domain/types';
import { categoryCardStyles } from './CategoryCard.styles';

interface CategoryCardProps {
  category: Category;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  scaleAnim: Animated.Value;
  pulseAnim: Animated.Value;
  onPress: (category: Category) => void;
  getCategoryGradientByName: (name: string) => [string, string];
  getDifficultyIcon: (difficulty: string) => string;
  getDifficultyText: (difficulty: string) => string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  fadeAnim,
  slideAnim,
  scaleAnim,
  pulseAnim,
  onPress,
  getCategoryGradientByName,
  getDifficultyIcon,
  getDifficultyText,
}) => {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <Card
        style={categoryCardStyles.categoryCard}
        onPress={() => onPress(category)}
      >
        <LinearGradient
          colors={getCategoryGradientByName(category.name)}
          style={categoryCardStyles.categoryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={categoryCardStyles.categoryHeader}>
            <View style={categoryCardStyles.categoryIconContainer}>
              <Text style={categoryCardStyles.categoryIcon}>{category.icon}</Text>
            </View>
            <View style={categoryCardStyles.difficultyBadge}>
              <Ionicons 
                name={getDifficultyIcon(category.difficulty) as any} 
                size={12} 
                color="#fff" 
              />
              <Text style={[
                getVariantStyle('caption'),
                categoryCardStyles.difficultyText,
                categoryCardStyles.whiteText
              ]}>
                {getDifficultyText(category.difficulty)}
              </Text>
            </View>
          </View>
          
          <Text style={[getVariantStyle('h2'), categoryCardStyles.categoryName]}>{category.name}</Text>
          <Text style={[getVariantStyle('body'), categoryCardStyles.categoryDescription]}>{category.description}</Text>
          
          <View style={categoryCardStyles.categoryFooter}>
            <View style={categoryCardStyles.categoryStats}>
              <Ionicons name="help-circle-outline" size={16} color="#fff" />
              <Text style={[getVariantStyle('caption'), categoryCardStyles.categoryStatsText]}>
                {category.questionCount} preguntas
              </Text>
            </View>
            
            <Animated.View 
              style={[
                categoryCardStyles.playButton,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Ionicons name="play" size={20} color="#fff" />
            </Animated.View>
          </View>

          <View style={categoryCardStyles.categoryOverlay}>
            <View style={categoryCardStyles.overlayCircle1} />
            <View style={categoryCardStyles.overlayCircle2} />
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  );
};
