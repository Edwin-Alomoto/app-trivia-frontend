import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';

import { featureFlags } from '../config/featureFlags';
import { getServices } from '../../services/container';
import { RewardsState, Reward, UserReward } from '../../shared/domain/types';
import { updateBalanceFromReward } from './pointsSlice';

const initialState: RewardsState = {
  available: [],
  userRewards: [],
  isLoading: false,
  error: null,
  redemptionHistory: [],
};

// Datos por defecto más completos
const mockRewards: Reward[] = [
  {
    id: '1',
    name: 'Entrada de Cine Cinépolis',
    description: 'Entrada para cualquier película en Cinépolis. Válida por 3 meses.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=300&fit=crop&auto=format',
    pointsRequired: 100,
    stock: 50,
    expirationDate: '2024-12-31',
    redemptionInstructions: 'Presenta este código en cualquier sucursal de Cinépolis',
    category: 'entertainment',
    value: 150,
    isActive: true,
  },
  {
    id: '2',
    name: 'Cupón KFC $100',
    description: 'Cupón de $100 en cualquier producto de KFC. Válido por 2 meses.',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&auto=format',
    pointsRequired: 150,
    stock: 100,
    expirationDate: '2024-11-30',
    redemptionInstructions: 'Presenta este código en cualquier sucursal de KFC',
    category: 'food',
    value: 100,
    isActive: true,
  },
  {
    id: '3',
    name: 'Gift Card Amazon $200',
    description: 'Tarjeta de regalo de $200 para Amazon. Envío inmediato por email.',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=300&fit=crop&auto=format',
    pointsRequired: 300,
    stock: 25,
    expirationDate: '2025-12-31',
    redemptionInstructions: 'El código se enviará por email en 24 horas',
    category: 'shopping',
    value: 200,
    isActive: true,
  },
  {
    id: '4',
    name: 'Suscripción Netflix 3 Meses',
    description: '3 meses de Netflix Premium. Código de activación por email.',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop&auto=format',
    pointsRequired: 250,
    stock: 30,
    expirationDate: '2024-12-31',
    redemptionInstructions: 'El código se enviará por email en 24 horas',
    category: 'entertainment',
    value: 450,
    isActive: true,
  },
  {
    id: '5',
    name: 'Cupón Starbucks $50',
    description: 'Cupón de $50 para cualquier bebida en Starbucks.',
    image: 'https://images.unsplash.com/photo-1442511435568-b980d7c9baf1?w=400&h=300&fit=crop&auto=format',
    pointsRequired: 75,
    stock: 80,
    expirationDate: '2024-10-31',
    redemptionInstructions: 'Presenta este código en cualquier sucursal de Starbucks',
    category: 'food',
    value: 50,
    isActive: true,
  },
  {
    id: '6',
    name: 'Gift Card Steam $100',
    description: 'Tarjeta de regalo de $100 para la plataforma Steam.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&auto=format',
    pointsRequired: 200,
    stock: 40,
    expirationDate: '2025-06-30',
    redemptionInstructions: 'El código se enviará por email en 24 horas',
    category: 'gaming',
    value: 100,
    isActive: true,
  },
  {
    id: '7',
    name: 'Curso Udemy Premium',
    description: 'Acceso a cualquier curso de Udemy por 1 año.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&auto=format',
    pointsRequired: 400,
    stock: 15,
    expirationDate: '2025-03-31',
    redemptionInstructions: 'El código se enviará por email en 24 horas',
    category: 'education',
    value: 200,
    isActive: true,
  },
  {
    id: '8',
    name: 'Cupón Walmart $150',
    description: 'Cupón de $150 para cualquier producto en Walmart.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&auto=format',
    pointsRequired: 225,
    stock: 35,
    expirationDate: '2024-11-15',
    redemptionInstructions: 'Presenta este código en cualquier sucursal de Walmart',
    category: 'shopping',
    value: 150,
    isActive: true,
  },
];

// Datos por defecto de premios del usuario
const mockUserRewards: UserReward[] = [
  {
    id: 'ur_1',
    rewardId: '1',
    userId: '1',
    redeemedAt: new Date(Date.now() - 86400000).toISOString(),
    redemptionCode: 'CINE2024-12345',
    isUsed: false,
    expiresAt: '2024-12-31',
    rewardName: 'Entrada de Cine Cinépolis',
          rewardImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=300&fit=crop&auto=format',
    rewardCategory: 'entertainment',
  },
  {
    id: 'ur_2',
    rewardId: '2',
    userId: '1',
    redeemedAt: new Date(Date.now() - 172800000).toISOString(),
    redemptionCode: 'KFC2024-67890',
    isUsed: true,
    expiresAt: '2024-11-30',
    rewardName: 'Cupón KFC $100',
          rewardImage: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&auto=format',
    rewardCategory: 'food',
  },
  {
    id: 'ur_3',
    rewardId: '5',
    userId: '1',
    redeemedAt: new Date(Date.now() - 259200000).toISOString(),
    redemptionCode: 'STAR2024-11111',
    isUsed: false,
    expiresAt: '2024-10-31',
    rewardName: 'Cupón Starbucks $50',
          rewardImage: 'https://images.unsplash.com/photo-1442511435568-b980d7c9baf1?w=400&h=300&fit=crop&auto=format',
    rewardCategory: 'food',
  },
];

// Async thunks
export const fetchRewards = createAsyncThunk(
  'rewards/fetchRewards',
  async (_, { rejectWithValue }) => {
    try {
      if (featureFlags.useServicesRewards) {
        const { rewardsService } = getServices();
        const rewards = await rewardsService.getRewards();
        return rewards;
      }
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockRewards;
    } catch (error) {
      return rejectWithValue('Error al cargar premios');
    }
  }
);

export const fetchUserRewards = createAsyncThunk(
  'rewards/fetchUserRewards',
  async (_, { rejectWithValue }) => {
    try {
      if (featureFlags.useServicesRewards) {
        const { rewardsService } = getServices();
        const list = await rewardsService.getUserRewards();
        return list;
      }
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockUserRewards;
    } catch (error) {
      return rejectWithValue('Error al cargar premios del usuario');
    }
  }
);

export const redeemReward = createAsyncThunk(
  'rewards/redeemReward',
  async (rewardId: string, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as any;
      if (featureFlags.useServicesRewards) {
        const { rewardsService } = getServices();
        const result = await rewardsService.redeemReward(rewardId);
        const reward = state.rewards.available.find((r: Reward) => r.id === rewardId);
        if (!reward) {
          throw new Error('Premio no encontrado');
        }
        // Actualizar balance de puntos con lo retornado por el servicio
        dispatch(updateBalanceFromReward({ pointsSpent: result.pointsSpent, rewardName: reward.name }));
        return { userReward: result.userReward, reward, pointsSpent: result.pointsSpent };
      }
      // Simulación existente
      await new Promise(resolve => setTimeout(resolve, 1500));
      const reward = state.rewards.available.find((r: Reward) => r.id === rewardId);
      const userBalance = state.points.balance.real || state.points.balance.demo || 0;
      if (!reward) {
        throw new Error('Premio no encontrado');
      }
      if (!reward.isActive) {
        throw new Error('Este premio no está disponible');
      }
      if (reward.stock <= 0) {
        throw new Error('Este premio está agotado');
      }
      if (userBalance < reward.pointsRequired) {
        throw new Error(`Puntos insuficientes. Necesitas ${reward.pointsRequired} puntos`);
      }
      const redemptionCode = `${reward.category.toUpperCase()}2024-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 3);
      const userReward: UserReward = {
        id: `ur_${Date.now()}`,
        rewardId,
        userId: '1',
        redeemedAt: new Date().toISOString(),
        redemptionCode,
        isUsed: false,
        expiresAt: expiresAt.toISOString(),
        rewardName: reward.name,
        rewardImage: reward.image,
        rewardCategory: reward.category,
      };
      dispatch(updateBalanceFromReward({ pointsSpent: reward.pointsRequired, rewardName: reward.name }));
      return { userReward, reward, pointsSpent: reward.pointsRequired };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markRewardAsUsed = createAsyncThunk(
  'rewards/markAsUsed',
  async (userRewardId: string, { getState, rejectWithValue }) => {
    try {
      if (featureFlags.useServicesRewards) {
        const { rewardsService } = getServices();
        return await rewardsService.markAsUsed(userRewardId);
      }
      // Simulación existente
      await new Promise(resolve => setTimeout(resolve, 800));
      const state = getState() as any;
      const userReward = state.rewards.userRewards.find((ur: UserReward) => ur.id === userRewardId);
      if (!userReward) {
        throw new Error('Premio del usuario no encontrado');
      }
      if (userReward.isUsed) {
        throw new Error('Este premio ya fue utilizado');
      }
      const now = new Date();
      const expiresAt = new Date(userReward.expiresAt);
      if (now > expiresAt) {
        throw new Error('Este premio ha expirado');
      }
      return userRewardId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkRewardAvailability = createAsyncThunk(
  'rewards/checkAvailability',
  async (rewardId: string, { getState, rejectWithValue }) => {
    try {
      // Simular verificación de disponibilidad
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const state = getState() as any;
      const reward = state.rewards.available.find((r: Reward) => r.id === rewardId);
      const userBalance = state.points.balance.real || state.points.balance.demo || 0;
      
      if (!reward) {
        throw new Error('Premio no encontrado');
      }
      
      return {
        reward,
        canRedeem: reward.isActive && reward.stock > 0 && userBalance >= reward.pointsRequired,
        userBalance,
        missingPoints: Math.max(0, reward.pointsRequired - userBalance),
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateRewardStock: (state, action: PayloadAction<{ rewardId: string; newStock: number }>) => {
      const reward = state.available.find(r => r.id === action.payload.rewardId);
      if (reward) {
        reward.stock = action.payload.newStock;
      }
    },
    addUserReward: (state, action: PayloadAction<UserReward>) => {
      state.userRewards.push(action.payload);
    },
    markUserRewardAsUsed: (state, action: PayloadAction<string>) => {
      const userReward = state.userRewards.find(ur => ur.id === action.payload);
      if (userReward) {
        userReward.isUsed = true;
      }
    },
    addRedemptionToHistory: (state, action: PayloadAction<{
      rewardId: string;
      rewardName: string;
      pointsSpent: number;
      redemptionDate: string;
    }>) => {
      state.redemptionHistory.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Rewards
      .addCase(fetchRewards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRewards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.available = action.payload;
      })
      .addCase(fetchRewards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch User Rewards
      .addCase(fetchUserRewards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserRewards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userRewards = action.payload;
      })
      .addCase(fetchUserRewards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Redeem Reward
      .addCase(redeemReward.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(redeemReward.fulfilled, (state, action) => {
        state.isLoading = false;
        // Agregar premio al usuario
        state.userRewards.push(action.payload.userReward);
        
        // Actualizar stock del premio
        const reward = state.available.find(r => r.id === action.payload.reward.id);
        if (reward) {
          reward.stock -= 1;
        }
        
        // Agregar a historial de canjes
        state.redemptionHistory.push({
          rewardId: action.payload.reward.id,
          rewardName: action.payload.reward.name,
          pointsSpent: action.payload.pointsSpent,
          redemptionDate: new Date().toISOString(),
        });
      })
      .addCase(redeemReward.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Mark as Used
      .addCase(markRewardAsUsed.fulfilled, (state, action) => {
        const userReward = state.userRewards.find(ur => ur.id === action.payload);
        if (userReward) {
          userReward.isUsed = true;
        }
      })
      // Check Availability
      .addCase(checkRewardAvailability.fulfilled, (state, action) => {
        // Los resultados se manejan en el componente
      });
  },
});

export const { 
  clearError, 
  updateRewardStock, 
  addUserReward, 
  markUserRewardAsUsed, 
  addRedemptionToHistory 
} = rewardsSlice.actions;
export default rewardsSlice.reducer;

// Selectores memoizados
export const selectRewardsState = (state: any) => state.rewards as import('../../shared/domain/types').RewardsState;
export const selectAvailableRewards = createSelector(selectRewardsState, (r) => r.available);
export const selectUserRewards = createSelector(selectRewardsState, (r) => r.userRewards);
export const selectRewardsLoading = createSelector(selectRewardsState, (r) => r.isLoading);
export const selectRewardsError = createSelector(selectRewardsState, (r) => r.error);
export const selectRedemptionHistory = createSelector(selectRewardsState, (r) => r.redemptionHistory);
