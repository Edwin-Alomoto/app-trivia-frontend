export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  color?: string;
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
}

export interface TriviaSession {
  id: string;
  categoryId: string;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  streak: number;
  startTime: string;
  isCompleted: boolean;
  answers: Answer[];
}

export interface Answer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeSpent: number;
  points: number;
}

export interface TriviaResult {
  sessionId: string;
  categoryId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  completedAt: string;
  answers: Answer[];
}

export type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';
