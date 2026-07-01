import { UserCredential, deleteUser } from "firebase/auth";
import { addDays } from "date-fns";
import { v4 as uuid } from "uuid";

import { authService } from "./auth.service";
import type { RegisterInput } from "./types";

import { companyService } from "@/modules/company/company.service";
import { userService } from "@/modules/user/user.service";
import { subscriptionService } from "@/modules/subscription/subscription.service";

export class RegisterService {
  async execute(input: RegisterInput): Promise<UserCredential> {
    const credential = await authService.register(input);

    try {
      const uid = credential.user.uid;
      const companyId = uuid();

      const now = new Date();
      const trialEndsAt = addDays(now, 14);

      await companyService.create({
        id: companyId,
        ownerId: uid,
        name: input.companyName,
        slug: input.companyName
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-"),
        email: input.email,
        phone: null,
        logo: null,
        address: null,
        plan: "trial",
        status: "active",
        trialEndsAt,
        createdAt: now,
        updatedAt: now,
      });

      await userService.create({
        userId: uid,
        companyId,
        email: input.email,
        fullName: input.fullName,
        photoUrl: null,
        phone: null,
        role: "owner",
        status: "active",
        createdAt: now,
        updatedAt: now,
      });

      await subscriptionService.create({
        subscriptionId: uuid(),
        companyId,
        plan: "trial",
        status: "active",
        amount: 0,
        startedAt: now,
        expiredAt: trialEndsAt,
        createdAt: now,
      });

      return credential;
    } catch (error) {
      await deleteUser(credential.user);
      throw error;
    }
  }
}

export const registerService = new RegisterService();