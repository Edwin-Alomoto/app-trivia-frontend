export interface GameSession {
  id: string;
  categoryId: string;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  streak: number;
  startTime: string;
  isCompleted: boolean;
  answers: Answer[];
  sessionHintsUsed: number;
}

export interface Question {
  id: string;
  categoryId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  image?: string;
}

export interface Answer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeSpent: number;
  points: number;
}

export interface GameResult {
  sessionId: string;
  categoryId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  completedAt: string;
  answers: Answer[];
  isComplete: boolean;
}

export interface GameState {
  currentSession: GameSession | null;
  isLoading: boolean;
  error: string | null;
  selectedAnswer: number | null;
  isAnswered: boolean;
  timeLeft: number;
  streak: number;
  comboMultiplier: number;
  hintsUsed: number;
  showHint: boolean;
  filteredOptions: number[];
  imageFailed: boolean;
  confettiTrigger: boolean;
  correctAnswersCount: number;
  answeredQuestions: Set<number>;
  isTriviaComplete: boolean;
  showCompletionModal: boolean;
  finalScore: number;
  maxStreak: number;
}
