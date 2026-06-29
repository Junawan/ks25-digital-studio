import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import { auth } from "@/core/firebase";

import type {
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "./types";

export class FirebaseAuthRepository {
  async register(input: RegisterInput) {
    return createUserWithEmailAndPassword(
      auth,
      input.email,
      input.password
    );
  }

  async login(input: LoginInput) {
    return signInWithEmailAndPassword(
      auth,
      input.email,
      input.password
    );
  }

  async logout() {
    return signOut(auth);
  }

  async resetPassword(input: ResetPasswordInput) {
    return sendPasswordResetEmail(auth, input.email);
  }
}