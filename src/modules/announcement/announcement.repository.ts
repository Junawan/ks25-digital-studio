import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/core/firebase";

import type {
  Announcement,
} from "./announcement.types";

export class AnnouncementRepository {

  private readonly collectionName =
    "announcements";

    async create(
  announcement: Announcement
): Promise<void> {

  const cleanData =
    Object.fromEntries(
      Object.entries(announcement).filter(
        ([, value]) => value !== undefined
      )
    );

  await setDoc(
    doc(
      db,
      this.collectionName,
      announcement.announcementId
    ),
    cleanData
  );

}

async update(
  id: string,
  data: Partial<Announcement>
): Promise<void> {

  await updateDoc(
    doc(
      db,
      this.collectionName,
      id
    ),
    data
  );

}

async delete(
  id: string
): Promise<void> {

  await deleteDoc(
    doc(
      db,
      this.collectionName,
      id
    )
  );

}

async findById(
  id: string
): Promise<Announcement | null> {

  const snapshot =
    await getDoc(
      doc(
        db,
        this.collectionName,
        id
      )
    );

  if (!snapshot.exists()) {

    return null;

  }

  return this.map(
    snapshot.id,
    snapshot.data()
  );

}

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

    title: data.title,

    content: data.content,

    category: data.category,

    active: data.active,

    isPopup: data.isPopup ?? false,

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