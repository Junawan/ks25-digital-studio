import { Dispatch, SetStateAction } from "react";

import { savePosSettingsUseCase } from "../di";

import { PosSettings } from "../types/PosSettings";

export async function saveSettings(
    current: PosSettings | null,

    setSettings: Dispatch<
        SetStateAction<PosSettings | null>
    >,

    updater: (
        current: PosSettings
    ) => PosSettings
) {

    if (!current) return;

    const updated =
        updater(current);

    await savePosSettingsUseCase.execute(
        updated
    );

    setSettings(updated);

}