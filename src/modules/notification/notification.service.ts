import { notificationRepository } from "./notification.repository";

import type { Notification } from "./notification.types";

export class NotificationService {

  async broadcastCompany(
    companyId: string,
    notification: Parameters<typeof notificationRepository.broadcastCompany>[1],
  ) {
    return notificationRepository.broadcastCompany(companyId, notification);
  }

  async createForCompany(
    companyId: string,
    receiverId: string,
    notification: Parameters<typeof notificationRepository.createForCompany>[2],
  ) {
    return notificationRepository.createForCompany(companyId, receiverId, notification);
  }

  async create(
    notification: Notification
  ) {
    return notificationRepository.create(
      notification
    );
  }

  async getNotifications(

  isSystemAdmin: boolean,

  companyId: string,

  userId: string

) {

  if (isSystemAdmin) {

    return notificationRepository
      .getSystemNotifications();

  }

  return notificationRepository
    .getUserNotifications(

      companyId,

      userId

    );

}

async getUnreadCount(

  isSystemAdmin: boolean,

  companyId: string,

  userId: string

) {

  if (isSystemAdmin) {

    return notificationRepository
      .getSystemUnreadCount();

  }

  return notificationRepository
    .getUserUnreadCount(

      companyId,

      userId

    );

}

  async getLatest(

    companyId: string,

    userId: string

  ) {
    return notificationRepository.getLatest(

      companyId,

      userId

    );
  }

  async markAsRead(notificationId: string, userId?: string) {
    return notificationRepository.markAsRead(
      notificationId,
      userId,
    );
  }

}

export const notificationService =
  new NotificationService();
