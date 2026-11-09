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

];
