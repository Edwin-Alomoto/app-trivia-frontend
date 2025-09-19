import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';

import { featureFlags } from '../config/featureFlags';
import { getServices } from '../../services/container';
import { RafflesState, Raffle, UserRaffleParticipation } from '../../shared/domain/types';
import { updateBalanceFromRaffle } from './pointsSlice';
import { createWinnerNotification } from './notificationsSlice';

// Función para generar fechas automáticamente basadas en la fecha actual
const generateFutureDate = (daysFromNow: number, hour: number = 20, minute: number = 0): string => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysFromNow);
  futureDate.setHours(hour, minute, 0, 0);
  return futureDate.toISOString();
};

const initialState: RafflesState = {
  active: [],
  userParticipations: [],
  isLoading: false,
  error: null,
  winners: [],
};

// Datos por defecto más completos
const mockRaffles: Raffle[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'Gana el último iPhone 15 Pro Max de 256GB en color Natural Titanium',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
    prize: 'iPhone 15 Pro Max 256GB',
    requiredPoints: 500,
    maxParticipants: 1000,
    currentParticipants: 750,
    drawDate: generateFutureDate(7, 20, 0),
    endDate: generateFutureDate(6, 20, 0),
    isActive: true,
    category: 'electronics',
    title: 'iPhone 15 Pro Max',
    rules: 'Una participación por usuario. El ganador será seleccionado aleatoriamente entre todos los participantes.',
    prizeValue: 1200,
  },

  {
    id: '3',
    name: 'Consola PlayStation 5',
    description: 'PS5 con 2 controles DualSense y 5 juegos de tu elección',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop',
    prize: 'PlayStation 5 + 2 controles + 5 juegos',
    requiredPoints: 750,
    maxParticipants: 200,
    currentParticipants: 180,
    drawDate: generateFutureDate(5, 19, 0),
    endDate: generateFutureDate(4, 19, 0),
    isActive: true,
    category: 'gaming',
    title: 'PlayStation 5',
    rules: 'Una participación por usuario. Envío gratuito incluido.',
    prizeValue: 800,
  },

  {
    id: '5',
    name: 'Gift Card Amazon $500',
    description: 'Tarjeta de regalo de $500 para gastar en Amazon',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    prize: 'Gift Card Amazon $500',
    requiredPoints: 250,
    maxParticipants: 1000,
    currentParticipants: 890,
    drawDate: generateFutureDate(3, 12, 0),
    endDate: generateFutureDate(2, 12, 0),
    isActive: true,
    category: 'shopping',
    title: 'Gift Card Amazon',
    rules: 'Una participación por usuario. Envío por email inmediato.',
    prizeValue: 500,
  },

  {
    id: '7',
    name: 'Viaje a Europa',
    description: '7 días por Europa: París, Roma y Barcelona',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop',
    prize: 'Viaje a Europa 7 días',
    requiredPoints: 2000,
    maxParticipants: 50,
    currentParticipants: 35,
    drawDate: generateFutureDate(10, 10, 0),
    endDate: generateFutureDate(9, 10, 0),
    isActive: true,
    category: 'travel',
    title: 'Viaje a Europa',
    rules: 'Una participación por usuario. Incluye vuelos, hoteles y tours.',
    prizeValue: 3500,
  },

  {
    id: '9',
    name: 'AirPods Pro 2',
    description: 'AirPods Pro 2 con cancelación de ruido activa',
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=300&fit=crop',
    prize: 'AirPods Pro 2',
    requiredPoints: 300,
    maxParticipants: 500,
    currentParticipants: 320,
    drawDate: generateFutureDate(4, 15, 0),
    endDate: generateFutureDate(3, 15, 0),
    isActive: true,
    category: 'electronics',
    title: 'AirPods Pro 2',
    rules: 'Una participación por usuario. Envío gratuito incluido.',
    prizeValue: 250,
  },

  // Sorteos de Dinero
  {
    id: '10',
    name: 'Sorteo de $500 USD',
    description: 'Gana $500 USD en efectivo para gastar como quieras',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    prize: '$500 USD en efectivo',
    requiredPoints: 400,
    maxParticipants: 200,
    currentParticipants: 150,
    drawDate: generateFutureDate(2, 18, 0),
    endDate: generateFutureDate(1, 18, 0),
    isActive: true,
    category: 'money',
    title: 'Sorteo de $500 USD',
    rules: 'Una participación por usuario. Pago directo a tarjeta bancaria o coordinación por WhatsApp.',
    prizeValue: 500,
  },

  {
    id: '11',
    name: 'Sorteo de $1000 USD',
    description: 'Gana $1000 USD en efectivo para tus proyectos',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    prize: '$1000 USD en efectivo',
    requiredPoints: 800,
    maxParticipants: 100,
    currentParticipants: 75,
    drawDate: generateFutureDate(5, 20, 0),
    endDate: generateFutureDate(4, 20, 0),
    isActive: true,
    category: 'money',
    title: 'Sorteo de $1000 USD',
    rules: 'Una participación por usuario. Pago directo a tarjeta bancaria o coordinación por WhatsApp.',
    prizeValue: 1000,
  },

  {
    id: '12',
    name: 'Sorteo de $250 USD',
    description: 'Gana $250 USD en efectivo para tus gastos',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    prize: '$250 USD en efectivo',
    requiredPoints: 200,
    maxParticipants: 300,
    currentParticipants: 220,
    drawDate: generateFutureDate(3, 14, 0),
    endDate: generateFutureDate(2, 14, 0),
    isActive: true,
    category: 'money',
    title: 'Sorteo de $250 USD',
    rules: 'Una participación por usuario. Pago directo a tarjeta bancaria o coordinación por WhatsApp.',
    prizeValue: 250,
  },

  {
    id: '13',
    name: 'Gift Card Netflix $100',
    description: 'Tarjeta de regalo de Netflix por $100',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop',
    prize: 'Gift Card Netflix $100',
    requiredPoints: 150,
    maxParticipants: 800,
    currentParticipants: 650,
    drawDate: generateFutureDate(2, 18, 0),
    endDate: generateFutureDate(1, 18, 0),
    isActive: true,
    category: 'entertainment',
    title: 'Netflix Gift Card',
    rules: 'Una participación por usuario. Envío por email inmediato.',
    prizeValue: 100,
  },

  {
    id: '14',
    name: 'Nintendo Switch OLED',
    description: 'Nintendo Switch OLED con 2 juegos incluidos',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=300&fit=crop',
    prize: 'Nintendo Switch OLED + 2 juegos',
    requiredPoints: 1000,
    maxParticipants: 100,
    currentParticipants: 75,
    drawDate: generateFutureDate(8, 14, 0),
    endDate: generateFutureDate(7, 14, 0),
    isActive: true,
    category: 'gaming',
    title: 'Nintendo Switch OLED',
    rules: 'Una participación por usuario. Envío gratuito incluido.',
    prizeValue: 400,
  },

  {
    id: '15',
    name: 'Gift Card Starbucks $200',
    description: 'Tarjeta de regalo de Starbucks por $200',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    prize: 'Gift Card Starbucks $200',
    requiredPoints: 200,
    maxParticipants: 600,
    currentParticipants: 480,
    drawDate: generateFutureDate(3, 16, 0),
    endDate: generateFutureDate(2, 16, 0),
    isActive: true,
    category: 'shopping',
    title: 'Starbucks Gift Card',
    rules: 'Una participación por usuario. Envío por email inmediato.',
    prizeValue: 200,
  },

  {
    id: '16',
    name: 'iPad Air 5',
    description: 'iPad Air 5 de 64GB con Apple Pencil',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    prize: 'iPad Air 5 + Apple Pencil',
    requiredPoints: 1500,
    maxParticipants: 75,
    currentParticipants: 45,
    drawDate: generateFutureDate(12, 12, 0),
    endDate: generateFutureDate(11, 12, 0),
    isActive: true,
    category: 'electronics',
    title: 'iPad Air 5',
    rules: 'Una participación por usuario. Envío gratuito incluido.',
    prizeValue: 800,
  },

  {
    id: '17',
    name: 'Gift Card Steam $300',
    description: 'Tarjeta de regalo de Steam por $300',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    prize: 'Gift Card Steam $300',
    requiredPoints: 400,
    maxParticipants: 400,
    currentParticipants: 280,
    drawDate: generateFutureDate(5, 22, 0),
    endDate: generateFutureDate(4, 22, 0),
    isActive: true,
    category: 'gaming',
    title: 'Steam Gift Card',
    rules: 'Una participación por usuario. Envío por email inmediato.',
    prizeValue: 300,
  },

  {
    id: '21',
    name: 'Gift Card Uber $150',
    description: 'Tarjeta de regalo de Uber por $150',
    image: '🚗',
    prize: 'Gift Card Uber $150',
    requiredPoints: 180,
    maxParticipants: 700,
    currentParticipants: 520,
    drawDate: generateFutureDate(2, 20, 0),
    endDate: generateFutureDate(1, 20, 0),
    isActive: true,
    category: 'travel',
    title: 'Uber Gift Card',
    rules: 'Una participación por usuario. Envío por email inmediato.',
    prizeValue: 150,
  },




];

// Mock de participaciones del usuario
const mockUserParticipations: UserRaffleParticipation[] = [
  {
    id: 'participation_1',
    raffleId: '1',
    userId: '1',
    participationId: 'PART-001-001',
    participationDate: new Date(Date.now() - 86400000).toISOString(),
    requiredPoints: 500,
    balanceBefore: 1500,
    balanceAfter: 1000,
    status: 'pending',
    raffleName: 'iPhone 15 Pro Max',
    raffleImage: '📱',
  },
  {
    id: 'participation_2',
    raffleId: '3',
    userId: '1',
    participationId: 'PART-003-045',
    participationDate: new Date(Date.now() - 172800000).toISOString(),
    requiredPoints: 750,
    balanceBefore: 1000,
    balanceAfter: 250,
    status: 'pending',
    raffleName: 'PlayStation 5',
    raffleImage: '🎮',
  },
  {
    id: 'participation_3',
    raffleId: '5',
    userId: '1',
    participationId: 'PART-005-123',
    participationDate: new Date(Date.now() - 259200000).toISOString(),
    requiredPoints: 250,
    balanceBefore: 500,
    balanceAfter: 250,
    status: 'winner',
    raffleName: 'Gift Card Amazon $500',
    raffleImage: '📦',
  },
];

// Mock de ganadores
const mockWinners = [
  {
    id: 'winner_1',
    raffleId: '5',
    raffleName: 'Gift Card Amazon $500',
    winnerName: 'Usuario Demo',
    winnerEmail: 'usuario@ejemplo.com',
    ticketNumber: 'RAFFLE-005-123',
    drawDate: '2024-12-15T12:00:00Z',
    prize: 'Gift Card Amazon $500',
  },
];

// Async thunks
export const fetchRaffles = createAsyncThunk(
  'raffles/fetchRaffles',
  async (_, { rejectWithValue }) => {
    try {
      if (featureFlags.useServicesRaffles) {
        const { rafflesService } = getServices();
        const raffles = await rafflesService.getRaffles();
        return raffles;
      }
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockRaffles;
    } catch (error) {
      return rejectWithValue('Error al cargar sorteos');
    }
  }
);

export const fetchUserParticipations = createAsyncThunk(
  'raffles/fetchUserParticipations',
  async (_, { rejectWithValue }) => {
    try {
      if (featureFlags.useServicesRaffles) {
        const { rafflesService } = getServices();
        const participations = await rafflesService.getUserParticipations();
        return participations;
      }
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockUserParticipations;
    } catch (error) {
      return rejectWithValue('Error al cargar participaciones del usuario');
    }
  }
);

export const participateInRaffle = createAsyncThunk(
  'raffles/participateInRaffle',
  async (raffleId: string, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as any;
      if (featureFlags.useServicesRaffles) {
        const { rafflesService } = getServices();
        const result = await rafflesService.participate(raffleId);
        const raffle = state.raffles.active.find((r: Raffle) => r.id === raffleId);
        if (!raffle) {
          throw new Error('Sorteo no encontrado');
        }
        dispatch(updateBalanceFromRaffle({ pointsSpent: result.requiredPoints, raffleName: raffle.name, quantity: 1 }));
        return result;
      }
      // Simulación existente
      await new Promise(resolve => setTimeout(resolve, 1200));
      const raffle = state.raffles.active.find((r: Raffle) => r.id === raffleId);
      const userBalance = state.points.balance.total || 0;
      if (!raffle) {
        throw new Error('Sorteo no encontrado');
      }
      if (!raffle.isActive) {
        throw new Error('Este sorteo ya no está activo');
      }
      const now = new Date();
      const endDate = new Date(raffle.endDate);
      if (now > endDate) {
        throw new Error('Este sorteo ya no está disponible');
      }
      const existingParticipation = state.raffles.userParticipations.find(
        (p: UserRaffleParticipation) => p.raffleId === raffleId
      );
      if (existingParticipation) {
        throw new Error('Ya participaste en este sorteo');
      }
      if (userBalance < raffle.requiredPoints) {
        throw new Error(`Saldo insuficiente. Necesitas ${raffle.requiredPoints} puntos`);
      }
      const participation: UserRaffleParticipation = {
        id: `participation_${Date.now()}`,
        raffleId,
        userId: '1',
        participationId: `PART-${raffleId.padStart(3, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        participationDate: new Date().toISOString(),
        requiredPoints: raffle.requiredPoints,
        balanceBefore: userBalance,
        balanceAfter: userBalance - raffle.requiredPoints,
        status: 'pending',
        raffleName: raffle.name,
        raffleImage: raffle.image,
      };
      dispatch(updateBalanceFromRaffle({ pointsSpent: raffle.requiredPoints, raffleName: raffle.name, quantity: 1 }));
      return { participation, requiredPoints: raffle.requiredPoints };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Función para simular que un usuario gana un sorteo
export const simulateWinner = createAsyncThunk(
  'raffles/simulateWinner',
  async (raffleId: string, { dispatch, rejectWithValue }) => {
    try {
      if (featureFlags.useServicesRaffles) {
        // En una implementación real, podría invocar un endpoint admin; aquí solo generamos notificación
        const raffleName = 'Sorteo';
        const prizeAmount = 100;
        const prizeType = 'USD';
        dispatch(createWinnerNotification({ raffleName, prizeAmount, prizeType, raffleId }));
        return { raffleId, prizeAmount, prizeType, message: `¡Felicidades! Has ganado ${prizeAmount} ${prizeType}` };
      }
      // Simulación existente
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (raffleId === 'active-1') {
        const raffleName = 'Sorteo Mega de $1000 USD';
        const prizeAmount = 1000;
        const prizeType = 'USD';
        dispatch(createWinnerNotification({ raffleName, prizeAmount, prizeType, raffleId }));
        return { raffleId, prizeAmount, prizeType, message: `¡Felicidades! Has ganado ${prizeAmount} ${prizeType} en el sorteo "${raffleName}"` };
      }
      const raffle = mockRaffles.find(r => r.id === raffleId);
      if (!raffle) {
        return rejectWithValue('Sorteo no encontrado');
      }
      let prizeType = 'USD';
      let prizeAmount = raffle.prizeValue || 100;
      if (raffle.category === 'electronics') prizeAmount = raffle.prizeValue || 500;
      if (raffle.category === 'gaming') prizeAmount = raffle.prizeValue || 300;
      dispatch(createWinnerNotification({ raffleName: raffle.name, prizeAmount, prizeType, raffleId }));
      return { raffleId, prizeAmount, prizeType, message: `¡Felicidades! Has ganado ${prizeAmount} ${prizeType} en el sorteo "${raffle.name}"` };
    } catch (error) {
      return rejectWithValue('Error al simular ganador');
    }
  }
);

export const getRaffleWinners = createAsyncThunk(
  'raffles/getWinners',
  async (_, { rejectWithValue }) => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockWinners;
    } catch (error) {
      return rejectWithValue('Error al cargar ganadores');
    }
  }
);

export const checkRaffleResults = createAsyncThunk(
  'raffles/checkResults',
  async (raffleId: string, { getState, rejectWithValue }) => {
    try {
      // Simular verificación de resultados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const state = getState() as any;
      const userParticipation = state.raffles.userParticipations.find(
        (participation: UserRaffleParticipation) => participation.raffleId === raffleId
      );
      const raffle = state.raffles.active.find((r: Raffle) => r.id === raffleId);
      
      if (!raffle) {
        throw new Error('Sorteo no encontrado');
      }
      
      if (!userParticipation) {
        throw new Error('No participaste en este sorteo');
      }
      
      // Simular verificación de ganador (en realidad esto vendría del backend)
      const isWinner = userParticipation.status === 'winner';
      
      return {
        raffleId,
        isWinner,
        participation: userParticipation,
        raffle,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const rafflesSlice = createSlice({
  name: 'raffles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateRaffleParticipants: (state, action: PayloadAction<{ raffleId: string; currentParticipants: number }>) => {
      const raffle = state.active.find(r => r.id === action.payload.raffleId);
      if (raffle) {
        raffle.currentParticipants = action.payload.currentParticipants;
      }
    },
    addUserParticipation: (state, action: PayloadAction<UserRaffleParticipation>) => {
      state.userParticipations.push(action.payload);
    },
    markParticipationAsWinner: (state, action: PayloadAction<string>) => {
      const participation = state.userParticipations.find(p => p.id === action.payload);
      if (participation) {
        participation.status = 'winner';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Raffles
      .addCase(fetchRaffles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRaffles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.active = action.payload;
      })
      .addCase(fetchRaffles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch User Participations
      .addCase(fetchUserParticipations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserParticipations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userParticipations = action.payload;
      })
      .addCase(fetchUserParticipations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Participate in Raffle (UC-08)
      .addCase(participateInRaffle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(participateInRaffle.fulfilled, (state, action) => {
        state.isLoading = false;
        // Agregar participación al usuario
        state.userParticipations.push(action.payload.participation);
        
        // Actualizar número de participantes del sorteo
        const raffle = state.active.find(r => r.id === action.payload.participation.raffleId);
        if (raffle) {
          raffle.currentParticipants += 1;
        }
      })
      .addCase(participateInRaffle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Winners
      .addCase(getRaffleWinners.fulfilled, (state, action) => {
        state.winners = action.payload;
      })
      // Check Results
      .addCase(checkRaffleResults.fulfilled, (state, action) => {
        // Los resultados se manejan en el componente
      })
      // Simulate Winner
      .addCase(simulateWinner.fulfilled, (state, action) => {
        // La notificación se maneja en el thunk
      });
  },
});

export const { clearError, updateRaffleParticipants, addUserParticipation, markParticipationAsWinner } = rafflesSlice.actions;
export default rafflesSlice.reducer;

// Selectores memoizados
export const selectRafflesState = (state: any) => state.raffles as import('../../shared/domain/types').RafflesState;
export const selectActiveRaffles = createSelector(selectRafflesState, (r) => r.active);
export const selectUserParticipations = createSelector(selectRafflesState, (r) => r.userParticipations);
export const selectRafflesLoading = createSelector(selectRafflesState, (r) => r.isLoading);
export const selectRafflesError = createSelector(selectRafflesState, (r) => r.error);
export const selectRaffleWinners = createSelector(selectRafflesState, (r) => r.winners);
