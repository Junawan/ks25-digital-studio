export interface DashboardProduct {

  moduleId: string;

  name: string;

  shortName: string;

  description: string;

  category:
    | "sales"
    | "business"
    | "creative"
    | "fulfillment";

  image: string;

  color: string;

  route: string;

  ready: boolean;

}

export const dashboardProducts: DashboardProduct[] = [

  {
    moduleId: "live-assistant",
    name: "KS25 Live Assistant",
    shortName: "Live Assistant",
    description:
      "Asisten AI untuk membantu live marketplace.",
    category: "sales",
    image: "/images/modules/live2.png",
    color: "from-violet-600 to-purple-700",
    route: "/live-assistant",
    ready: true,
  },

  {
    moduleId: "pos",
    name: "KS25 POS",
    shortName: "POS Kasir",
    description:
      "Aplikasi kasir modern untuk UMKM.",
    category: "business",
    image: "/images/modules/pos2.png",
    color: "from-blue-600 to-cyan-600",
    route: "#",
    ready: false,
  },

  {
    moduleId: "store",
    name: "KS25 Store",
    shortName: "Website Toko",
    description:
      "Website toko online profesional.",
    category: "sales",
    image: "/images/modules/store2.png",
    color: "from-emerald-600 to-green-600",
    route: "#",
    ready: false,
  },

  {
    moduleId: "attendance",
    name: "KS25 Attendance",
    shortName: "Absensi",
    description:
      "Absensi karyawan berbasis cloud.",
    category: "business",
    image: "/images/modules/attendance2.png",
    color: "from-orange-500 to-amber-500",
    route: "#",
    ready: false,
  },

  {
    moduleId: "invitation",
    name: "KS25 Invitation",
    shortName: "Undangan Digital",
    description:
      "Website undangan digital premium.",
    category: "creative",
    image: "/images/modules/invitation2.png",
    color: "from-pink-500 to-rose-500",
    route: "#",
    ready: false,
  },

  {
    moduleId: "packflow",
    name: "KS25 PackFlow",
    shortName: "Scanner Resi",
    description:
      "Scanner resi dan monitoring packing.",
    category: "fulfillment",
    image: "/images/modules/packflow2.png",
    color: "from-cyan-500 to-sky-500",
    route: "#",
    ready: false,
  },

];