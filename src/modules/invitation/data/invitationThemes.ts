import { InvitationTheme } from "@/modules/invitation/types/invitationTheme";

export const invitationThemes: InvitationTheme[] = [

  {

    id: "luxury-black",

    slug: "luxury-black",

    name: "Luxury Black",

    description:
      "Tema mewah dengan nuansa hitam elegan dan aksen emas premium.",

    image:
      "/images/invitation/preview/luxury-black.jpg",

    badge: "Premium",

    category: "Luxury",

    status: "active",

    demo: "/undangan/demo-luxury-black",
      premium:true,

  },

  {

    id: "elegant-gold",

    slug: "elegant-gold",

    name: "Elegant Gold",

    description:
      "Tema floral bernuansa ivory dengan sentuhan champagne gold.",

    image:
      "/images/invitation/preview/elegant-gold.jpg",

    badge: "Premium",

    category: "Elegant",

    status: "active",

    demo: "/undangan/demo-elegant-gold",
      premium:true,

  },

  {
    id: "modern-editorial",
    slug: "modern-editorial",
    name: "Modern Editorial",
    description: "Tampilan modern bernuansa sage dan terracotta dengan layout lapang serta sentuhan editorial.",
    image: "/images/invitation/preview/modern-editorial-collage.png",
    badge: "Baru",
    category: "Modern",
    status: "active",
    demo: "/undangan/demo-modern-editorial",
    premium: false,
  },

  {
    id: "aurora-nocturne",
    slug: "aurora-nocturne",
    name: "Aurora Nocturne",
    description: "Undangan sinematik bernuansa midnight teal, plum, dan coral dengan efek aurora yang bergerak lembut.",
    image: "/images/invitation/preview/aurora-nocturne-collage.png",
    badge: "Baru",
    category: "Modern",
    status: "active",
    demo: "/undangan/demo-aurora-nocturne",
    premium: false,
  },

];
