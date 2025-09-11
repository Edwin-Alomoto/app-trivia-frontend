import { Raffle, UserRaffleParticipation, RaffleWinner } from '../../types';

export interface IRafflesService {
  getRaffles(): Promise<Raffle[]>;
  getUserParticipations(): Promise<UserRaffleParticipation[]>;
  participate(raffleId: string): Promise<{ participation: UserRaffleParticipation; requiredPoints: number }>;
  getWinners(): Promise<RaffleWinner[]>;
}


