import React from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getVariantStyle } from '@theme/typography';
import { colors } from '@theme/colors';
import { Card } from '@shared/presentation/components/ui/Card';
import { questionCardStyles } from './QuestionCard.styles';

interface QuestionCardProps {
  currentQuestion: {
    question: string;
    image?: string;
  };
  category?: {
    icon?: string;
    name?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
  imageFailed: boolean;
  setImageFailed: (failed: boolean) => void;
  questionAnimation: Animated.Value;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  currentQuestion,
  category,
  imageFailed,
  setImageFailed,
  questionAnimation,
  fadeAnim,
  slideAnim,
  scaleAnim,
}) => {
  const getDifficultyInfo = () => {
    if (!category?.difficulty) return null;
    
    const difficulty = category.difficulty;
    const difficultyText = difficulty === 'easy' ? 'Fácil' : difficulty === 'hard' ? 'Difícil' : 'Media';
    
    const difficultyStyle = difficulty === 'easy'
      ? questionCardStyles.difficultyEasy
      : difficulty === 'hard'
      ? questionCardStyles.difficultyHard
      : questionCardStyles.difficultyMedium;
    
    const difficultyTextStyle = difficulty === 'easy'
      ? questionCardStyles.difficultyEasyText
      : difficulty === 'hard'
      ? questionCardStyles.difficultyHardText
      : questionCardStyles.difficultyMediumText;

    return { difficultyText, difficultyStyle, difficultyTextStyle };
  };

  const difficultyInfo = getDifficultyInfo();

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <Card style={questionCardStyles.questionCard}>
        <LinearGradient
          colors={[colors.surface, colors.primary025] as unknown as [string, string]}
          style={questionCardStyles.questionGradient}
        >
          <View style={questionCardStyles.categoryInfo}>
            <View style={questionCardStyles.categoryIconContainer}>
              <Text style={questionCardStyles.categoryIcon}>{category?.icon || '🎯'}</Text>
            </View>
            <Text style={[getVariantStyle('subtitle'), questionCardStyles.categoryName]}>
              {category?.name || 'Trivia'}
            </Text>
            {difficultyInfo && (
              <View style={[questionCardStyles.difficultyChip, difficultyInfo.difficultyStyle]}>
                <Text style={[questionCardStyles.difficultyChipText, difficultyInfo.difficultyTextStyle]}>
                  {difficultyInfo.difficultyText}
                </Text>
              </View>
            )}
          </View>

          <Animated.View
            style={{
              transform: [{ scale: questionAnimation }],
            }}
          >
            <Text style={[getVariantStyle('h2'), questionCardStyles.questionText]}>
              {currentQuestion.question || 'Cargando pregunta...'}
            </Text>
          </Animated.View>

          {currentQuestion.image && !imageFailed && (
            <Animated.View 
              style={[
                questionCardStyles.imageContainer,
                { transform: [{ scale: questionAnimation }] },
              ]}
            >
              <Image 
                source={{ uri: currentQuestion.image }} 
                style={questionCardStyles.questionImage as any}
                resizeMode="cover"
                onError={() => setImageFailed(true)}
                accessibilityLabel={'Imagen de la pregunta'}
              />
            </Animated.View>
          )}
        </LinearGradient>
      </Card>
    </Animated.View>
  );
};
