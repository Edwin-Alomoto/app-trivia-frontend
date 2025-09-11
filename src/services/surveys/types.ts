import { Survey, SurveyResponse } from '../../store/slices/surveysSlice';

export interface ISurveysService {
  getSurveys(): Promise<Survey[]>;
  submitSurvey(params: { surveyId: string; responses: { questionId: string; answer: string | number | string[] }[] }): Promise<{ response: SurveyResponse; pointsEarned: number }>;
}


