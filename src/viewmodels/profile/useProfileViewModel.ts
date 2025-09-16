import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchPointBalance, selectPointBalance } from '../../store/slices/pointsSlice';
import { logoutUser } from '../../features/auth/domain/store/authSlice';

export function useProfileViewModel() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s: any) => s.auth);
  const balance = useAppSelector(selectPointBalance);

  const refresh = useCallback(async () => {
    await dispatch(fetchPointBalance());
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    user,
    balance,
    refresh,
    logout,
  };
}


