"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authService } from "./auth.service";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "./forgot-password.schema";
import { getFirebaseAuthErrorMessage } from "./firebase-auth-error";
import { FirebaseError } from "firebase/app";

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (
  values: ForgotPasswordFormValues
) => {
  try {
    setLoading(true);
    setError("");
    setSuccess(false);

    await authService.resetPassword(values);

    setSuccess(true);
  } catch (error) {
    console.error(error);

    if (
      error instanceof FirebaseError &&
      error.code === "auth/user-not-found"
    ) {
      // Demi keamanan, jangan beri tahu apakah email terdaftar.
      setSuccess(true);
      return;
    }

    setError(getFirebaseAuthErrorMessage(error));
  } finally {
    setLoading(false);
  }
};

  return {
    form,
    loading,
    error,
    success,
    onSubmit,
  };
}