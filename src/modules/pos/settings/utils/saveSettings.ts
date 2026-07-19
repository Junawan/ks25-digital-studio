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

        console.log("Updated settings:", updated);

    await savePosSettingsUseCase.execute(
        updated
    );
    console.log("SAVED");

    setSettings(updated);

}