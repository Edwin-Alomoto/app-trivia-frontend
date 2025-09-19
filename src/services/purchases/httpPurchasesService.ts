import { IPurchasesService } from './types';
import { PointPackage } from '@shared/domain/types';

export class HttpPurchasesService implements IPurchasesService {
  async getPackages(): Promise<PointPackage[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }

  async purchase(packageId: string): Promise<{ packageId: string; points: number; amount: number; transactionId: string }> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      packageId,
      points: 0,
      amount: 0,
      transactionId: `txn_${Date.now()}`,
    };
  }
}


