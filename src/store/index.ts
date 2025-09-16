import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/domain/store/authSlice';
import triviaReducer from './slices/triviaSlice';
import pointsReducer from './slices/pointsSlice';
import rewardsReducer from './slices/rewardsSlice';
import rafflesReducer from './slices/rafflesSlice';
import notificationsReducer from './slices/notificationsSlice';
import purchasesReducer from './slices/purchasesSlice';
import surveysReducer from './slices/surveysSlice';
import testimonialsReducer from './slices/testimonialsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trivia: triviaReducer,
    points: pointsReducer,
    rewards: rewardsReducer,
    raffles: rafflesReducer,

    notifications: notificationsReducer,
    purchases: purchasesReducer,
    surveys: surveysReducer,
    testimonials: testimonialsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
