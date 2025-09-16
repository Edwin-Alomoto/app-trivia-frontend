// Tipos de estado global compartidos

import { User } from './common';
import { 
  Category, 
  TriviaSession, 
  OfflineAnswer,
  PointBalance,
  PointTransaction,
  Reward,
  UserReward,
  Raffle,
  UserRaffleParticipation,
  RaffleWinner,
  Notification,
  PointPackage
} from './common';

// Estados específicos de cada feature
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

export interface RewardsState {
  available: Reward[];
  userRewards: UserReward[];
  isLoading: boolean;
  error: string | null;
  redemptionHistory: any[];
}

export interface RafflesState {
  active: Raffle[];
  userParticipations: UserRaffleParticipation[];
  isLoading: boolean;
  error: string | null;
  winners: RaffleWinner[];
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

// Estado global de la aplicación
export interface AppState {
  auth: any; // Se define en features/auth/domain/types
  trivia: TriviaState;
  points: PointsState;
  rewards: RewardsState;
  raffles: RafflesState;
  notifications: NotificationsState;
}
