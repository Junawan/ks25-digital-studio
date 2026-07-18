"use client";

import SettingsContent from "../components/SettingsContent";
import { PosSettingsProvider } from "../context/PosSettingsContext";


export default function SettingsPage() {
  return (
    <PosSettingsProvider>
      <SettingsContent />
    </PosSettingsProvider>
  );
}