import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ks25.mitraumkm",

  appName: "KS25",

  webDir: "www",

  server: {
    url: "https://ks25studio.web.id",

    cleartext: false,

    androidScheme: "https",

    allowNavigation: [
  "ks25studio.web.id",
],
  },
};

export default config;