import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@shared/domain/hooks';
import { fetchNotifications, markAsRead, markAllAsRead, selectNotifications, selectNotificationsError, selectNotificationsLoading, selectUnreadCount } from '@store/slices/notificationsSlice';

export function useNotificationsViewModel() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  const isLoading = useAppSelector(selectNotificationsLoading);
  const error = useAppSelector(selectNotificationsError);

  const refresh = useCallback(async () => {
    await dispatch(fetchNotifications());
  }, [dispatch]);

  const markOne = useCallback(async (notificationId: string) => {
    await dispatch(markAsRead(notificationId));
  }, [dispatch]);

  const markAll = useCallback(async () => {
    await dispatch(markAllAsRead());
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    notifications: items,
    unreadCount,
    isLoading,
    error,
    refresh,
    markOne,
    markAll,
  };
}


