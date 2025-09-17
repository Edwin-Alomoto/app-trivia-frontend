import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { gradients } from '@theme/gradients';
import { PointsParticles } from '@shared/presentation/animations/PointsParticles';
import { RootStackParamList } from '@/shared/domain/types';

import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { startTriviaSession, answerQuestion, resetSession, advanceQuestion, useHint as hintActionCreator } from '../../../../store/slices/triviaSlice';
import { earnPoints } from '../../../../store/slices/pointsSlice';
import { featureFlags as _featureFlags } from '../../../../config/featureFlags';
import { useTriviaGameViewModel } from '../../domain/hooks/useTriviaGameViewModel';
import { triviaGameScreenStyles } from './styles/TriviaGameScreen.styles';
import { ActionButtons } from '../components/ActionButtons';
import { AnswerOptions } from '../components/AnswerOptions';
import { TimerDisplay } from '../components/TimerDisplay';
import { ProgressBar } from '../components/ProgressBar';
import { QuestionCard } from '../components/QuestionCard';
import { PointsAnimation } from '../components/PointsAnimation';
import { CompletionModal } from '../components/CompletionModal';

type TriviaGameRouteProp = RouteProp<RootStackParamList, 'TriviaGame'>;

const { width: _screenWidth } = Dimensions.get('window');

export const TriviaGameScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<TriviaGameRouteProp>();
  const dispatch = useAppDispatch();
  const { currentSession, isLoading, categories } = useAppSelector((state: any) => state.trivia);
  const vm = useTriviaGameViewModel(route.params.categoryId);

  // Estados del juego
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [_hintsUsed, setHintsUsed] = useState(0);
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
  const [_maxStreak, setMaxStreak] = useState(0);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const questionAnimation = useRef(new Animated.Value(0)).current;
  const timerAnimation = useRef(new Animated.Value(1)).current;
  const scoreAnimation = useRef(new Animated.Value(0)).current;
  const _pulseAnim = useRef(new Animated.Value(1)).current;
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
  }, [fadeAnim, slideAnim, scaleAnim, currentSession, dispatch, navigation, route.params.categoryId, vm]);

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
  }, [currentSession, questionAnimation]);

  // Animación del timer
  useEffect(() => {
    Animated.timing(timerAnimation, {
      toValue: timeLeft / 30,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, timerAnimation]);

  // Función para validar si todas las preguntas han sido contestadas
  const validateTriviaCompleteness = useCallback(() => {
    if (!currentSession || !currentSession.questions) return false;
    
    const totalQuestions = currentSession.questions.length;
    const answeredCount = answeredQuestions.size;
    
    return answeredCount === totalQuestions;
  }, [currentSession, answeredQuestions]);

  const runShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const handleAnswer = useCallback(async (answerIndex: number) => {
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
              correctAnswers: correctAnswersCount,
            }
          }));
          
          // Marcar como completada
          setIsTriviaComplete(true);
          setFinalScore(totalScore);
          setShowCompletionModal(true);
        }
      } else {
        // Pasar a la siguiente pregunta
        dispatch(advanceQuestion());
      }
    }, 900);
  }, [isAnswered, currentSession, timeLeft, comboMultiplier, streak, scoreAnimation, dispatch, validateTriviaCompleteness, correctAnswersCount, route.params.categoryId, category?.name, runShake]);

  const handleTimeUp = useCallback(() => {
    if (!isAnswered && currentSession && !currentSession.isCompleted) {
      // Tiempo agotado - se considera incorrecta según UC-05
      Alert.alert(
        '¡Tiempo agotado!',
        'No respondiste a tiempo. La pregunta se marca como incorrecta.',
        [{ text: 'Entendido', style: 'default' }]
      );
      handleAnswer(-1);
    }
  }, [isAnswered, currentSession, handleAnswer]);

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
  }, [currentSession, isAnswered, handleTimeUp]);

  // Función para verificar si se puede mostrar el modal de completado
  const _canShowCompletionModal = useCallback(() => {
    return validateTriviaCompleteness() && currentSession?.isCompleted;
  }, [validateTriviaCompleteness, currentSession]);

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

  const _handleAnswer = async (answerIndex: number) => {
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
    dispatch(hintActionCreator());

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
      <SafeAreaView style={triviaGameScreenStyles.container}>
        <View style={triviaGameScreenStyles.loadingContainer}>
          <Text style={triviaGameScreenStyles.loadingText}>Cargando trivia...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentSession || !currentQuestion) {
    return (
      <SafeAreaView style={triviaGameScreenStyles.container}>
        <View style={triviaGameScreenStyles.errorContainer}>
          <Text style={triviaGameScreenStyles.errorText}>No se pudo cargar la trivia</Text>
          <Text style={triviaGameScreenStyles.inlineText}>Revisa tu conexión o intenta nuevamente.</Text>
          <TouchableOpacity
            style={triviaGameScreenStyles.errorButton}
            onPress={handleRetry}
          >
            <Text style={triviaGameScreenStyles.errorButtonText}>Reintentar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={triviaGameScreenStyles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={triviaGameScreenStyles.errorButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={triviaGameScreenStyles.container}>
      <PointsParticles trigger={confettiTrigger} onComplete={() => setConfettiTrigger(false)} />
      {/* Header con timer */}
      <LinearGradient
        colors={headerGradientColors}
        style={triviaGameScreenStyles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={triviaGameScreenStyles.headerContent}>
          <TouchableOpacity
            style={triviaGameScreenStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <ProgressBar
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={currentSession.questions.length}
            answeredQuestions={answeredQuestions}
          />

          <TimerDisplay
            timeLeft={timeLeft}
            timerAnimation={timerAnimation}
          />
        </View>
      </LinearGradient>

      <ScrollView
        style={triviaGameScreenStyles.content}
        contentContainerStyle={triviaGameScreenStyles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Pregunta */}
        <QuestionCard
          currentQuestion={currentQuestion}
          category={category}
          imageFailed={imageFailed}
          setImageFailed={setImageFailed}
          questionAnimation={questionAnimation}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          scaleAnim={scaleAnim}
        />

        {/* Opciones de respuesta */}
        <AnswerOptions
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          selectedAnswer={selectedAnswer}
          isAnswered={isAnswered}
          filteredOptions={filteredOptions}
          showHint={showHint}
          handleAnswer={handleAnswer}
          questionAnimation={questionAnimation}
          shakeAnim={shakeAnim}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
        />

        {/* Botones de acción */}
        <ActionButtons
          currentSession={currentSession}
          isAnswered={isAnswered}
          handleUseHint={handleUseHint}
          handleSkip={handleSkip}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
        />
      </ScrollView>

      {/* Animación de puntos */}
      <PointsAnimation
        scoreAnimation={scoreAnimation}
        currentQuestion={currentQuestion}
      />

      {/* Modal de Trivia Completada */}
      <CompletionModal
        showCompletionModal={showCompletionModal}
        isTriviaComplete={isTriviaComplete}
        finalScore={finalScore}
        correctAnswersCount={correctAnswersCount}
        currentSession={currentSession}
        answeredQuestions={answeredQuestions}
        setShowCompletionModal={setShowCompletionModal}
        handleReplay={handleReplay}
        dispatch={dispatch}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};
