import { IRafflesService } from './types';
import { Raffle, UserRaffleParticipation, RaffleWinner } from '@shared/domain/types';

export class HttpRafflesService implements IRafflesService {
  async getRaffles(): Promise<Raffle[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }
  async getUserParticipations(): Promise<UserRaffleParticipation[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }
  async participate(raffleId: string): Promise<{ participation: UserRaffleParticipation; requiredPoints: number }> {
    await new Promise((r) => setTimeout(r, 200));
    return {
      participation: {
        id: `participation_${Date.now()}`,
        raffleId,
        userId: '1',
        participationId: 'PART-XXX',
        participationDate: new Date().toISOString(),
        requiredPoints: 0,
        balanceBefore: 0,
        balanceAfter: 0,
        status: 'pending',
      },
      requiredPoints: 0,
    };
  }
  async getWinners(): Promise<RaffleWinner[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }
}


