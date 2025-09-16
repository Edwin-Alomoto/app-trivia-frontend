import { Notification } from '../../shared/domain/types';

export interface INotificationsService {
  getNotifications(): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<string>;
  markAllAsRead(): Promise<void>;
}


