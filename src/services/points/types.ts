import { PointBalance, PointTransaction } from '@shared/domain/types';

export interface IPointsService {
  getBalance(): Promise<PointBalance>;
  getTransactions(): Promise<PointTransaction[]>;
  purchasePoints(packageId: string): Promise<{ transaction: PointTransaction; points: number }>;
  spendPoints(params: { amount: number; description: string; metadata?: any }): Promise<{ transaction: PointTransaction; amount: number }>;
  earnPoints(params: { amount: number; description: string; metadata?: any }): Promise<{ transaction: PointTransaction; amount: number; isDemo: boolean }>;
}


