import { registerPlugin } from "@capacitor/core";

export interface ScreenPlugin {
  keepAwake(): Promise<void>;
  allowSleep(): Promise<void>;
}

export const Screen = registerPlugin<ScreenPlugin>("Screen");