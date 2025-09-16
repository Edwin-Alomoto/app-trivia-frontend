import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';

import { featureFlags } from '../../config/featureFlags';
import { getServices } from '../../services/container';
import { PointsState, PointTransaction, PointBalance, PointPackage } from '../../shared/domain/types';

const initialState: PointsState = {
  balance: {
    total: 0,
    earned: 0,
    spent: 0,
    purchased: 0,
    demo: 0,
    real: 0,
  },
  transactions: [],
  isLoading: false,
  error: null,
};

// Mock data
const mockPointPackages: PointPackage[] = [
  {
    id: '1',
    name: 'Paquete Básico',
    points: 100,
    price: 0.99,
    currency: 'USD',
  },
  {
    id: '2',
    name: 'Paquete Popular',
    points: 500,
    price: 3.99,
    currency: 'USD',
    isPopular: true,
    discount: 20,
  },
  {
    id: '3',
    name: 'Paquete Premium',
    points: 1000,
    price: 6.99,
    currency: 'USD',
    discount: 30,
  },
  {
    id: '4',
    name: 'Paquete Mega',
    points: 2500,
    price: 14.99,
    currency: 'USD',
    discount: 40,
  },
];

// Async thunks
export const fetchPointBalance = createAsyncThunk(
  'points/fetchBalance',
  async (_, { getState, rejectWithValue }) => {
    try {
      if (featureFlags.useServicesPoints) {
        const { pointsService } = getServices();
        const balance = await pointsService.getBalance();
        return balance;
      }
      // Fallback mock actual
      await new Promise(resolve => setTimeout(resolve, 500));
      const { auth } = getState() as any;
      const user = auth.user;
      let balance: PointBalance;
      if (user?.subscriptionStatus === 'demo') {
        balance = { total: 100, earned: 100, spent: 0, purchased: 0, demo: 100, real: 0 };
      } else if (user?.subscriptionStatus === 'subscribed') {
        balance = { total: 2500, earned: 1800, spent: 400, purchased: 1100, demo: 0, real: 2500 };
      } else {
        balance = { total: 0, earned: 0, spent: 0, purchased: 0, demo: 0, real: 0 };
      }
      return balance;
    } catch (error) {
      return rejectWithValue('Error al cargar saldo de puntos');
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'points/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      if (featureFlags.useServicesPoints) {
        const { pointsService } = getServices();
        const txs = await pointsService.getTransactions();
        return txs;
      }
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Mock transactions más completas
      const transactions: PointTransaction[] = [
        {
          id: '1',
          userId: '1',
          type: 'earned',
          amount: 50,
          description: 'Trivia - Historia (5/5 correctas)',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          metadata: {
            triviaId: 'session_1',
            categoryId: '1',
          },
        },
        {
          id: '2',
          userId: '1',
          type: 'spent',
          amount: -100,
          description: 'Canje - Entrada de Cine Cinépolis',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          metadata: {
            rewardId: '1',
          },
        },
        {
          id: '3',
          userId: '1',
          type: 'spent',
          amount: -50,
          description: 'Compra de boletos - iPhone 15 Pro Max',
          timestamp: new Date(Date.now() - 8640000).toISOString(),
          metadata: {
            raffleId: '1',
          },
        },
        {
          id: '4',
          userId: '1',
          type: 'purchased',
          amount: 500,
          description: 'Compra - Paquete Popular',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '5',
          userId: '1',
          type: 'earned',
          amount: 30,
          description: 'Trivia - Ciencia (3/5 correctas)',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          metadata: {
            triviaId: 'session_2',
            categoryId: '2',
          },
        },
        {
          id: '6',
          userId: '1',
          type: 'spent',
          amount: -150,
          description: 'Canje - Cupón KFC $100',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          metadata: {
            rewardId: '2',
          },
        },
        {
          id: '7',
          userId: '1',
          type: 'spent',
          amount: -100,
          description: 'Compra de boletos - Viaje a Cancún',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          metadata: {
            raffleId: '2',
          },
        },
        {
          id: '8',
          userId: '1',
          type: 'earned',
          amount: 75,
          description: 'Trivia - Geografía (5/5 correctas)',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          metadata: {
            triviaId: 'session_3',
            categoryId: '3',
          },
        },
        {
          id: '9',
          userId: '1',
          type: 'spent',
          amount: -75,
          description: 'Canje - Cupón Starbucks $50',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          metadata: {
            rewardId: '5',
          },
        },
        {
          id: '10',
          userId: '1',
          type: 'spent',
          amount: -150,
          description: 'Compra de boletos - PlayStation 5',
          timestamp: new Date(Date.now() - 345600000).toISOString(),
          metadata: {
            raffleId: '3',
          },
        },
        {
          id: '11',
          userId: '1',
          type: 'spent',
          amount: -75,
          description: 'Compra de boletos - Gift Card Amazon',
          timestamp: new Date(Date.now() - 432000000).toISOString(),
          metadata: {
            raffleId: '5',
          },
        },
        {
          id: '12',
          userId: '1',
          type: 'purchased',
          amount: 600,
          description: 'Compra - Paquete Premium',
          timestamp: new Date(Date.now() - 518400000).toISOString(),
        },
      ];
      
      return transactions;
    } catch (error) {
      return rejectWithValue('Error al cargar transacciones');
    }
  }
);

export const purchasePoints = createAsyncThunk(
  'points/purchase',
  async (packageId: string, { rejectWithValue }) => {
    try {
      if (featureFlags.useServicesPoints) {
        const { pointsService } = getServices();
        const result = await pointsService.purchasePoints(packageId);
        return result;
      }
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const package_ = mockPointPackages.find(p => p.id === packageId);
      if (!package_) {
        throw new Error('Paquete no encontrado');
      }
      
      // Simular transacción
      const transaction: PointTransaction = {
        id: `tx_${Date.now()}`,
        userId: '1',
        type: 'purchased',
        amount: package_.points,
        description: `Compra - ${package_.name}`,
        timestamp: new Date().toISOString(),
      };
      
      return { transaction, points: package_.points };
    } catch (error) {
      return rejectWithValue('Error al comprar puntos');
    }
  }
);

export const spendPoints = createAsyncThunk(
  'points/spend',
  async ({ amount, description, metadata }: {
    amount: number;
    description: string;
    metadata?: any;
  }, { rejectWithValue }) => {
    try {
      if (featureFlags.useServicesPoints) {
        const { pointsService } = getServices();
        return await pointsService.spendPoints({ amount, description, metadata });
      }
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const transaction: PointTransaction = {
        id: `tx_${Date.now()}`,
        userId: '1',
        type: 'spent',
        amount: -amount,
        description,
        timestamp: new Date().toISOString(),
        metadata,
      };
      
      return { transaction, amount };
    } catch (error) {
      return rejectWithValue('Error al gastar puntos');
    }
  }
);

export const earnPoints = createAsyncThunk(
  'points/earn',
  async ({ amount, description, metadata }: {
    amount: number;
    description: string;
    metadata?: any;
  }, { getState, rejectWithValue }) => {
    try {
      if (featureFlags.useServicesPoints) {
        const { pointsService } = getServices();
        return await pointsService.earnPoints({ amount, description, metadata });
      }
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { auth } = getState() as any;
      const user = auth.user;
      
      // Determinar si son puntos demo o reales
      const isDemo = user?.subscriptionStatus === 'demo';
      const descriptionWithMode = isDemo ? `${description} (DEMO)` : description;
      
      const transaction: PointTransaction = {
        id: `tx_${Date.now()}`,
        userId: '1',
        type: 'earned',
        amount,
        description: descriptionWithMode,
        timestamp: new Date().toISOString(),
        metadata: {
          ...metadata,
          isDemo,
        },
      };
      
      return { transaction, amount, isDemo };
    } catch (error) {
      return rejectWithValue('Error al ganar puntos');
    }
  }
);

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addTransaction: (state, action: PayloadAction<PointTransaction>) => {
      state.transactions.unshift(action.payload);
      
      // Actualizar balance
      const { type, amount } = action.payload;
      if (type === 'earned') {
        state.balance.earned += amount;
        state.balance.total += amount;
      } else if (type === 'spent') {
        state.balance.spent += Math.abs(amount);
        state.balance.total += amount; // amount es negativo
      } else if (type === 'purchased') {
        state.balance.purchased += amount;
        state.balance.total += amount;
      }
    },
    // Reducer para integrar con premios y sorteos
    updateBalanceFromReward: (state, action: PayloadAction<{ pointsSpent: number; rewardName: string }>) => {
      const { pointsSpent, rewardName } = action.payload;
      state.balance.spent += pointsSpent;
      state.balance.total -= pointsSpent;
      
      const transaction: PointTransaction = {
        id: `tx_${Date.now()}`,
        userId: '1',
        type: 'spent',
        amount: -pointsSpent,
        description: `Canje - ${rewardName}`,
        timestamp: new Date().toISOString(),
        metadata: {
          rewardId: 'reward',
        },
      };
      
      state.transactions.unshift(transaction);
    },
    updateBalanceFromRaffle: (state, action: PayloadAction<{ pointsSpent: number; raffleName: string; quantity: number }>) => {
      const { pointsSpent, raffleName, quantity } = action.payload;
      state.balance.spent += pointsSpent;
      state.balance.total -= pointsSpent;
      
      const transaction: PointTransaction = {
        id: `tx_${Date.now()}`,
        userId: '1',
        type: 'spent',
        amount: -pointsSpent,
        description: `Compra de ${quantity} boleto${quantity > 1 ? 's' : ''} - ${raffleName}`,
        timestamp: new Date().toISOString(),
        metadata: {
          raffleId: 'raffle',
        },
      };
      
      state.transactions.unshift(transaction);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Balance
      .addCase(fetchPointBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPointBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload;
      })
      .addCase(fetchPointBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Purchase Points
      .addCase(purchasePoints.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(purchasePoints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions.unshift(action.payload.transaction);
        state.balance.purchased += action.payload.points;
        state.balance.total += action.payload.points;
      })
      .addCase(purchasePoints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Spend Points
      .addCase(spendPoints.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload.transaction);
        state.balance.spent += action.payload.amount;
        state.balance.total -= action.payload.amount;
      })
      // Earn Points
      .addCase(earnPoints.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload.transaction);
        state.balance.earned += action.payload.amount;
        state.balance.total += action.payload.amount;
        
        // Actualizar demo o real según el tipo
        if (action.payload.isDemo) {
          state.balance.demo += action.payload.amount;
        } else {
          state.balance.real += action.payload.amount;
        }
      });
  },
});

export const { 
  clearError, 
  addTransaction, 
  updateBalanceFromReward, 
  updateBalanceFromRaffle 
} = pointsSlice.actions;
export { mockPointPackages };
export default pointsSlice.reducer;

// Selectores memoizados
export const selectPointsState = (state: any) => state.points as import('../../shared/domain/types').PointsState;
export const selectPointBalance = createSelector(selectPointsState, (p) => p.balance);
export const selectPointTransactions = createSelector(selectPointsState, (p) => p.transactions);
export const selectPointsLoading = createSelector(selectPointsState, (p) => p.isLoading);
export const selectPointsError = createSelector(selectPointsState, (p) => p.error);
export const selectTotalPoints = createSelector(selectPointBalance, (b) => b.total);
