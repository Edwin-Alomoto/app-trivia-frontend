import { Category, TriviaSession } from '@shared/domain/types';

export interface ITriviaService {
  getCategories(): Promise<Category[]>;
  startSession(categoryId: string): Promise<TriviaSession>;
}


