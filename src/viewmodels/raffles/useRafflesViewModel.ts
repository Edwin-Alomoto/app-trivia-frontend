import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../shared/domain/hooks';
import { fetchRaffles, fetchUserParticipations, selectActiveRaffles, selectRafflesLoading, selectRafflesError, selectUserParticipations } from '../../app/store/slices/rafflesSlice';

export function useRafflesViewModel() {
  const dispatch = useAppDispatch();
  const active = useAppSelector(selectActiveRaffles);
  const userParticipations = useAppSelector(selectUserParticipations);
  const isLoading = useAppSelector(selectRafflesLoading);
  const error = useAppSelector(selectRafflesError);
  const { winners } = useAppSelector((s: any) => s.raffles);

  const refresh = useCallback(async () => {
    await Promise.all([
      dispatch(fetchRaffles()),
      dispatch(fetchUserParticipations()),
    ]);
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    active,
    userParticipations,
    winners,
    isLoading,
    error,
    refresh,
  };
}


