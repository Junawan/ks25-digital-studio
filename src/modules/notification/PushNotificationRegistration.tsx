"use client";

import { useEffect, useRef } from "react";
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
  const savingTokens = useRef(new Set<string>());

  useEffect(() => {
    if (Capacitor.getPlatform() !== "android" || !companyId || !userId) return;
    let active = true;
    const listeners: Array<{ remove: () => Promise<void> }> = [];

    async function persistToken(token: string) {
      const attemptKey = `${userId}:${token}`;
      if (savingTokens.current.has(attemptKey)) return;
      savingTokens.current.add(attemptKey);
      try {
        let lastError: unknown;
        for (let attempt = 0; attempt < 4 && active; attempt += 1) {
          try {
            await savePushDevice(token);
            window.localStorage.setItem("ks25:push-token", token);
            return;
          } catch (error) {
            lastError = error;
            const message = error instanceof Error ? error.message : String(error);
            // Retry transient server/network failures; auth/profile errors need user/session repair.
            if (/\(4\d\d:/.test(message)) break;
            if (attempt < 3) await new Promise((resolve) => window.setTimeout(resolve, 1200 * (attempt + 1)));
          }
        }
        const reason = lastError instanceof Error ? lastError.message : String(lastError);
        console.error(`FCM device registration could not be saved after retries: ${reason}`, lastError);
      } finally {
        savingTokens.current.delete(attemptKey);
      }
    }

    void (async () => {
      try {
        listeners.push(await PushNotifications.addListener("registration", (registration) => {
          if (!active) return;
          void persistToken(registration.value);
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
        if (active && permission.receive === "granted") {
          const savedToken = window.localStorage.getItem("ks25:push-token");
          if (savedToken) void persistToken(savedToken);
          await PushNotifications.register();
        }
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
