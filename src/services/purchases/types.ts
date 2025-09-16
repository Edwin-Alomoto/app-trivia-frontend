import { PointPackage } from '../../shared/domain/types';

export interface IPurchasesService {
  getPackages(): Promise<PointPackage[]>;
  purchase(packageId: string): Promise<{
    packageId: string;
    points: number;
    amount: number;
    transactionId: string;
  }>;
}


