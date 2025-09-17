import React from 'react';
import { View, Text } from 'react-native';
import { getVariantStyle } from '@theme/typography';
import { progressBarStyles } from './ProgressBar.styles';

interface ProgressBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentQuestionIndex,
  totalQuestions,
  answeredQuestions,
}) => {
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const answeredCount = answeredQuestions.size;

  return (
    <View style={progressBarStyles.progressContainer}>
      <Text style={[getVariantStyle('caption'), progressBarStyles.progressText]}>
        Pregunta {currentQuestionIndex + 1} de {totalQuestions}
      </Text>
      <View style={progressBarStyles.progressBar}>
        <View 
          style={[
            progressBarStyles.progressFill, 
            { width: `${progressPercentage}%` }
          ]} 
        />
      </View>
      <Text style={[getVariantStyle('caption'), progressBarStyles.completionText]}>
        Contestadas: {answeredCount}/{totalQuestions}
      </Text>
    </View>
  );
};
