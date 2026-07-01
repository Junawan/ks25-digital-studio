import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { BaseRepository } from "./BaseRepository";
import { Playlist } from "./playlist.types";
import { db } from "@/core/firebase";


export class PlaylistRepository extends BaseRepository<Playlist> {

  private readonly collectionName =
    "playlists";

  async create(
    data: Playlist
  ): Promise<void> {

    const cleanData =
      Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) =>
            value !== undefined
        )
      );

    await setDoc(
      doc(
        db,
        this.collectionName,
        data.playlistId
      ),
      cleanData
    );
  }

  async update(
    id: string,
    data: Partial<Playlist>
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
  ): Promise<Playlist | null> {

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

    return snapshot.data() as Playlist;

  }

  async findByCompanyId(
    companyId: string
  ): Promise<Playlist[]> {

    const q = query(
      collection(
        db,
        this.collectionName
      ),
      where(
        "companyId",
        "==",
        companyId
      )
    );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        doc.data() as Playlist
    );

  }

  async countByCompany(
  companyId: string
): Promise<number> {

  const q = query(
    collection(db, this.collectionName),
    where("companyId", "==", companyId)
  );

  const snapshot = await getDocs(q);

  return snapshot.size;

}

  async findAll(): Promise<Playlist[]> {
      const snapshot = await getDocs(
        collection(db, this.collectionName)
      );
  
      return snapshot.docs.map(
        (doc) => doc.data() as Playlist
      );
    }

    async addProduct(
  playlistId: string,
  productId: string
): Promise<void> {

  const playlist =
    await this.findById(playlistId);

  if (!playlist) {
    throw new Error("Playlist tidak ditemukan");
  }

  if (
    playlist.productIds.includes(productId)
  ) {
    return;
  }

  await updateDoc(
    doc(
      db,
      this.collectionName,
      playlistId
    ),
    {
      productIds: [
        ...playlist.productIds,
        productId,
      ],
      updatedAt: new Date(),
    }
  );

}

}