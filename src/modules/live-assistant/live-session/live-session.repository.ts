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

  for (const session of snapshot.docs) {

    const value = session.data();

const lastOpened =
  value.lastOpenedAt?.toDate?.() ??
  new Date();

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

  return snapshot.docs.map((doc) => {

  const data = doc.data();

  return {

    sessionId: doc.id,

    companyId: data.companyId,

    playlistId: data.playlistId,

    playlistName: data.playlistName,

    firstProductId: data.firstProductId,

    currentProductId:
      data.currentProductId ?? null,

    totalProducts:
      data.totalProducts,

    status: data.status,

    startedAt:
      data.startedAt.toDate(),

    lastOpenedAt:
      data.lastOpenedAt.toDate(),

    endedAt:
      data.endedAt
        ? data.endedAt.toDate()
        : null,

  } as LiveSession;

});
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