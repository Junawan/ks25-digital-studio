"use client";

import { useEffect, useState } from "react";

import { Announcement } from "../announcement.types";
import {
  createAnnouncementUseCase,
  updateAnnouncementUseCase,
} from "../announcement.service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

interface Props {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  announcement?: Announcement;

  publishedBy: string;

  onSuccess?: () => void;
}

export default function AnnouncementDialog({
  open,
  onOpenChange,
  announcement,
  publishedBy,
  onSuccess,
}: Props) {

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [category, setCategory] =
    useState<
      | "feature"
      | "improvement"
      | "bugfix"
      | "maintenance"
      | "promotion"
    >("feature");

  const [isPopup, setIsPopup] =
    useState(false);

  const [active, setActive] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    if (!announcement) {

      setTitle("");

      setContent("");

      setCategory("feature");

      setIsPopup(false);

      setActive(true);

      return;

    }

    setTitle(
      announcement.title
    );

    setContent(
      announcement.content
    );

    setCategory(
      announcement.category
    );

    setIsPopup(
      announcement.isPopup
    );

    setActive(
      announcement.active
    );

  }, [announcement, open]);

  async function handleSave() {

    if (!title.trim()) {

      alert("Judul wajib diisi.");

      return;

    }

    if (!content.trim()) {

      alert("Isi pengumuman wajib diisi.");

      return;

    }

    try {

      setSaving(true);

      if (announcement) {

        await updateAnnouncementUseCase.execute(
          announcement.announcementId,
          {
            title,
            content,
            category,
            isPopup,
            active,
          }
        );

      } else {

        await createAnnouncementUseCase.execute({

          title,

          content,

          category,

          isPopup,

          publishedBy,

        });

      }

      onSuccess?.();

      onOpenChange(false);

    } finally {

      setSaving(false);

    }

  }

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="max-w-xl">

        <DialogHeader>

          <DialogTitle>

            {announcement
              ? "Edit Pengumuman"
              : "Pengumuman Baru"}

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-5">

          <div>

            <label className="mb-2 block text-sm font-medium">

              Judul

            </label>

            <Input
              value={title}
              onChange={(e)=>
                setTitle(e.target.value)
              }
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">

              Isi Pengumuman

            </label>

            <Textarea
              rows={6}
              value={content}
              onChange={(e)=>
                setContent(e.target.value)
              }
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">

              Kategori

            </label>

            <select
              value={category}
              onChange={(e)=>
                setCategory(
                  e.target.value as typeof category
                )
              }
              className="
                w-full
                rounded-md
                border
                bg-background
                px-3
                py-2
              "
            >

              <option value="feature">
                ✨ Feature
              </option>

              <option value="improvement">
                🚀 Improvement
              </option>

              <option value="bugfix">
                🛠 Bug Fix
              </option>

              <option value="maintenance">
                ⚠ Maintenance
              </option>

              <option value="promotion">
                🎁 Promotion
              </option>

            </select>

          </div>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={isPopup}
              onChange={(e)=>
                setIsPopup(
                  e.target.checked
                )
              }
            />

            Tampilkan sebagai popup

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={active}
              onChange={(e)=>
                setActive(
                  e.target.checked
                )
              }
            />

            Aktif

          </label>

          <Button
            className="w-full"
            disabled={saving}
            onClick={handleSave}
          >

            {saving
              ? "Menyimpan..."
              : announcement
                ? "Simpan Perubahan"
                : "Publish"}

          </Button>

        </div>

      </DialogContent>

    </Dialog>

  );

}