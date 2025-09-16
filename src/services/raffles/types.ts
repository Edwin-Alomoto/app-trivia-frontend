import { Raffle, UserRaffleParticipation, RaffleWinner } from '../../shared/domain/types';

export interface IRafflesService {
  getRaffles(): Promise<Raffle[]>;
  getUserParticipations(): Promise<UserRaffleParticipation[]>;
  participate(raffleId: string): Promise<{ participation: UserRaffleParticipation; requiredPoints: number }>;
  getWinners(): Promise<RaffleWinner[]>;
}


