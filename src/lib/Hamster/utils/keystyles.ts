import YAML from "yaml";

import { KeyStyle } from "$lib/Hamster/model/colorSchema";

export function loadKeyStyles(key: string): KeyStyle[] | null {
    var keyStyles: KeyStyle[] | null = null;
    var recoveryData = localStorage.getItem(key);
    if (recoveryData) {
        try {
            let objList = YAML.parse(recoveryData);
            keyStyles = (objList as object[]).map((obj) => {
                var style = new KeyStyle();
                style.fromObject(obj);
                return style;
            });
        } catch (err) {
            console.warn("failed to load recovery data:", (err as Error).message);
        }
    }
    return keyStyles;
}

export function saveKeyStyles(key: string, layouts: KeyStyle[]) {
    const objList = layouts.map((style) => style.toObject());
    localStorage.setItem(key, YAML.stringify(objList));
}
