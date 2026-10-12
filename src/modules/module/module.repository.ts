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

    const installedInMarketplace = snapshot.docs.map((doc) => {

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

    // PackFlow is part of the application catalog, so it remains installable
    // for existing workspaces even before the optional module seeder runs.
    if (!installedInMarketplace.some((item) => item.moduleId === "packflow")) {
      installedInMarketplace.push({
        moduleId: "packflow",
        code: "PACKFLOW",
        name: "KS25 PackFlow",
        description: "Pemindaian resi dan monitoring proses packing",
        icon: "package-check",
        category: "business",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return installedInMarketplace;

  }

}

export const moduleRepository =
  new ModuleRepository();
