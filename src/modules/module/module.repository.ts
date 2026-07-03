import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/core/firebase";

import type { Module } from "./module.types";

export class ModuleRepository {

  async getAll(): Promise<Module[]> {

    const snapshot =
      await getDocs(
        collection(db, "modules")
      );

    return snapshot.docs.map((doc) => {

      const data = doc.data();

      return {

        moduleId:
          data.moduleId ?? doc.id,

        code: data.code,

        name: data.name,

        description:
          data.description,

        icon: data.icon,

        category:
          data.category,

        active:
          data.active,

        createdAt:
          data.createdAt,

        updatedAt:
          data.updatedAt,

      } as Module;

    });

  }

}

export const moduleRepository =
  new ModuleRepository();