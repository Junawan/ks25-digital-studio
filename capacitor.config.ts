import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {

  appId: "com.ks25.mitraumkm",

  appName: "KS25",

  webDir: "www",

  server: {

    url: "https://ks25-digital-studio--ks25-digital-studio.asia-southeast1.hosted.app",

    cleartext: false,

    androidScheme: "https",

    allowNavigation: [
      "ks25-digital-studio--ks25-digital-studio.asia-southeast1.hosted.app",
    ],

  },

};

export default config;