"use client";

import { Button } from "@/components/ui/button";

interface Props {
  onSave: () => void;
}

export default function SaveSettingsFooter({
  onSave,
}: Props) {
  return (
    <div className="sticky bottom-0 z-10 border-t bg-background py-4">
      <div className="flex justify-end">
        <Button onClick={onSave}>
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}