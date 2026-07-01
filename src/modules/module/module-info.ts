export interface ModuleInfo {
  name: string;
  description: string;
  route: string;
  icon?: string;
}

export const MODULE_INFO: Record<string, ModuleInfo> = {
  "live-assistant": {
    name: "Live Assistant",
    description: "Asisten Live Shopping berbasis AI",
    route: "/live-assistant",
  },

  "digital-invitation": {
    name: "Digital Invitation",
    description: "Platform Undangan Digital",
    route: "/digital-invitation",
  },

  pos: {
    name: "POS Kasir",
    description: "Point of Sale untuk UMKM",
    route: "/pos",
  },

  "online-store": {
    name: "Online Store",
    description: "Website Toko Online",
    route: "/online-store",
  },
};