import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getVariantStyle } from '@theme/typography';
import { gradients } from '@theme/gradients';
import { colors } from '@theme/colors';

import { Card } from '@shared/presentation/components/ui/Card';
import { Button } from '@shared/presentation/components/ui/Button';
import { useAppDispatch } from '../../shared/domain/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/domain/hooks/useAppSelector';
import { startTriviaSession, answerQuestion, resetSession, advanceQuestion, useHint } from '../../app/store/slices/triviaSlice';
import { earnPoints } from '../../app/store/slices/pointsSlice';
import { RootStackParamList } from '../../shared/domain/types';
import { featureFlags } from '../../app/config/featureFlags';
import { useTriviaGameViewModel } from '../../features/game/domain/hooks/useTriviaGameViewModel';
import { PointsParticles } from '@shared/presentation/animations/PointsParticles';

type TriviaGameRouteProp = RouteProp<RootStackParamList, 'TriviaGame'>;

const { width: screenWidth } = Dimensions.get('window');

export const TriviaGameScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<TriviaGameRouteProp>();
  const dispatch = useAppDispatch();
  const { currentSession, isLoading, categories } = useAppSelector((state: any) => state.trivia);
  const vm = featureFlags.useMVVMGame ? useTriviaGameViewModel(route.params.categoryId) : null;

  // Estados del juego
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<number[]>([]);
  const [imageFailed, setImageFailed] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  
  // Estados para validación de completitud
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [isTriviaComplete, setIsTriviaComplete] = useState(false);
  
  // Estados para el modal de trivia completada
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const questionAnimation = useRef(new Animated.Value(0)).current;
  const timerAnimation = useRef(new Animated.Value(1)).current;
  const scoreAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Referencias para evitar problemas de sincronización
  const currentQuestionRef = useRef<any>(null);
  const currentQuestionIndexRef = useRef<number>(0);

  const category = categories.find((cat: any) => cat.id === route.params.categoryId);

  const headerGradientColors: [string, string] = (gradients.header as unknown as [string, string]);

  // Inicializar el juego
  useEffect(() => {
    const initializeGame = async () => {
      if (vm) {
        // VM se encarga
      } else if (!currentSession) {
        try {
          await dispatch(startTriviaSession(route.params.categoryId)).unwrap();
        } catch (error) {
          Alert.alert('Error', 'No se pudo iniciar el juego. Inténtalo de nuevo.');
          navigation.goBack();
        }
      }
    };

    initializeGame();

    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  // Actualizar referencias cuando cambia la sesión
  useEffect(() => {
    if (currentSession && currentSession.questions) {
      currentQuestionIndexRef.current = currentSession.currentQuestionIndex || 0;
      currentQuestionRef.current = currentSession.questions[currentQuestionIndexRef.current];
      
      // Resetear estados para nueva pregunta
      if (!currentSession.isCompleted) {
        setSelectedAnswer(null);
        setIsAnswered(false);
        setTimeLeft(30);
        setShowHint(false);
        setFilteredOptions([]);
        setHintsUsed(0);
        setImageFailed(false);
        
        // Animación de la pregunta
        questionAnimation.setValue(0);
        Animated.spring(questionAnimation, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [currentSession?.currentQuestionIndex, currentSession?.isCompleted]);

  // Timer
  useEffect(() => {
    if (!currentSession || currentSession.isCompleted || isAnswered) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession, isAnswered]);

  // Animación del timer
  useEffect(() => {
    Animated.timing(timerAnimation, {
      toValue: timeLeft / 30,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [timeLeft]);

  const handleTimeUp = () => {
    if (!isAnswered && currentSession && !currentSession.isCompleted) {
      // Tiempo agotado - se considera incorrecta según UC-05
      Alert.alert(
        '¡Tiempo agotado!',
        'No respondiste a tiempo. La pregunta se marca como incorrecta.',
        [{ text: 'Entendido', style: 'default' }]
      );
      handleAnswer(-1);
    }
  };

  // Función para validar si todas las preguntas han sido contestadas
  const validateTriviaCompleteness = useCallback(() => {
    if (!currentSession || !currentSession.questions) return false;
    
    const totalQuestions = currentSession.questions.length;
    const answeredCount = answeredQuestions.size;
    
    return answeredCount === totalQuestions;
  }, [currentSession, answeredQuestions]);

  // Función para verificar si se puede mostrar el modal de completado
  const canShowCompletionModal = useCallback(() => {
    return validateTriviaCompleteness() && currentSession?.isCompleted;
  }, [validateTriviaCompleteness, currentSession]);

  const runShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleRetry = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setCorrectAnswersCount(0);
      await dispatch(startTriviaSession(route.params.categoryId)).unwrap();
    } catch (e) {
      Alert.alert('Error', 'No se pudo reintentar. Inténtalo de nuevo.');
    }
  };

  const handleReplay = async () => {
    try {
      setShowCompletionModal(false);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      dispatch(resetSession());
      setCorrectAnswersCount(0);
      await dispatch(startTriviaSession(route.params.categoryId)).unwrap();
    } catch (e) {
      Alert.alert('Error', 'No se pudo iniciar una nueva trivia.');
    }
  };

  const handleAnswer = async (answerIndex: number) => {
    // Prevenir múltiples respuestas
    if (isAnswered || !currentSession || currentSession.isCompleted) {
      return;
    }

    // Obtener la pregunta actual de forma segura
    const currentQuestionIndex = currentQuestionIndexRef.current;
    const currentQuestion = currentQuestionRef.current;
    
    if (!currentQuestion) {
      console.error('ERROR: No se encontró la pregunta en el índice:', currentQuestionIndex);
      Alert.alert('Error', 'No se encontró la pregunta actual');
      return;
    }

    // Bloquear inmediatamente
    setIsAnswered(true);
    setSelectedAnswer(answerIndex);

    // Marcar esta pregunta como contestada
    setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]));

    // Verificar si la respuesta es correcta
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
      setConfettiTrigger(true);
      setCorrectAnswersCount(prev => prev + 1);
    } else if (answerIndex !== -1) {
      runShake();
    }
    
    // Calcular puntos
    const basePoints = isCorrect ? currentQuestion.points : 0;
    const timeBonus = Math.max(1, (timeLeft / 30) * 1.5);
    const finalPoints = Math.floor(basePoints * timeBonus * comboMultiplier);

    // Actualizar racha
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      if (newStreak % 3 === 0) {
        setComboMultiplier(prev => prev + 0.5);
      }
    } else {
      setStreak(0);
      setComboMultiplier(1);
    }

    // Feedback háptico
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    // Animación de puntos
    if (isCorrect) {
      Animated.sequence([
        Animated.timing(scoreAnimation, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(scoreAnimation, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }

    // Procesar la respuesta - solo actualizar score interno, no otorgar puntos aún
    try {
      dispatch(answerQuestion({ isCorrect, points: finalPoints }));
      
      // NO otorgar puntos aquí - se otorgarán solo al completar todas las preguntas
      // Los puntos se acumulan internamente en el score de la sesión
    } catch (error) {
      console.error('Error procesando respuesta:', error);
      Alert.alert('Error', 'Hubo un problema procesando tu respuesta');
      return;
    }

    // Esperar y pasar a la siguiente pregunta o terminar el juego
    setTimeout(() => {
      if (!currentSession) return;
      const nextQuestionIndex = currentQuestionIndex + 1;
      
      // Verificar si es la última pregunta
      if (nextQuestionIndex >= currentSession.questions.length) {
        // Verificar si se contestaron todas las preguntas
        const allQuestionsAnswered = validateTriviaCompleteness();
        
        if (allQuestionsAnswered) {
          // Todas las preguntas contestadas - otorgar puntos completos
          const totalScore = currentSession.score + finalPoints;
          
          // Otorgar todos los puntos acumulados
          dispatch(earnPoints({
            amount: totalScore,
            description: `Trivia Completa - ${category?.name} (${currentSession.questions.length} preguntas)`,
            metadata: {
              triviaId: currentSession.id,
              categoryId: route.params.categoryId,
              streak: streak,
              questionsAnswered: currentSession.questions.length,
              completionRate: 100
            },
          }));
          
          setFinalScore(totalScore);
          setMaxStreak(streak);
          setIsTriviaComplete(true);
          setShowCompletionModal(true);
        } else {
          // No se contestaron todas las preguntas - no otorgar puntos
          Alert.alert(
            'Trivia Incompleta',
            'Debes contestar todas las preguntas para obtener los puntos. Los puntos no se han otorgado.',
            [{ text: 'Entendido', style: 'default' }]
          );
          
          setFinalScore(0);
          setMaxStreak(streak);
          setIsTriviaComplete(false);
          setShowCompletionModal(true);
        }
      } else {
        dispatch(advanceQuestion());
      }
    }, 900);
  };

  const handleUseHint = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const sessionHintsUsed = currentSession?.sessionHintsUsed ?? 0;
    if (sessionHintsUsed >= 2 || isAnswered || !currentSession) return;

    const currentQuestion = currentQuestionRef.current;
    if (!currentQuestion) return;

    // Si ya quedan 2 o menos opciones visibles, no aplicar
    const remainingIndices = currentQuestion.options
      .map((_: string, idx: number) => idx)
      .filter((idx: number) => !filteredOptions.includes(idx));
    if (remainingIndices.length <= 2) return;

    // Incrementar contador de sesión
    dispatch(useHint());

    // Seguimos usando estado local para el UI de esta pregunta
    setHintsUsed((prev) => prev + 1);

    // Mantener solo dos opciones posibles: la correcta y una incorrecta aleatoria
    const incorrectOptions = currentQuestion.options
      .map((option: string, index: number) => ({ option, index }))
      .filter(({ index }: { index: number }) => index !== currentQuestion.correctAnswer);

    const keepWrong = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)]?.index;
    const toFilter = incorrectOptions
      .map(({ index }: { index: number }) => index)
      .filter((idx: number) => idx !== keepWrong);

    // Deshabilitar las opciones filtradas hasta responder
    const uniqueFiltered = Array.from(new Set([...(filteredOptions || []), ...toFilter]));
    setFilteredOptions(uniqueFiltered);
    setShowHint(true);
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Omitir pregunta',
      '¿Estás seguro de que quieres omitir esta pregunta? Perderás puntos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Omitir',
          style: 'destructive',
          onPress: () => {
            setStreak(0);
            setComboMultiplier(1);
            dispatch(answerQuestion({ isCorrect: false, points: 0 }));
          },
        },
      ]
    );
  };

  // Obtener la pregunta actual de forma segura
  const currentQuestion = currentQuestionRef.current;
  const currentQuestionIndex = currentQuestionIndexRef.current;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando trivia...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentSession || !currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudo cargar la trivia</Text>
          <Text style={{ color: '#64748b', textAlign: 'center' }}>Revisa tu conexión o intenta nuevamente.</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={handleRetry}
          >
            <Text style={styles.errorButtonText}>Reintentar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PointsParticles trigger={confettiTrigger} onComplete={() => setConfettiTrigger(false)} />
      {/* Header con timer */}
      <LinearGradient
        colors={headerGradientColors}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            <Text style={[getVariantStyle('caption'), styles.progressText]}>
              Pregunta {currentQuestionIndex + 1} de {currentSession.questions.length}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentQuestionIndex + 1) / currentSession.questions.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={[getVariantStyle('caption'), styles.completionText]}>
              Contestadas: {answeredQuestions.size}/{currentSession.questions.length}
            </Text>
          </View>

          <Animated.View style={styles.timerContainer}>
            {(() => {
              const isCritical = timeLeft <= 10;
              const isWarning = timeLeft <= 20 && !isCritical;
              const timerBgColors = isCritical
                ? ['#ef4444', '#ef4444']
                : isWarning
                ? ['#f59e0b', '#f59e0b']
                : [colors.primary800, colors.primary600];
              const ringColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : colors.primary400;
              return (
                <>
                  <LinearGradient
                    colors={timerBgColors as [string, string]}
                    style={styles.timerGradient}
                  >
                    <Ionicons name="time-outline" size={20} color="#fff" />
                    <Text style={[getVariantStyle('subtitle'), styles.timerText]}>{timeLeft}s</Text>
                  </LinearGradient>
                
                  <View style={[styles.timerRing, { borderColor: `${ringColor}55` }]}>
                    <Animated.View
                      style={[
                        styles.timerRingFill,
                        {
                          borderColor: ringColor,
                          transform: [
                            {
                              rotate: timerAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg'],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  </View>
                </>
              );
            })()}
          </Animated.View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Pregunta */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          }}
        >
          <Card style={styles.questionCard}>
            <LinearGradient
              colors={[colors.surface, colors.primary025] as unknown as [string, string]}
              style={styles.questionGradient}
            >
              <View style={styles.categoryInfo}>
                <View style={styles.categoryIconContainer}>
                  <Text style={styles.categoryIcon}>{category?.icon || '🎯'}</Text>
                </View>
                <Text style={[getVariantStyle('subtitle'), styles.categoryName]}>{category?.name || 'Trivia'}</Text>
                {!!category?.difficulty && (
                  <View
                    style={[
                      styles.difficultyChip,
                      category.difficulty === 'easy'
                        ? styles.difficultyEasy
                        : category.difficulty === 'hard'
                        ? styles.difficultyHard
                        : styles.difficultyMedium,
                    ]}
                  >
                    <Text
                      style={[
                        styles.difficultyChipText,
                        category.difficulty === 'easy'
                          ? styles.difficultyEasyText
                          : category.difficulty === 'hard'
                          ? styles.difficultyHardText
                          : styles.difficultyMediumText,
                      ]}
                    >
                      {category.difficulty === 'easy'
                        ? 'Fácil'
                        : category.difficulty === 'hard'
                        ? 'Difícil'
                        : 'Media'}
                    </Text>
                  </View>
                )}
              </View>

              <Animated.View
                style={{
                  transform: [{ scale: questionAnimation }],
                }}
              >
                <Text style={[getVariantStyle('h2'), styles.questionText]}>
                  {currentQuestion.question || 'Cargando pregunta...'}
                </Text>
              </Animated.View>

              {currentQuestion.image && !imageFailed && (
                <Animated.View 
                  style={[
                    styles.imageContainer,
                    { transform: [{ scale: questionAnimation }] },
                  ]}
                >
                  <Image 
                    source={{ uri: currentQuestion.image }} 
                    style={styles.questionImage}
                    resizeMode="cover"
                    onError={() => setImageFailed(true)}
                    accessibilityLabel={'Imagen de la pregunta'}
                  />
                </Animated.View>
              )}
            </LinearGradient>
          </Card>
        </Animated.View>

        {/* Opciones de respuesta */}
        <Animated.View 
          style={[
            styles.answersContainer,
            { 
              opacity: fadeAnim, 
              transform: [
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          {currentQuestion.options && currentQuestion.options.length > 0 ? 
            currentQuestion.options.map((option: string, index: number) => {
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
                      styles.answerButton,
                      { backgroundColor, borderColor }
                    ]}
                    onPress={() => handleAnswer(index)}
                    disabled={isAnswered}
                  >
                    <View style={styles.answerContent}>
                      <View style={styles.answerLetter}>
                        <Text style={[getVariantStyle('caption'), styles.answerLetterText, { color: textColor }]}>
                          {String.fromCharCode(65 + index)}
                        </Text>
                      </View>
                      <Text style={[getVariantStyle('body'), styles.answerText, { color: textColor }]}>
                        {option}
                      </Text>
                    </View>
                    
                    {showCorrect && (
                      <View style={styles.answerIcon}>
                        <Ionicons name="checkmark-circle" size={24} color="#fff" />
                      </View>
                    )}
                    {showIncorrect && (
                      <View style={styles.answerIcon}>
                        <Ionicons name="close-circle" size={24} color="#fff" />
                      </View>
                    )}
                    {isFiltered && showHint && (
                      <View style={styles.answerIcon}>
                        <Ionicons name="bulb" size={20} color="#F59E0B" />
                      </View>
                    )}
                  </TouchableOpacity>
                  </Animated.View>
              );
            }) : (
              <View style={styles.noOptionsContainer}>
                <Text style={styles.noOptionsText}>Cargando opciones...</Text>
              </View>
            )
          }
        </Animated.View>

        {/* Botones de acción */}
        <Animated.View 
          style={[
            styles.actionsContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.hintButton}
              onPress={handleUseHint}
              disabled={(currentSession?.sessionHintsUsed ?? 0) >= 2 || isAnswered}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Usar pista"
              accessibilityHint="Elimina opciones incorrectas"
            >
              <LinearGradient
                colors={(currentSession?.sessionHintsUsed ?? 0) >= 2 ? ['#e5e7eb', '#cbd5e1'] : (gradients.brand as unknown as [string, string])}
                style={styles.hintButtonGradient}
              >
                <Ionicons name="bulb-outline" size={20} color="#fff" />
                <Text style={[getVariantStyle('subtitle'), styles.hintButtonText]}>
                  Pista ({Math.max(0, 2 - (currentSession?.sessionHintsUsed ?? 0))})
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Omitir pregunta"
              accessibilityHint="Pasa a la siguiente pregunta"
            >
              <Text style={[getVariantStyle('subtitle'), styles.skipButtonText]}>Omitir pregunta</Text>
            </TouchableOpacity>
          </View>

          {/* Indicador de pista removido a solicitud */}
        </Animated.View>
      </ScrollView>

      {/* Animación de puntos */}
      <Animated.View
        style={[
          styles.scoreAnimation,
          {
            opacity: scoreAnimation,
            transform: [
              {
                scale: scoreAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.5],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['#4CAF50', '#45a049']}
          style={styles.scoreAnimationGradient}
        >
          <Text style={[getVariantStyle('subtitle'), styles.scoreAnimationText]}>+{currentQuestion?.points || 0}</Text>
        </LinearGradient>
      </Animated.View>

      {/* Modal de Trivia Completada (compacta) */}
      <Modal
        visible={showCompletionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.completionModalContainer,
            isTriviaComplete ? styles.completeModalContainer : styles.incompleteModalContainer
          ]}>
            <LinearGradient
              colors={gradients.brand as [string, string]}
              style={[styles.completionModalHeader, { padding: 12 }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.completionModalHeaderContent}>
                <View style={styles.completionModalTitleContainer}>
                  <Ionicons 
                    name={isTriviaComplete ? "trophy" : "warning"} 
                    size={isTriviaComplete ? 32 : 28} 
                    color={colors.onPrimary} 
                    style={styles.completionModalTitleIcon} 
                  />
                  <Text style={[getVariantStyle('subtitle'), styles.completionModalTitle, { fontSize: 24, color: colors.onPrimary }]}>
                    {isTriviaComplete ? "¡Trivia Completada!" : "Trivia Incompleta"}
                  </Text>
                </View>
              </View>
              <Text style={[getVariantStyle('body'), styles.completionModalSubtitle, { fontSize: 14, color: colors.onPrimary }]}>
                {isTriviaComplete 
                  ? "¡Felicitaciones! Has contestado todas las preguntas y obtenido los puntos completos" 
                  : "Debes contestar todas las preguntas para obtener los puntos. Inténtalo de nuevo."
                }
              </Text>
            </LinearGradient>

            <ScrollView style={[styles.completionModalScroll, !isTriviaComplete && { maxHeight: '60%' }]}
              contentContainerStyle={[styles.completionModalContent, { padding: 12 }]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Animación de puntos ganados - solo si la trivia fue completada */}
              {isTriviaComplete && (
                <View style={[styles.completionPointsAnimation, { marginBottom: 12 }]}>
                  <LinearGradient
                    colors={['#F59E0B', '#FBBF24', '#FCD34D']}
                    style={[styles.completionPointsCircle, { width: 72, height: 72, borderRadius: 36 }]}
                  >
                    <Ionicons name="star" size={36} color="#fff" />
                  </LinearGradient>
                  <Text style={[getVariantStyle('subtitle'), styles.completionPointsText, { fontSize: 24 }]}>+{finalScore}</Text>
                  <Text style={[getVariantStyle('caption'), styles.completionPointsLabel, { fontSize: 12 }]}>puntos acumulados</Text>
                </View>
              )}
              
              {/* Mensaje para trivia incompleta */}
              {!isTriviaComplete && (
                <View style={[styles.completionPointsAnimation, { marginBottom: 20 }]}>
                  <View style={[styles.completionPointsCircle, { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ef4444' }]}>
                    <Ionicons name="close" size={30} color="#fff" />
                  </View>
                  <Text style={[getVariantStyle('subtitle'), styles.completionPointsText, { fontSize: 24, color: '#ef4444' }]}>0</Text>
                  <Text style={[getVariantStyle('caption'), styles.completionPointsLabel, { fontSize: 12, color: '#ef4444' }]}>puntos otorgados</Text>
                </View>
              )}
            </ScrollView>
                {/* Detalle de puntos por pregunta - solo si la trivia fue completada */}
                {isTriviaComplete && (
                  <View style={[styles.pointsBreakdown, { padding: 12, backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }]}>
                    <Text style={[getVariantStyle('subtitle'), styles.pointsBreakdownTitle, { fontSize: 13, color: '#1F2937' }]}>Desglose de puntos:</Text>
                    <View style={[styles.pointsBreakdownItem, { marginBottom: 4 }]}>
                      <Ionicons name="trophy" size={18} color="#F59E0B" />
                      <Text style={[getVariantStyle('body'), styles.pointsBreakdownText, { color: '#1F2937' }]}>
                        Aciertos: <Text style={[styles.pointsValue, { color: '#1F2937' }]}>{correctAnswersCount}</Text>
                      </Text>
                    </View>
                    <View style={[styles.pointsBreakdownItem, { marginBottom: 4 }]}>
                      <Ionicons name="clipboard" size={18} color="#3B82F6" />
                      <Text style={[getVariantStyle('body'), styles.pointsBreakdownText, { color: '#1F2937' }]}>
                        Correctas: <Text style={[styles.pointsValue, { color: '#1F2937' }]}>{correctAnswersCount}</Text>/{currentSession?.questions?.length || 0}
                      </Text>
                    </View>
                    <View style={[styles.pointsBreakdownItem, { marginBottom: 4 }]}>
                      <Ionicons name="hourglass" size={18} color="#F59E0B" />
                      <Text style={[getVariantStyle('body'), styles.pointsBreakdownText, { color: '#1F2937' }]}>
                        Pendientes: <Text style={[styles.pointsValue, { color: '#1F2937' }]}>{(currentSession?.questions?.length || 0) - answeredQuestions.size}</Text>
                      </Text>
                    </View>
                  </View>
                )}
                
                {/* Información de completitud */}
                {!isTriviaComplete && (
                  <View style={[styles.pointsBreakdown, { padding: 12, backgroundColor: '#FFFBEB', borderColor: '#FCD34D', paddingHorizontal: 24 }]}>
                    <Text style={[getVariantStyle('subtitle'), styles.pointsBreakdownTitle, { fontSize: 13, color: '#1F2937' }]}>Información:</Text>
                    <View style={[styles.pointsBreakdownItem, { marginBottom: 4 }]}> 
                      <Ionicons name="trophy" size={18} color="#F59E0B" />
                      <Text style={[getVariantStyle('body'), styles.pointsBreakdownText, { color: '#1F2937' }]}> 
                        Aciertos: {correctAnswersCount}
                      </Text>
                    </View>
                    <View style={[styles.pointsBreakdownItem, { marginBottom: 4 }]}>
                      <Ionicons name="clipboard" size={18} color="#3B82F6" />
                      <Text style={[getVariantStyle('body'), styles.pointsBreakdownText, { color: '#1F2937' }]}> 
                        Correctas: {correctAnswersCount}/{currentSession?.questions?.length || 0}
                      </Text>
                    </View>
                    <View style={[styles.pointsBreakdownItem, { marginBottom: 4 }]}>
                      <Ionicons name="hourglass" size={18} color="#F59E0B" />
                      <Text style={[getVariantStyle('body'), styles.pointsBreakdownText, { color: '#1F2937' }]}> 
                        Pendientes: {(currentSession?.questions?.length || 0) - answeredQuestions.size}
                      </Text>
                    </View>
                  </View>
                )}

              

            {/* Footer compacto con acciones */}
            <View style={[styles.completionModalFooter, { padding: isTriviaComplete ? 12 : 12 }]}>
              <View style={styles.completionFooterActions}>
                <TouchableOpacity style={[styles.completionSecondaryButton, !isTriviaComplete && { paddingVertical: 10, paddingHorizontal: 14 }]} onPress={() => {
                  setShowCompletionModal(false);
                  dispatch(resetSession());
                  navigation.goBack();
                }}>
                  <Text style={styles.completionSecondaryButtonText}>Salir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.completionPrimaryButton, !isTriviaComplete && { paddingVertical: 0 }]} onPress={handleReplay}>
                  <LinearGradient colors={['#10B981', '#34D399']} style={[styles.completionPrimaryButtonGradient, !isTriviaComplete && { paddingVertical: 10, paddingHorizontal: 14 }]}>
                    <Ionicons name="refresh" size={16} color="#fff" style={styles.completionContinueButtonIcon} />
                    <Text style={[styles.completionPrimaryButtonText, !isTriviaComplete && { fontSize: 14 }]}>Jugar de nuevo</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6c757d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  completionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  timerContainer: {
    position: 'relative',
  },
  timerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  timerRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  timerRingFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  questionCard: {
    marginBottom: 24,
  },
  questionGradient: {
    padding: 20,
    borderRadius: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  difficultyChip: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  difficultyChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyEasy: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  difficultyEasyText: {
    color: '#065f46',
  },
  difficultyMedium: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  difficultyMediumText: {
    color: '#92400e',
  },
  difficultyHard: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  difficultyHardText: {
    color: '#7f1d1d',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2d3748',
    lineHeight: 32,
    marginBottom: 16,
  },
  imageContainer: {
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  answersContainer: {
    marginBottom: 24,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  answerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  answerLetterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  answerText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
    lineHeight: 24,
  },
  answerIcon: {
    marginLeft: 8,
  },
  noOptionsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noOptionsText: {
    fontSize: 16,
    color: '#6c757d',
  },
  actionsContainer: {
    marginTop: 'auto',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hintButton: {
    flex: 1,
    marginRight: 12,
  },
  hintButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  hintButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  hintInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  hintInfoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  hintInfoText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '600',
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  scoreAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 1000,
  },
  scoreAnimationGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  scoreAnimationText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Estilos del Modal de Trivia Completada
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionModalContainer: {
    width: '92%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  incompleteModalContainer: {
    width: '85%',
    maxHeight: '62%',
    borderRadius: 20,
  },
  completeModalContainer: {
    width: '88%',
    maxHeight: '78%',
    borderRadius: 22,
  },
  completionModalHeader: {
    padding: 24,
    position: 'relative',
  },
  completionModalHeaderContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  completionModalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionModalTitleIcon: {
    marginRight: 12,
  },
  completionModalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  completionModalSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  completionModalContent: {
    padding: 24,
  },
  completionModalScroll: {
    width: '100%',
  },
  completionPointsAnimation: {
    alignItems: 'center',
    marginBottom: 32,
  },
  completionPointsCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  completionPointsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  completionPointsLabel: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  completionStatsSection: {
    marginBottom: 32,
  },
  completionStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  completionStatsIcon: {
    marginRight: 12,
  },
  completionStatsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  completionStatsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  completionStatCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completionStatGradient: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  completionStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  completionStatLabel: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  completionMotivationSection: {
    marginBottom: 32,
  },
  completionMotivationGradient: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  completionMotivationIcon: {
    marginBottom: 12,
  },
  completionMotivationTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  completionMotivationText: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24,
  },
  completionNextSteps: {
    marginBottom: 24,
  },
  completionNextStepsGradient: {
    padding: 24,
    borderRadius: 16,
  },
  completionNextStepsIcon: {
    marginBottom: 12,
  },
  completionNextStepsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  completionNextStepsList: {
    gap: 12,
  },
  completionNextStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completionNextStepText: {
    fontSize: 16,
    color: '#4a5568',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  completionModalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fafafa',
  },
  completionContinueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  completionContinueButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  completionContinueButtonIcon: {
    marginRight: 8,
  },
  completionContinueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  completionFooterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  completionSecondaryButton: {
    flex: 1.5,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  completionSecondaryButtonText: {
    color: '#111827',
    fontWeight: '600',
  },
  completionPrimaryButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  completionPrimaryButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  completionPrimaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  // Estilos para el desglose de puntos
  pointsBreakdown: {
    padding: 16,
    marginHorizontal: 24,
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pointsBreakdownTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3730A3',
    marginBottom: 10,
    textAlign: 'left',
  },
  pointsBreakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  pointsBreakdownText: {
    fontSize: 14,
    color: '#3730A3',
    marginLeft: 8,
    flex: 1,
  },
  pointsValue: {
    color: '#3730A3',
    fontWeight: '700',
  },
  pointsBreakdownDivider: {
    height: 1,
    backgroundColor: '#C7D2FE',
    marginVertical: 8,
    opacity: 0.8,
  },
  // Minimal modal styles
  simpleModalContent: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  simpleModalTitle: {
    color: '#111827',
  },
  simpleModalText: {
    color: '#374151',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  simplePrimaryButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  simplePrimaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  simpleSecondaryButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  simpleSecondaryButtonText: {
    color: '#111827',
    fontWeight: '600',
  },
});
