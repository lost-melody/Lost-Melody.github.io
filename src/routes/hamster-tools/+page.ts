import type { PageLoad } from "./$types";
import YAML from "yaml";

import keyboardsYaml from "$lib/assets/hamster-tools/keyboards.yaml?raw";

var keyboards: object[] = [];

try {
    // 加載預置鍵盤檔案
    var keyboardsObj = YAML.parse(keyboardsYaml);
    keyboards = keyboardsObj.keyboards as object[]
} catch (err) {
    console.error("parse keyboards.yaml failed:", (err as Error).message);
}

export const load: PageLoad = (_) => {
    return {
        title: "倉·佈局",
        keyboards,
    };
};
