export type OpeningTemplate = {

  id: string;

  category:
    | "Muslim"
    | "Non Muslim"
    | "Universal";

  name: string;

  heading: string;

  content: string;

};

export const openingTemplates: OpeningTemplate[] = [

  {
    id: "muslim-formal",

    category: "Muslim",

    name: "Muslim Formal",

    heading:
      "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",

    content:
`Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.`,
  },

  {
    id: "muslim-modern",

    category: "Muslim",

    name: "Muslim Modern",

    heading:
      "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",

    content:
`Dengan memohon rahmat Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menjadi bagian dari momen istimewa dalam perjalanan cinta kami. Kehadiran dan doa restu Anda akan menjadi kebahagiaan yang tak ternilai bagi kami.`,
  },

  {
    id: "muslim-singkat",

    category: "Muslim",

    name: "Muslim Singkat",

    heading:
      "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",

    content:
`Dengan memohon rahmat Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami dan memberikan doa restu kepada kedua mempelai.`,
  },

  {
    id: "nonmuslim-formal",

    category: "Non Muslim",

    name: "Non Muslim Formal",

    heading:
      "With Gratitude",

    content:
`Dengan penuh rasa syukur kepada Tuhan Yang Maha Esa, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan menjadi saksi atas momen bahagia dalam perjalanan hidup kami. Kehadiran dan doa terbaik Anda merupakan kehormatan bagi kami.`,
  },

  {
    id: "nonmuslim-modern",

    category: "Non Muslim",

    name: "Non Muslim Modern",

    heading:
      "Wedding Invitation",

    content:
`Dengan penuh sukacita kami mengundang Anda untuk berbagi kebahagiaan bersama kami dalam hari istimewa pernikahan kami. Kehadiran Anda akan membuat momen ini semakin bermakna.`,
  },

  {
    id: "universal-formal",

    category: "Universal",

    name: "Universal Formal",

    heading:
      "Wedding Invitation",

    content:
`Dengan penuh kebahagiaan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami. Kehadiran dan doa restu Anda merupakan kehormatan serta kebahagiaan bagi kami.`,
  },

  {
    id: "universal-modern",

    category: "Universal",

    name: "Universal Modern",

    heading:
      "Save The Date",

    content:
`Kami dengan penuh sukacita mengundang Anda untuk merayakan hari bahagia kami. Mari hadir dan menjadi bagian dari cerita indah perjalanan cinta kami.`,
  },

];