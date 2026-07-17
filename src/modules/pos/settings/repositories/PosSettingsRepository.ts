import { PosSettings } from "../types/PosSettings";

export interface PosSettingsRepository {
  /**
   * Mengambil pengaturan POS berdasarkan company.
   */
  get(
    companyId: string
  ): Promise<PosSettings | null>;

  /**
   * Membuat atau memperbarui pengaturan POS.
   * Implementasi menggunakan upsert (set + merge).
   */
  save(
    settings: PosSettings
  ): Promise<void>;
}