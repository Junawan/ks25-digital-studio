"use client";

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { useEffect, useState } from "react";

import { db } from "@/core/firebase";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { isProPlanActive } from "@/modules/subscription/subscription-policy";

export type SubscriptionStatus =
  | "none"
  | "pending"
  | "approved"
  | "rejected";

export function useSubscriptionStatus() {

  const { workspace } =
    useWorkspace();

  const [status, setStatus] =
    useState<SubscriptionStatus>("none");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    load();

  }, [workspace]);

  async function load() {

    if (!workspace) {

      setLoading(false);

      return;

    }

    const q = query(

      collection(
        db,
        "subscription-payments"
      ),

      where(
        "companyId",
        "==",
        workspace.company.id
      ),

      orderBy(
        "createdAt",
        "desc"
      ),

      limit(1)

    );

    const snapshot =
      await getDocs(q);

    if (snapshot.empty) {

      setStatus("none");

      setLoading(false);

      return;

    }

    const payment =
      snapshot.docs[0].data();

    setStatus(
      payment.status === "approved" &&
        !isProPlanActive(workspace.company)
        ? "none"
        : payment.status,
    );

    setLoading(false);

  }

  return {

    status,

    loading,

    refresh: load,

  };

}
