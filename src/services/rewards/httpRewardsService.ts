import { IRewardsService } from './types';
import { Reward, UserReward } from '@shared/domain/types';

export class HttpRewardsService implements IRewardsService {
  async getRewards(): Promise<Reward[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }
  async getUserRewards(): Promise<UserReward[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }
  async redeemReward(rewardId: string): Promise<{ userReward: UserReward; pointsSpent: number }> {
    await new Promise((r) => setTimeout(r, 200));
    return {
      userReward: {
        id: `ur_${Date.now()}`,
        rewardId,
        userId: '1',
        redeemedAt: new Date().toISOString(),
        redemptionCode: 'CODE-12345',
        isUsed: false,
      },
      pointsSpent: 100,
    };
  }
  async markAsUsed(userRewardId: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 150));
    return userRewardId;
  }
}


