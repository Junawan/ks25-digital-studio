import { notificationService } from "../notification.service";

import type {
  Notification,
} from "../notification.types";

export class CreateNotificationUseCase {

  async execute(

    input: Omit<
      Notification,
      "notificationId" | "createdAt"
    >

  ) {

    const notification: Notification = {

      notificationId:
        crypto.randomUUID(),

      createdAt:
        new Date(),

      ...input,

    };

    await notificationService.create(
      notification
    );

    return notification;

  }

}

export const
createNotificationUseCase =
new CreateNotificationUseCase();