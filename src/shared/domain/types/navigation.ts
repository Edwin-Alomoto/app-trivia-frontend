// Tipos de navegación global

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
