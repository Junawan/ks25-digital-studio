import { registerPlugin } from "@capacitor/core";

export interface ShortcutPinOptions {
  id: string;
  title: string;
  route: string;
  icon: string;
}

export interface ShortcutPlugin {

  pin(
    options: ShortcutPinOptions
  ): Promise<{
    success: boolean;
  }>;

  isPinned(
    options: {
      id: string;
    }
  ): Promise<{
    pinned: boolean;
  }>;

  getPinned(): Promise<{
    shortcuts: string[];
  }>;

}

export const Shortcut =
  registerPlugin<ShortcutPlugin>(
    "Shortcut"
  );