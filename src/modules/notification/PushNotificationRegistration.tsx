"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { savePushDevice } from "./push-device.repository";

export default function PushNotificationRegistration() {
  const { workspace } = useWorkspace();
  const router = useRouter();
  const companyId = workspace?.company.id;
  const userId = workspace?.user.userId;

  useEffect(() => {
    if (Capacitor.getPlatform() !== "android" || !companyId || !userId) return;
    let active = true;
    const listeners: Array<{ remove: () => Promise<void> }> = [];

    void (async () => {
      try {
        listeners.push(await PushNotifications.addListener("registration", (registration) => {
          if (!active) return;
          window.localStorage.setItem("ks25:push-token", registration.value);
          void savePushDevice(registration.value).catch((error) => console.error("FCM device registration could not be saved:", error));
        }));
        listeners.push(await PushNotifications.addListener("registrationError", (error) => {
          console.error("FCM registration failed:", error.error);
        }));
        listeners.push(await PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
          const actionUrl = action.notification.data?.actionUrl;
          if (typeof actionUrl === "string" && actionUrl.startsWith("/")) router.push(actionUrl);
        }));

        await PushNotifications.createChannel({ id: "ks25_general", name: "Pemberitahuan KS25", description: "Notifikasi operasional dan informasi perusahaan", importance: 4, visibility: 1 });
        const current = await PushNotifications.checkPermissions();
        const permission = current.receive === "granted" ? current : await PushNotifications.requestPermissions();
        if (active && permission.receive === "granted") await PushNotifications.register();
      } catch (error) {
        console.error("Push notifications are not configured on this Android installation:", error);
      }
    })();

    return () => {
      active = false;
      listeners.forEach((listener) => void listener.remove());
    };
  }, [companyId, userId, router]);

  return null;
}
