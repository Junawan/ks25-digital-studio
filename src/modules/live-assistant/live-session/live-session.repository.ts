import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "@/core/firebase";

import { LiveSession } from "./live-session.types";

export class LiveSessionRepository {
  private readonly collectionName =
    "liveSessions";

  async createOrResume(
  data: LiveSession
): Promise<void> {

  const q = query(
    collection(db, this.collectionName),
    where("companyId", "==", data.companyId),
    where("playlistId", "==", data.playlistId),
    where("status", "==", "active")
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {

    const session = snapshot.docs[0];

    const value =
      session.data() as LiveSession;

    const lastOpened =
      new Date(value.lastOpenedAt);

    const now = new Date();

    const diffMinutes =
      (now.getTime() - lastOpened.getTime()) /
      1000 /
      60;

    // masih dianggap sesi yang sama
    if (diffMinutes <= 30) {

      await updateDoc(
        session.ref,
        {
          lastOpenedAt: now,
        }
      );

      return;
    }

    // sesi lama otomatis selesai

    await updateDoc(
      session.ref,
      {
        status: "finished",
        endedAt: lastOpened,
      }
    );
  }

  const cleanData = Object.fromEntries(
    Object.entries(data).filter(
      ([, value]) => value !== undefined
    )
  );

  await setDoc(
    doc(
      db,
      this.collectionName,
      data.sessionId
    ),
    cleanData
  );
}

  async finish(
    sessionId: string
  ): Promise<void> {

    await updateDoc(
      doc(
        db,
        this.collectionName,
        sessionId
      ),
      {
        status: "finished",
        endedAt: new Date(),
      }
    );
  }

  async findHistoryByCompany(
  companyId: string
): Promise<LiveSession[]> {

  const q = query(
    collection(db, this.collectionName),
    where("companyId", "==", companyId),
    orderBy("startedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (doc) =>
      doc.data() as LiveSession
  );
}

async updateCurrentProduct(
  companyId: string,
  playlistId: string,
  productId: string
): Promise<void> {

  const q = query(
    collection(db, this.collectionName),
    where("companyId", "==", companyId),
    where("playlistId", "==", playlistId),
    where("status", "==", "active")
  );

  const snapshot =
    await getDocs(q);

  if (snapshot.empty) {
    return;
  }

  await updateDoc(
    snapshot.docs[0].ref,
    {
      currentProductId: productId,
      lastOpenedAt: new Date(),
    }
  );

}
}

export const liveSessionRepository =
  new LiveSessionRepository();