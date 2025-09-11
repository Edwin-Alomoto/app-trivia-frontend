import { Category, TriviaSession } from '../../types';

export interface ITriviaService {
  getCategories(): Promise<Category[]>;
  startSession(categoryId: string): Promise<TriviaSession>;
}


