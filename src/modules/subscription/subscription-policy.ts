import { addMonths } from "date-fns";

import { appConfig } from "@/core/config/app.config";
import type { Company } from "@/modules/company/company.types";

export const WEB_STARTER_PERIOD_MONTHS =
  appConfig.subscription.webStarterMonths;
const WEB_STARTER_POLICY_START = new Date(
  appConfig.subscription.webStarterPolicyStartsAt,
);
export const ANDROID_UPGRADE_PROMPT_KEY = "ks25-android-upgrade-prompt";

export function toSubscriptionDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    const date = value.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime())
      ? date
      : null;
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export function getWebStarterExpiresAt(company: Company | null | undefined) {
  const createdAt = toSubscriptionDate(company?.createdAt);
  return createdAt && createdAt >= WEB_STARTER_POLICY_START
    ? addMonths(createdAt, WEB_STARTER_PERIOD_MONTHS)
    : null;
}

export function isProPlanActive(
  company: Company | null | undefined,
  now = new Date(),
) {
  if (company?.plan !== "pro") return false;

  const expiresAt = toSubscriptionDate(company.planExpiresAt);
  return expiresAt !== null && expiresAt.getTime() > now.getTime();
}

export function isWebStarterExpired(
  company: Company | null | undefined,
  now = new Date(),
) {
  if (isProPlanActive(company, now)) return false;

  const expiresAt = getWebStarterExpiresAt(company);
  return expiresAt !== null && expiresAt.getTime() <= now.getTime();
}
