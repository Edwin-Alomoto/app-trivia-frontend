import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';

import { featureToggles } from '@config/featureToggles';

export interface SurveyQuestion {
  id: string;
  type: 'multiple_choice' | 'text' | 'rating';
  text: string;
  options?: string[];
  required: boolean;
  pointsReward?: number;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  isActive: boolean;
  expiresAt: string;
  pointsReward: number;
  estimatedTime: number; // en minutos
}

export interface SurveyResponse {
  surveyId: string;
  answers: {
    questionId: string;
    answer: string | number | string[];
  }[];
  completedAt: string;
  pointsEarned: number;
}

export interface SurveysState {
  surveys: Survey[];
  responses: SurveyResponse[];
  isLoading: boolean;
  error: string | null;
  currentSurvey: Survey | null;
}

const initialState: SurveysState = {
  surveys: [],
  responses: [],
  isLoading: false,
  error: null,
  currentSurvey: null,
};

// Mock data para encuestas
const mockSurveys: Survey[] = [
  {
    id: 'survey-1',
    title: 'Satisfacción con la App',
    description: 'Ayúdanos a mejorar tu experiencia con la aplicación de trivia',
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
    pointsReward: 50,
    estimatedTime: 3,
    questions: [
      {
        id: 'q1',
        type: 'rating',
        text: '¿Qué tan satisfecho estás con la aplicación?',
        required: true,
        pointsReward: 10,
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        text: '¿Qué categoría de trivia prefieres?',
        options: ['Cultura General', 'Cine y TV', 'Deportes', 'Historia', 'Ciencia'],
        required: true,
        pointsReward: 15,
      },
      {
        id: 'q3',
        type: 'text',
        text: '¿Qué funcionalidad te gustaría que agregáramos?',
        required: false,
        pointsReward: 25,
      },
    ],
  },
  {
    id: 'survey-2',
    title: 'Nuevas Categorías',
    description: 'Vota por las nuevas categorías que te gustaría ver',
    isActive: true,
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 días
    pointsReward: 30,
    estimatedTime: 2,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        text: '¿Qué nueva categoría te interesa más?',
        options: ['Música', 'Arte', 'Tecnología', 'Geografía', 'Literatura'],
        required: true,
        pointsReward: 30,
      },
    ],
  },
  {
    id: 'survey-3',
    title: 'Experiencia de Juego',
    description: 'Cuéntanos sobre tu experiencia jugando trivia',
    isActive: true,
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 días
    pointsReward: 75,
    estimatedTime: 5,
    questions: [
      {
        id: 'q1',
        type: 'rating',
        text: '¿Qué tan divertido encuentras el juego?',
        required: true,
        pointsReward: 15,
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        text: '¿Con qué frecuencia juegas?',
        options: ['Diariamente', '2-3 veces por semana', 'Semanalmente', 'Ocasionalmente'],
        required: true,
        pointsReward: 20,
      },
      {
        id: 'q3',
        type: 'text',
        text: '¿Qué te motiva a jugar trivia?',
        required: false,
        pointsReward: 25,
      },
      {
        id: 'q4',
        type: 'multiple_choice',
        text: '¿Prefieres jugar solo o con amigos?',
        options: ['Solo', 'Con amigos', 'Ambos por igual'],
        required: true,
        pointsReward: 15,
      },
    ],
  },
];

export const fetchSurveys = createAsyncThunk(
  'surveys/fetchSurveys',
  async (_, { rejectWithValue }) => {
    try {
      // Simulación existente
      await new Promise(resolve => setTimeout(resolve, 1000));
      const activeSurveys = mockSurveys.filter(survey => survey.isActive);
      return activeSurveys;
    } catch (error) {
      return rejectWithValue('Error al cargar las encuestas');
    }
  }
);

export const submitSurvey = createAsyncThunk(
  'surveys/submitSurvey',
  async (
    { surveyId, responses }: { surveyId: string; responses: { questionId: string; answer: string | number | string[] }[] },
    { rejectWithValue, dispatch }
  ) => {
    try {
      // Simulación existente
      await new Promise(resolve => setTimeout(resolve, 1500));
      const survey = mockSurveys.find(s => s.id === surveyId);
      if (!survey) {
        throw new Error('Encuesta no encontrada');
      }
      let totalPoints = 0;
      responses.forEach(({ questionId, answer }) => {
        const question = survey.questions.find(q => q.id === questionId);
        if (question && question.pointsReward && answer) {
          totalPoints += question.pointsReward;
        }
      });
      totalPoints += survey.pointsReward;
      const response: SurveyResponse = {
        surveyId,
        answers: responses,
        completedAt: new Date().toISOString(),
        pointsEarned: totalPoints,
      };
      return { response, pointsEarned: totalPoints };
    } catch (error) {
      return rejectWithValue('Error al enviar la encuesta');
    }
  }
);

const surveysSlice = createSlice({
  name: 'surveys',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentSurvey: (state, action: PayloadAction<Survey | null>) => {
      state.currentSurvey = action.payload;
    },
    clearCurrentSurvey: (state) => {
      state.currentSurvey = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurveys.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSurveys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.surveys = action.payload;
      })
      .addCase(fetchSurveys.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(submitSurvey.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitSurvey.fulfilled, (state, action) => {
        state.isLoading = false;
        state.responses.push(action.payload.response);
        state.currentSurvey = null;
      })
      .addCase(submitSurvey.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentSurvey, clearCurrentSurvey } = surveysSlice.actions;
export default surveysSlice.reducer;

// Selectores memoizados
export const selectSurveysState = (state: any) => state.surveys as import('./surveysSlice').SurveysState;
export const selectSurveys = createSelector(selectSurveysState, (s) => s.surveys);
export const selectCurrentSurvey = createSelector(selectSurveysState, (s) => s.currentSurvey);
export const selectSurveysLoading = createSelector(selectSurveysState, (s) => s.isLoading);
export const selectSurveysError = createSelector(selectSurveysState, (s) => s.error);
