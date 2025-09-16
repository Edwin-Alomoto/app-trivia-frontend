import { IPointsService } from './types';
import { PointBalance, PointTransaction } from '../../shared/domain/types';

export class HttpPointsService implements IPointsService {
  async getBalance(): Promise<PointBalance> {
    await new Promise((r) => setTimeout(r, 200));
    return {
      total: 0,
      earned: 0,
      spent: 0,
      purchased: 0,
      demo: 0,
      real: 0,
    };
  }

  async getTransactions(): Promise<PointTransaction[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }

  async purchasePoints(packageId: string): Promise<{ transaction: PointTransaction; points: number }> {
    await new Promise((r) => setTimeout(r, 200));
    const transaction: PointTransaction = {
      id: `tx_${Date.now()}`,
      userId: '1',
      type: 'purchased',
      amount: 100,
      description: `Compra paquete ${packageId}`,
      timestamp: new Date().toISOString(),
    };
    return { transaction, points: 100 };
  }

  async spendPoints(params: { amount: number; description: string; metadata?: any }): Promise<{ transaction: PointTransaction; amount: number }> {
    await new Promise((r) => setTimeout(r, 200));
    const transaction: PointTransaction = {
      id: `tx_${Date.now()}`,
      userId: '1',
      type: 'spent',
      amount: -params.amount,
      description: params.description,
      timestamp: new Date().toISOString(),
      metadata: params.metadata,
    };
    return { transaction, amount: params.amount };
  }

  async earnPoints(params: { amount: number; description: string; metadata?: any }): Promise<{ transaction: PointTransaction; amount: number; isDemo: boolean }> {
    await new Promise((r) => setTimeout(r, 200));
    const transaction: PointTransaction = {
      id: `tx_${Date.now()}`,
      userId: '1',
      type: 'earned',
      amount: params.amount,
      description: params.description,
      timestamp: new Date().toISOString(),
      metadata: params.metadata,
    };
    return { transaction, amount: params.amount, isDemo: false };
  }
}


