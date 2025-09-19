import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@shared/domain/hooks';
import { fetchPackages, purchasePoints, selectPointPackages, selectPurchaseHistory, selectPurchasesError, selectPurchasesLoading } from '@store/slices/purchasesSlice';

export function usePurchasesViewModel() {
  const dispatch = useAppDispatch();
  const packages = useAppSelector(selectPointPackages);
  const isLoading = useAppSelector(selectPurchasesLoading);
  const error = useAppSelector(selectPurchasesError);
  const purchaseHistory = useAppSelector(selectPurchaseHistory);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    await dispatch(fetchPackages());
  }, [dispatch]);

  const selectPackage = useCallback((packageId: string) => {
    setSelectedPackageId(packageId);
  }, []);

  const confirmPurchase = useCallback(async () => {
    if (!selectedPackageId) return { ok: false as const, error: 'No hay paquete seleccionado' };
    try {
      await dispatch(purchasePoints(selectedPackageId)).unwrap();
      setSelectedPackageId(null);
      return { ok: true as const };
    } catch (e: any) {
      return { ok: false as const, error: e?.message || 'Error en la compra' };
    }
  }, [dispatch, selectedPackageId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    packages,
    isLoading,
    error,
    purchaseHistory,
    selectedPackageId,
    selectPackage,
    confirmPurchase,
    refresh,
  };
}


