import { FirebaseAuthRepository } from "./firebase-auth.repository";
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
    await this.repository.logout();
    if (typeof window !== "undefined") {
      for (let index = window.sessionStorage.length - 1; index >= 0; index -= 1) {
        const key = window.sessionStorage.key(index);
        if (key?.startsWith("ks25:active-employee:")) window.sessionStorage.removeItem(key);
      }
    }
  }

  async resetPassword(input: ResetPasswordInput) {
    return this.repository.resetPassword(input);
  }
}

export const authService = new AuthService();
