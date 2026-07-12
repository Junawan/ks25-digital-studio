"use client";

import { doc, setDoc } from "firebase/firestore";

import { db } from "@/core/firebase";
import { Button } from "@/components/ui/button";

const modules = [
  {
    moduleId: "live-assistant",
    name: "Live Assistant",
    description: "Asisten Live Shopping berbasis AI",
    icon: "monitor-smartphone",
    category: "marketing",
  },
  {
    moduleId: "pos",
    name: "POS Kasir",
    description: "Point of Sale untuk UMKM",
    icon: "shopping-cart",
    category: "business",
  },
  {
    moduleId: "digital-invitation",
    name: "Digital Invitation",
    description: "Platform Undangan Digital",
    icon: "mail",
    category: "marketing",
  },
  {
    moduleId: "online-store",
    name: "Online Store",
    description: "Website Toko Online",
    icon: "store",
    category: "business",
  },
];

export default function SeedModulesPage() {
  async function handleSeed() {
    for (const item of modules) {
      await setDoc(doc(db, "modules", item.moduleId), {
        name: item.name,
        description: item.description,
        icon: item.icon,
        category: item.category,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    alert("Seeder selesai.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Button onClick={handleSeed}>
        Seed Modules
      </Button>
    </main>
  );
}