import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/core/firebase";

import type { Module } from "./module.types";

export class ModuleRepository {
  async getAll(): Promise<Module[]> {
  const snapshot = await getDocs(collection(db, "modules"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Module, "id">),
  }));
}
}

export const moduleRepository =
  new ModuleRepository();