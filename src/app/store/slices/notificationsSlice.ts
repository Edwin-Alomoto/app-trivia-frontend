import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

import { featureToggles } from '@config/featureToggles';
import { NotificationsState, Notification } from '@shared/domain/types';

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const notifications: Notification[] = [
        {
          id: '1',
          userId: '1',
          title: '¡Ganaste puntos!',
          message: 'Obtuviste 50 puntos por completar la trivia de Historia',
          type: 'points',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          actionUrl: '/points',
        },
        {
          id: '2',
          userId: '1',
          title: 'Nuevo sorteo disponible',
          message: 'Participa en el sorteo del iPhone 15 Pro por solo 50 puntos',
          type: 'raffle',
          isRead: false,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          actionUrl: '/raffles/1',
        },
        {
          id: '3',
          userId: '1',
          title: 'Premio canjeado',
          message: 'Tu entrada de cine ha sido canjeada exitosamente',
          type: 'reward',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          actionUrl: '/rewards',
        },
        {
          id: '4',
          userId: '1',
          title: '¡Felicitaciones!',
          message: 'Has completado 10 trivias esta semana',
          type: 'general',
          isRead: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      
      return notifications;
    } catch (error) {
      return rejectWithValue('Error al cargar notificaciones');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return notificationId;
    } catch (error) {
      return rejectWithValue('Error al marcar como leída');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return null;
    } catch (error) {
      return rejectWithValue('Error al marcar todas como leídas');
    }
  }
);

// Función para crear notificación de ganador de sorteo
export const createWinnerNotification = createAsyncThunk(
  'notifications/createWinnerNotification',
  async (winnerData: {
    raffleName: string;
    prizeAmount: number;
    prizeType: string;
    raffleId: string;
  }, { rejectWithValue }) => {
    try {
      const notification: Notification = {
        id: `winner-${Date.now()}`,
        userId: '1', // Esto debería venir del usuario actual
        title: '🎉 ¡FELICIDADES! ¡Has ganado un sorteo!',
        message: `Ganaste ${winnerData.prizeAmount} ${winnerData.prizeType} en "${winnerData.raffleName}". Toca para recibir tu premio.`,
        type: 'winner',
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: `/raffles/${winnerData.raffleId}`,
      };
      
      return notification;
    } catch (error) {
      return rejectWithValue('Error al crear notificación de ganador');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.items.find(n => n.id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items.forEach(notification => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      })
      .addCase(createWinnerNotification.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.unreadCount += 1;
      });
  },
});

export const { clearError, addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;

// Selectores memoizados
export const selectNotificationsState = (state: any) => state.notifications as import('@shared/domain/types').NotificationsState;
export const selectNotifications = createSelector(selectNotificationsState, (n) => n.items);
export const selectUnreadCount = createSelector(selectNotificationsState, (n) => n.unreadCount);
export const selectNotificationsLoading = createSelector(selectNotificationsState, (n) => n.isLoading);
export const selectNotificationsError = createSelector(selectNotificationsState, (n) => n.error);
