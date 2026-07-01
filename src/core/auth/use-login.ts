"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authService } from "./auth.service";
import {
  loginSchema,
  LoginFormValues,
} from "./login.schema";

export function useLogin() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    values: LoginFormValues
  ) => {
    try {
      setLoading(true);
      setError("");

      await authService.login(values);

      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login gagal.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    onSubmit,
  };
}