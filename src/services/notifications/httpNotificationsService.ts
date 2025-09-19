import { INotificationsService } from './types';
import { Notification } from '@shared/domain/types';

export class HttpNotificationsService implements INotificationsService {
  async getNotifications(): Promise<Notification[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }
  async markAsRead(notificationId: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 100));
    return notificationId;
  }
  async markAllAsRead(): Promise<void> {
    await new Promise((r) => setTimeout(r, 100));
  }
}


