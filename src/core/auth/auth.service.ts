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
    return this.repository.logout();
  }

  async resetPassword(input: ResetPasswordInput) {
    return this.repository.resetPassword(input);
  }
}

export const authService = new AuthService();