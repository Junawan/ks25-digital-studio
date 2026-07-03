"use client";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import {
  useEffect,
  useState,
} from "react";

import { db } from "@/core/firebase";

import {
  SubscriptionPayment,
} from "../subscription-payment.types";

export function useSubscriptionPayments() {

  const [
    payments,
    setPayments,
  ] = useState<
    SubscriptionPayment[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {

    load();

  }, []);

  async function load() {

    setLoading(true);

    const q = query(

      collection(
        db,
        "subscription-payments"
      ),

      orderBy(
        "createdAt",
        "desc"
      )

    );

    const snapshot =
      await getDocs(q);

    setPayments(

      snapshot.docs.map(
        (doc) =>
          doc.data() as SubscriptionPayment
      )

    );

    setLoading(false);

  }

  return {

    payments,

    loading,

    refresh: load,

  };

}