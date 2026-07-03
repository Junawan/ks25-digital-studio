import { notificationRepository } from "./notification.repository";

import type { Notification } from "./notification.types";

export class NotificationService {

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

  async markAsRead(
    notificationId: string
  ) {
    return notificationRepository.markAsRead(
      notificationId
    );
  }

}

export const notificationService =
  new NotificationService();