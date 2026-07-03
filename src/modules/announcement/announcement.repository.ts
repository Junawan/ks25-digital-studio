import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  DocumentData,
} from "firebase/firestore";

import { db } from "@/core/firebase";

import type {
  Announcement,
} from "./announcement.types";

class AnnouncementRepository {

  private readonly collectionName =
    "announcements";

  async getAll(): Promise<Announcement[]> {

    const q = query(

      collection(
        db,
        this.collectionName
      ),

      where(
        "active",
        "==",
        true
      ),

      orderBy(
        "publishedAt",
        "desc"
      )

    );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map((doc) =>

      this.map(
        doc.id,
        doc.data()
      )

    );

  }

  private map(
    id: string,
    data: DocumentData
  ): Announcement {

    return {

      announcementId: id,

      title:
        data.title,

      content:
        data.content,

      category:
        data.category,

      image:
        data.image ?? null,

      version:
        data.version ?? null,

      active:
        data.active,

      publishedAt:
        data.publishedAt.toDate(),

      publishedBy:
        data.publishedBy,

    };

  }

}

export const
announcementRepository =
new AnnouncementRepository();