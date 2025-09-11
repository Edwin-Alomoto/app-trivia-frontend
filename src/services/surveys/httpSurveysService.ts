import { ISurveysService } from './types';
import { Survey, SurveyResponse } from '../../store/slices/surveysSlice';

export class HttpSurveysService implements ISurveysService {
  async getSurveys(): Promise<Survey[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }
  async submitSurvey(params: { surveyId: string; responses: { questionId: string; answer: string | number | string[] }[] }): Promise<{ response: SurveyResponse; pointsEarned: number }> {
    await new Promise((r) => setTimeout(r, 200));
    return {
      response: {
        surveyId: params.surveyId,
        answers: params.responses,
        completedAt: new Date().toISOString(),
        pointsEarned: 0,
      },
      pointsEarned: 0,
    };
  }
}


