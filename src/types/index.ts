// Tipos de usuario
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  alias: string;
  points: number;
  createdAt: string;
  preferences: UserPreferences;
  subscriptionStatus: 'subscribed' | 'demo' | 'expired' | 'not_subscribed';
  demoExpiresAt?: string;
  subscriptionExpiresAt?: string;
}

export interface UserPreferences {
  notifications: boolean;
  language: 'es' | 'en';
  sound: boolean;
  haptics: boolean;
}

// Tipos de autenticación
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  alias: string;
}

// Tipos de categorías y trivia
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Question {
  id: string;
  categoryId: string;
  question: string;
  image?: string;
  options: string[];
  correctAnswer: number;
  points: number;
  timeLimit?: number;
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
  sessionHintsUsed?: number; // Pistas usadas en toda la sesión
}

// Tipos de puntos y transacciones
export interface PointTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'spent' | 'purchased';
  amount: number;
  description: string;
  timestamp: string;
  metadata?: {
    triviaId?: string;
    categoryId?: string;
    raffleId?: string;
    rewardId?: string;
  };
}

export interface PointBalance {
  total: number;
  earned: number;
  spent: number;
  purchased: number;
  demo: number; // Puntos demo no canjeables
  real: number; // Puntos reales canjeables
}

// Tipos de premios
export interface Reward {
  id: string;
  name: string;
  description: string;
  image: string;
  pointsRequired: number;
  stock: number;
  expirationDate?: string;
  redemptionInstructions: string;
  category: 'food' | 'entertainment' | 'shopping' | 'gaming' | 'education' | 'other';
  value?: number; // Valor monetario del premio
  isActive?: boolean; // Si el premio está disponible
}

export interface UserReward {
  id: string;
  rewardId: string;
  userId: string;
  redeemedAt: string;
  redemptionCode: string;
  isUsed: boolean;
  expiresAt?: string;
  rewardName?: string; // Nombre del premio para mostrar
  rewardImage?: string; // Imagen del premio
  rewardCategory?: string; // Categoría del premio
}

// Tipos de sorteos
export interface Raffle {
  id: string;
  name: string;
  description: string;
  image: string;
  prize: string;
  requiredPoints: number; // Puntos requeridos para participar
  maxParticipants: number; // Máximo número de participantes
  currentParticipants: number; // Número actual de participantes
  drawDate: string;
  endDate: string; // Fecha de cierre del sorteo
  isActive: boolean;
  winners?: string[];
  category: 'electronics' | 'gaming' | 'travel' | 'shopping' | 'entertainment' | 'money' | 'other';
  title: string;
  rules?: string; // Reglas del sorteo
  prizeValue?: number; // Valor monetario del premio
}

export interface UserRaffleParticipation {
  id: string;
  raffleId: string;
  userId: string;
  participationId: string; // ID único de participación
  participationDate: string;
  requiredPoints: number; // Puntos utilizados
  balanceBefore: number; // Saldo antes de la participación
  balanceAfter: number; // Saldo después de la participación
  status: 'pending' | 'winner' | 'not_winner'; // Estado de la participación
  raffleName?: string; // Nombre del sorteo para mostrar
  raffleImage?: string; // Imagen del sorteo
}

// Tipos de ganadores de sorteos
export interface RaffleWinner {
  id: string;
  raffleId: string;
  raffleName: string;
  winnerName: string;
  winnerEmail: string;
  ticketNumber: string;
  drawDate: string;
  prize: string;
}

// Tipos de estado para sorteos
export interface RafflesState {
  active: Raffle[];
  userParticipations: UserRaffleParticipation[];
  isLoading: boolean;
  error: string | null;
  winners: RaffleWinner[];
}

// Tipos de estado para premios
export interface RewardsState {
  available: Reward[];
  userRewards: UserReward[];
  isLoading: boolean;
  error: string | null;
  redemptionHistory: any[];
}

// Tipos de notificaciones
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'points' | 'raffle' | 'reward' | 'general' | 'winner';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Tipos de compras
export interface PointPackage {
  id: string;
  name: string;
  points: number;
  price: number;
  currency: string;
  isPopular?: boolean;
  discount?: number;
}

// Tipos de estado global
export interface AppState {
  auth: AuthState;
  trivia: TriviaState;
  points: PointsState;
  rewards: RewardsState;
  raffles: RafflesState;
  notifications: NotificationsState;
}

export interface OfflineAnswer {
  sessionId: string;
  questionIndex: number;
  isCorrect: boolean;
  points: number;
  timestamp: string;
}

export interface TriviaState {
  categories: Category[];
  currentSession: TriviaSession | null;
  isLoading: boolean;
  error: string | null;
  offlineAnswers: OfflineAnswer[]; // Para sincronización offline según UC-05
}

export interface PointsState {
  balance: PointBalance;
  transactions: PointTransaction[];
  isLoading: boolean;
  error: string | null;
}

export interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface PurchaseState {
  packages: PointPackage[];
  isLoading: boolean;
  error: string | null;
  purchaseHistory: {
    packageId: string;
    points: number;
    amount: number;
    transactionId: string;
    timestamp: string;
  }[];
}

// Tipos de navegación
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: { email?: string };
  ModeSelection: undefined;
  MainTabs: undefined;
  TriviaGame: { categoryId: string };
  TriviaResults: { sessionId: string };
  RewardDetail: { rewardId: string };
  RaffleDetail: { raffleId: string };
  Profile: undefined;
  Settings: undefined;
  Notifications: undefined;
  PointHistory: undefined;
  PointsHistory: undefined;
  MyRewards: undefined;
  MyRaffles: undefined;
  BuyPoints: undefined;
  Surveys: undefined;
  Testimonials: undefined;
  Roulette: undefined;
  Help: undefined;

};

export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  Rewards: undefined;
  Raffles: undefined;
  Profile: undefined;
};

