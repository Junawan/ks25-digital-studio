
import { storage } from "@/core/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";


export class StorageService {
  async upload(
    path: string,
    file: File
  ): Promise<string> {
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);

    return getDownloadURL(storageRef);
  }

  async delete(path: string): Promise<void> {
    const storageRef = ref(storage, path);

    await deleteObject(storageRef);
  }
}

export const storageService =
  new StorageService();