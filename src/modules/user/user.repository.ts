import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "@/core/firebase";

import type { User } from "./user.types";

export class UserRepository {
  async create(user: User) {
    await setDoc(doc(db, "users", user.userId), user);
  }

  async getById(userId: string) {
  const snapshot = await getDoc(doc(db, "users", userId));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as User;
}
}

export const userRepository = new UserRepository();