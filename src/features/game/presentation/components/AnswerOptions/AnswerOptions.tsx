import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getVariantStyle } from '@theme/typography';
import { answerOptionsStyles } from './AnswerOptions.styles';

interface AnswerOptionsProps {
  currentQuestion: {
    options: string[];
    correctAnswer: number;
  };
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  isAnswered: boolean;
  filteredOptions: number[];
  showHint: boolean;
  handleAnswer: (index: number) => void;
  questionAnimation: Animated.Value;
  shakeAnim: Animated.Value;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  currentQuestion,
  currentQuestionIndex,
  selectedAnswer,
  isAnswered,
  filteredOptions,
  showHint,
  handleAnswer,
  questionAnimation,
  shakeAnim,
  fadeAnim,
  slideAnim,
}) => {
  const getAnswerStyle = (index: number) => {
    const isSelected = selectedAnswer === index;
    const isCorrect = index === currentQuestion.correctAnswer;
    const showCorrect = isAnswered && isCorrect;
    const showIncorrect = isAnswered && isSelected && !isCorrect;
    const isFiltered = filteredOptions.includes(index);

    let backgroundColor = '#fff';
    let borderColor = '#e2e8f0';
    let textColor = '#2d3748';
    let opacity = 1;

    if (isFiltered) {
      // Ocultaremos completamente las opciones filtradas por pista
      opacity = 0;
    } else if (showCorrect) {
      backgroundColor = '#4CAF50';
      borderColor = '#4CAF50';
      textColor = '#fff';
    } else if (showIncorrect) {
      backgroundColor = '#F44336';
      borderColor = '#F44336';
      textColor = '#fff';
    } else if (isSelected && !isAnswered) {
      backgroundColor = '#667eea';
      borderColor = '#667eea';
      textColor = '#fff';
    }

    return { backgroundColor, borderColor, textColor, opacity };
  };

  const renderAnswerOption = (option: string, index: number) => {
    const isSelected = selectedAnswer === index;
    const isCorrect = index === currentQuestion.correctAnswer;
    const showCorrect = isAnswered && isCorrect;
    const showIncorrect = isAnswered && isSelected && !isCorrect;
    const isFiltered = filteredOptions.includes(index);
    const { backgroundColor, borderColor, textColor, opacity } = getAnswerStyle(index);

    return isFiltered ? null : (
      <Animated.View
        key={`${currentQuestionIndex}-${index}`}
        style={{
          transform: [
            { scale: questionAnimation },
            { translateX: showIncorrect ? shakeAnim : 0 },
          ],
          opacity,
        }}
      >
        <TouchableOpacity
          style={[
            answerOptionsStyles.answerButton,
            { backgroundColor, borderColor }
          ]}
          onPress={() => handleAnswer(index)}
          disabled={isAnswered}
        >
          <View style={answerOptionsStyles.answerContent}>
            <View style={answerOptionsStyles.answerLetter}>
              <Text style={[getVariantStyle('caption'), answerOptionsStyles.answerLetterText, { color: textColor }]}>
                {String.fromCharCode(65 + index)}
              </Text>
            </View>
            <Text style={[getVariantStyle('body'), answerOptionsStyles.answerText, { color: textColor }]}>
              {option}
            </Text>
          </View>
          
          {showCorrect && (
            <View style={answerOptionsStyles.answerIcon}>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
            </View>
          )}
          {showIncorrect && (
            <View style={answerOptionsStyles.answerIcon}>
              <Ionicons name="close-circle" size={24} color="#fff" />
            </View>
          )}
          {isFiltered && showHint && (
            <View style={answerOptionsStyles.answerIcon}>
              <Ionicons name="bulb" size={20} color="#F59E0B" />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.View 
      style={[
        answerOptionsStyles.answersContainer,
        { 
          opacity: fadeAnim, 
          transform: [
            { translateY: slideAnim },
          ],
        },
      ]}
    >
      {currentQuestion.options && currentQuestion.options.length > 0 ? 
        currentQuestion.options.map((option: string, index: number) => renderAnswerOption(option, index)) : (
          <View style={answerOptionsStyles.noOptionsContainer}>
            <Text style={answerOptionsStyles.noOptionsText}>Cargando opciones...</Text>
          </View>
        )
      }
    </Animated.View>
  );
};
