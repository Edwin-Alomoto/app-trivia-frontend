import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../shared/domain/hooks';
import { startTriviaSession, answerQuestion, resetSession, selectCurrentSession, selectTriviaLoading, advanceQuestion } from '../../app/store/slices/triviaSlice';
import { earnPoints } from '../../app/store/slices/pointsSlice';

export function useTriviaGameViewModel(categoryId: string) {
  const dispatch = useAppDispatch();
  const currentSession = useAppSelector(selectCurrentSession);
  const isLoading = useAppSelector(selectTriviaLoading);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [filteredOptions, setFilteredOptions] = useState<number[]>([]);

  const currentQuestionRef = useRef<any>(null);
  const currentQuestionIndexRef = useRef<number>(0);

  const initialize = useCallback(async () => {
    if (!currentSession) {
      await dispatch(startTriviaSession(categoryId));
    }
  }, [dispatch, categoryId, currentSession]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (currentSession && currentSession.questions) {
      currentQuestionIndexRef.current = currentSession.currentQuestionIndex || 0;
      currentQuestionRef.current = currentSession.questions[currentQuestionIndexRef.current];
      if (!currentSession.isCompleted) {
        setSelectedAnswer(null);
        setIsAnswered(false);
        setTimeLeft(30);
        setFilteredOptions([]);
        setHintsUsed(0);
      }
    }
  }, [currentSession?.currentQuestionIndex, currentSession?.isCompleted]);

  useEffect(() => {
    if (!currentSession || currentSession.isCompleted || isAnswered) return;
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

  const handleTimeUp = useCallback(() => {
    if (!isAnswered && currentSession && !currentSession.isCompleted) {
      handleAnswer(-1);
    }
  }, [isAnswered, currentSession]);

  const handleAnswer = useCallback(async (answerIndex: number) => {
    if (isAnswered || !currentSession || currentSession.isCompleted) return;
    const currentQuestionIndex = currentQuestionIndexRef.current;
    const currentQuestion = currentQuestionRef.current;
    
    // Validación robusta de la pregunta
    if (!currentQuestion || !currentSession.questions || currentQuestionIndex >= currentSession.questions.length) {
      console.error('ERROR VM: Pregunta no encontrada:', {
        currentQuestionIndex,
        questionsLength: currentSession.questions?.length,
        hasCurrentQuestion: !!currentQuestion
      });
      return;
    }

    setIsAnswered(true);
    setSelectedAnswer(answerIndex);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const basePoints = isCorrect ? currentQuestion.points : 0;
    const timeBonus = Math.max(1, (timeLeft / 30) * 1.5);
    const finalPoints = Math.floor(basePoints * timeBonus * comboMultiplier);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak % 3 === 0) setComboMultiplier((prev) => prev + 0.5);
    } else {
      setStreak(0);
      setComboMultiplier(1);
    }

    try {
      dispatch(answerQuestion({ isCorrect, points: finalPoints }));
      if (isCorrect) {
        dispatch(
          earnPoints({
            amount: finalPoints,
            description: `Trivia - ${categoryId} (Pregunta ${currentQuestionIndex + 1})`,
            metadata: { triviaId: currentSession.id, categoryId },
          })
        );
      }
    } catch {
      return;
    }

    setTimeout(() => {
      if (!currentSession) return;
      const nextIndex = (currentSession.currentQuestionIndex ?? 0) + 1;
      if (nextIndex < (currentSession.questions?.length ?? 0)) {
        dispatch(advanceQuestion());
      }
    }, 900);
  }, [isAnswered, currentSession, comboMultiplier, timeLeft, streak, dispatch, categoryId]);

  const handleUseHint = useCallback(() => {
    if (hintsUsed >= 2 || isAnswered || !currentSession || currentSession.isCompleted) return;
    const currentQuestion = currentQuestionRef.current;
    
    // Validación robusta para pistas
    if (!currentQuestion || !currentQuestion.options || currentQuestion.options.length === 0) {
      console.warn('VM: No se puede usar pista - pregunta inválida');
      return;
    }
    
    if (currentQuestion.correctAnswer === undefined || 
        currentQuestion.correctAnswer < 0 || 
        currentQuestion.correctAnswer >= currentQuestion.options.length) {
      console.warn('VM: No se puede usar pista - respuesta correcta inválida');
      return;
    }
    
    const incorrectOptions = currentQuestion.options
      .map((option: string, index: number) => ({ option, index }))
      .filter(({ index }: { index: number }) => index !== currentQuestion.correctAnswer);
    
    if (incorrectOptions.length === 0) {
      console.warn('VM: No hay opciones incorrectas para filtrar');
      return;
    }
    
    const randomIncorrect = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
    if (randomIncorrect) {
      setFilteredOptions((prev) => [...prev, randomIncorrect.index]);
      setHintsUsed((prev) => prev + 1);
    }
  }, [hintsUsed, isAnswered, currentSession]);

  const reset = useCallback(() => {
    dispatch(resetSession());
  }, [dispatch]);

  return {
    currentSession,
    isLoading,
    selectedAnswer,
    isAnswered,
    timeLeft,
    streak,
    comboMultiplier,
    hintsUsed,
    filteredOptions,
    handleAnswer,
    handleUseHint,
    handleTimeUp,
    reset,
  };
}


