import { FirestorePosSettingsRepository } from "./repositories/FirestorePosSettingsRepository";

import { GetPosSettingsUseCase } from "./usecases/GetPosSettingsUseCase";
import { SavePosSettingsUseCase } from "./usecases/SavePosSettingsUseCase";

const posSettingsRepository =
  new FirestorePosSettingsRepository();

export const getPosSettingsUseCase =
  new GetPosSettingsUseCase(
    posSettingsRepository
  );

export const savePosSettingsUseCase =
  new SavePosSettingsUseCase(
    posSettingsRepository
  );