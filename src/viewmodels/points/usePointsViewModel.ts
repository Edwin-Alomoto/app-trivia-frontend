import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../shared/domain/hooks';
import { fetchPointBalance, fetchTransactions, selectPointBalance, selectPointTransactions, selectPointsError, selectPointsLoading } from '../../app/store/slices/pointsSlice';

export function usePointsViewModel() {
  const dispatch = useAppDispatch();
  const balance = useAppSelector(selectPointBalance);
  const transactions = useAppSelector(selectPointTransactions);
  const isLoading = useAppSelector(selectPointsLoading);
  const error = useAppSelector(selectPointsError);

  const refresh = useCallback(async () => {
    await Promise.all([
      dispatch(fetchPointBalance()),
      dispatch(fetchTransactions()),
    ]);
  }, [dispatch]);

  useEffect(() => {
    // Carga inicial al montar VM
    refresh();
  }, [refresh]);

  return {
    balance,
    transactions,
    isLoading,
    error,
    refresh,
  };
}


