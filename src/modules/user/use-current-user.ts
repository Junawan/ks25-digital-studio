"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/core/providers/AuthProvider";
import { userService } from "./user.service";
import type { User } from "./user.types";

export function useCurrentUser() {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function load() {
      if (!authUser) return;

      const data = await userService.getById(authUser.uid);

      setUser(data);
    }

    load();
  }, [authUser]);

  return user;
}