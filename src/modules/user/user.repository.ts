import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "@/core/firebase";

import type { User } from "./user.types";

export class UserRepository {
  async create(user: User) {
    await setDoc(doc(db, "users", user.userId), user);
  }

  async getById(userId: string) {

  const snapshot =
    await getDoc(
      doc(db, "users", userId)
    );
    console.log("USER SNAPSHOT EXISTS:", snapshot.exists());

if (snapshot.exists()) {
  console.log("USER SNAPSHOT DATA:", snapshot.data());
}

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  const result = {
  userId: data.userId,
  companyId: data.companyId,
  email: data.email,
  fullName: data.fullName,
  photoUrl: data.photoUrl ?? null,
  phone: data.phone ?? null,
  role: data.role,
  isSystemAdmin: data.isSystemAdmin ?? false,
  status: data.status,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
};

console.log("USER RESULT:", result);

return result;

  return {

    userId: data.userId,

    companyId: data.companyId,

    email: data.email,

    fullName: data.fullName,

    photoUrl: data.photoUrl ?? null,

    phone: data.phone ?? null,

    role: data.role,

    isSystemAdmin:
      data.isSystemAdmin ?? false,

    status: data.status,

    createdAt: data.createdAt,

    updatedAt: data.updatedAt,

  } satisfies User;

}
}

export const userRepository = new UserRepository();