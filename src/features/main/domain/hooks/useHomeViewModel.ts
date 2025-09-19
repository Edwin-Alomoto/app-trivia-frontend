import { useCallback, useMemo } from 'react';

import { useAppDispatch } from '../../shared/domain/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/domain/hooks/useAppSelector';
import { useDemoStatus } from '../../shared/domain/hooks/useDemoStatus';
import {
  fetchPointBalance,
  fetchTransactions,
} from '../../app/store/slices/pointsSlice';
import { fetchNotifications, selectUnreadCount as selectUnreadCountMemo } from '../../app/store/slices/notificationsSlice';
import { fetchCategories, selectCategories as selectCategoriesMemo } from '../../app/store/slices/triviaSlice';
import { fetchRewards, selectAvailableRewards } from '../../app/store/slices/rewardsSlice';
import { fetchRaffles, selectActiveRaffles } from '../../app/store/slices/rafflesSlice';
import { fetchSurveys } from '../../app/store/slices/surveysSlice';
import { fetchPackages } from '../../app/store/slices/purchasesSlice';

export const useHomeViewModel = () => {
  const dispatch = useAppDispatch();

  // Estado global necesario para Home
  const { user } = useAppSelector((state) => state.auth);
  const { balance, isLoading: pointsLoading } = useAppSelector((state: any) => state.points);
  const unreadCount = useAppSelector(selectUnreadCountMemo);
  const categories = useAppSelector(selectCategoriesMemo);
  const rewards = useAppSelector(selectAvailableRewards);
  const raffles = useAppSelector(selectActiveRaffles);
  const { surveys } = useAppSelector((state: any) => state.surveys);

  const demo = useDemoStatus();

  // Valores seguros para UI
  const safeRewards = useMemo(() => (Array.isArray(rewards) ? rewards : []), [rewards]);
  const safeRaffles = useMemo(() => (Array.isArray(raffles) ? raffles : []), [raffles]);
  const safeCategories = useMemo(() => (Array.isArray(categories) ? categories : []), [categories]);
  const safeSurveys = useMemo(() => (Array.isArray(surveys) ? surveys : []), [surveys]);
  const safeUnreadCount = useMemo(
    () => (typeof unreadCount === 'number' ? unreadCount : 0),
    [unreadCount]
  );

  const loadData = useCallback(async () => {
    await Promise.all([
      dispatch(fetchPointBalance()),
      dispatch(fetchTransactions()),
      dispatch(fetchNotifications()),
      dispatch(fetchCategories()),
      dispatch(fetchRewards()),
      dispatch(fetchRaffles()),
      dispatch(fetchSurveys()),
      dispatch(fetchPackages()),
    ]);
  }, [dispatch]);

  const refreshPoints = useCallback(async () => {
    await Promise.all([
      dispatch(fetchPointBalance()),
      dispatch(fetchTransactions()),
    ]);
  }, [dispatch]);

  return {
    // datos
    user,
    balance,
    pointsLoading,
    unreadCount,
    categories,
    rewards,
    raffles,
    surveys,
    demo,
    // derivados seguros
    safeRewards,
    safeRaffles,
    safeCategories,
    safeSurveys,
    safeUnreadCount,
    // acciones
    loadData,
    refreshPoints,
  } as const;
};


