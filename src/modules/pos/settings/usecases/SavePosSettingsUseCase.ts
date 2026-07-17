import { PosSettings } from "../types/PosSettings";
import { PosSettingsRepository } from "../repositories/PosSettingsRepository";

export class SavePosSettingsUseCase {
  constructor(
    private readonly repository: PosSettingsRepository
  ) {}

  async execute(
    settings: PosSettings
  ): Promise<void> {

    const now = new Date();

    await this.repository.save({
      ...settings,
      updatedAt: now,
    });

  }
}