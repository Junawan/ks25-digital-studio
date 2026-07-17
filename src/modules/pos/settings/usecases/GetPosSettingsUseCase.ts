import { PosSettingsRepository } from "../repositories/PosSettingsRepository";
import { PosSettings } from "../types/PosSettings";


export class GetPosSettingsUseCase {
  constructor(
    private readonly repository: PosSettingsRepository
  ) {}

  async execute(
    companyId: string
  ): Promise<PosSettings | null> {
    return this.repository.get(companyId);
  }
}