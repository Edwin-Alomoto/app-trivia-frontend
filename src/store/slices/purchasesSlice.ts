import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';

import { featureFlags } from '../../config/featureFlags';
import { getServices } from '../../services/container';
import { PointPackage, PurchaseState } from '../../shared/domain/types';

const initialState: PurchaseState = {
  packages: [],
  isLoading: false,
  error: null,
  purchaseHistory: [],
};

// Mock data para paquetes de puntos
const mockPackages: PointPackage[] = [
  {
    id: '1',
    name: 'Paquete Básico',
    points: 1000,
    price: 4.99,
    currency: 'USD',
  },
  {
    id: '2',
    name: 'Paquete Popular',
    points: 2500,
    price: 9.99,
    currency: 'USD',
    isPopular: true,
    discount: 20,
  },
  {
    id: '3',
    name: 'Paquete Premium',
    points: 5000,
    price: 17.99,
    currency: 'USD',
    discount: 30,
  },
  {
    id: '4',
    name: 'Paquete Mega',
    points: 10000,
    price: 29.99,
    currency: 'USD',
    discount: 40,
  },
];

// Async thunks
export const fetchPackages = createAsyncThunk(
  'purchases/fetchPackages',
  async (_, { rejectWithValue }) => {
    try {
      if (featureFlags.useServicesPurchases) {
        const { purchasesService } = getServices();
        return await purchasesService.getPackages();
      }
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPackages;
    } catch (error) {
      return rejectWithValue('Error al cargar paquetes');
    }
  }
);

export const purchasePoints = createAsyncThunk(
  'purchases/purchasePoints',
  async (packageId: string, { rejectWithValue, dispatch, getState }) => {
    try {
      if (featureFlags.useServicesPurchases) {
        const { purchasesService } = getServices();
        const result = await purchasesService.purchase(packageId);
        const purchaseRecord = {
          ...result,
          timestamp: new Date().toISOString(),
          status: 'completed',
          currency: 'USD',
        } as any;
        return { ...result, purchaseRecord };
      }
      // Simulación de proceso de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      const packageData = mockPackages.find(pkg => pkg.id === packageId);
      if (!packageData) {
        throw new Error('Paquete no encontrado');
      }
      const isPaymentSuccessful = Math.random() > 0.1;
      if (!isPaymentSuccessful) {
        throw new Error('Pago rechazado');
      }
      const transactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const purchaseRecord = {
        packageId,
        points: packageData.points,
        amount: packageData.price,
        transactionId,
        timestamp: new Date().toISOString(),
        status: 'completed',
        currency: packageData.currency,
      };
      return { packageId, points: packageData.points, amount: packageData.price, transactionId, purchaseRecord };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error en la compra');
    }
  }
);

const purchasesSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addToPurchaseHistory: (state, action: PayloadAction<{
      packageId: string;
      points: number;
      amount: number;
      transactionId: string;
      timestamp: string;
    }>) => {
      state.purchaseHistory.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Packages
      .addCase(fetchPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packages = action.payload;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
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
        // Agregar a historial de compras
        state.purchaseHistory.push({
          ...action.payload,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(purchasePoints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, addToPurchaseHistory } = purchasesSlice.actions;
export default purchasesSlice.reducer;

// Selectores memoizados
export const selectPurchasesState = (state: any) => state.purchases as import('../../shared/domain/types').PurchaseState;
export const selectPointPackages = createSelector(selectPurchasesState, (p) => p.packages);
export const selectPurchasesLoading = createSelector(selectPurchasesState, (p) => p.isLoading);
export const selectPurchasesError = createSelector(selectPurchasesState, (p) => p.error);
export const selectPurchaseHistory = createSelector(selectPurchasesState, (p) => p.purchaseHistory);
