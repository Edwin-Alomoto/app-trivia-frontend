import { Reward, UserReward } from '../../types';

export interface IRewardsService {
  getRewards(): Promise<Reward[]>;
  getUserRewards(): Promise<UserReward[]>;
  redeemReward(rewardId: string): Promise<{ userReward: UserReward; pointsSpent: number }>;
  markAsUsed(userRewardId: string): Promise<string>;
}


