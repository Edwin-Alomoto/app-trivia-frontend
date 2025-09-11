import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchRewards, fetchUserRewards, selectAvailableRewards, selectUserRewards, selectRewardsError, selectRewardsLoading } from '../../store/slices/rewardsSlice';

export function useRewardsViewModel() {
  const dispatch = useAppDispatch();
  const available = useAppSelector(selectAvailableRewards);
  const userRewards = useAppSelector(selectUserRewards);
  const isLoading = useAppSelector(selectRewardsLoading);
  const error = useAppSelector(selectRewardsError);

  const refresh = useCallback(async () => {
    await Promise.all([
      dispatch(fetchRewards()),
      dispatch(fetchUserRewards()),
    ]);
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    available,
    userRewards,
    isLoading,
    error,
    refresh,
  };
}


