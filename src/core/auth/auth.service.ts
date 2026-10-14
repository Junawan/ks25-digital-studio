import { FirebaseAuthRepository } from "./firebase-auth.repository";
import { removePushDevice } from "@/modules/notification/push-device.repository";
import type {
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "./types";

export class AuthService {
  constructor(
    private readonly repository = new FirebaseAuthRepository()
  ) {}

  async register(input: RegisterInput) {
    return this.repository.register(input);
  }

  async login(input: LoginInput) {
    return this.repository.login(input);
  }

  async logout() {
    if (typeof window !== "undefined") {
      const pushToken = window.localStorage.getItem("ks25:push-token");
      if (pushToken) {
        try {
          await removePushDevice(pushToken);
        } catch (error) {
          console.warn("Push device registration could not be removed during logout:", error);
        }
        window.localStorage.removeItem("ks25:push-token");
      }
      for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
        const key = window.localStorage.key(index);
        if (key?.startsWith("ks25:active-employee:")) window.localStorage.removeItem(key);
      }
      for (let index = window.sessionStorage.length - 1; index >= 0; index -= 1) {
        const key = window.sessionStorage.key(index);
        if (key?.startsWith("ks25:active-employee:")) window.sessionStorage.removeItem(key);
      }
    }
    await this.repository.logout();
  }

  async resetPassword(input: ResetPasswordInput) {
    return this.repository.resetPassword(input);
  }
}

export const authService = new AuthService();
