import { doc, setDoc } from "firebase/firestore";

import { db } from "@/core/firebase";

import type { User } from "./user.types";

export class UserRepository {
  async create(user: User) {
    await setDoc(doc(db, "users", user.id), user);
  }
}

export const userRepository = new UserRepository();