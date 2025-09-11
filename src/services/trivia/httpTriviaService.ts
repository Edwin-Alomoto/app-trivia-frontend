import { ITriviaService } from './types';
import { Category, TriviaSession } from '../../types';

export class HttpTriviaService implements ITriviaService {
  async getCategories(): Promise<Category[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }
  async startSession(categoryId: string): Promise<TriviaSession> {
    await new Promise((r) => setTimeout(r, 200));
    return {
      id: `session_${Date.now()}`,
      categoryId,
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      streak: 0,
      startTime: new Date().toISOString(),
      isCompleted: false,
    };
  }
}


