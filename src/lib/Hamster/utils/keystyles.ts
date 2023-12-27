import YAML from "yaml";

import { KeyStyle } from "$lib/Hamster/model/colorSchema";

export function loadKeyStyles(key: string): KeyStyle[] | null {
    var keyStyles: KeyStyle[] | null = null;
    var recoveryData = localStorage.getItem(key);
    if (recoveryData) {
        try {
            let obj = YAML.parse(recoveryData);
            keyStyles = Object.keys(obj).map((name) => {
                var style = new KeyStyle();
                style.name = name;
                if (obj) style.fromObject(obj[name]);
                return style;
            });
        } catch (err) {
            alert(`failed to load recovery data: ${(err as Error).message}`);
        }
    }
    return keyStyles;
}

export function saveKeyStyles(key: string, keyStyles: KeyStyle[]) {
    var stylesMap: { [name: string]: object } | undefined;
    if (keyStyles) {
        stylesMap = {};
        for (let style of keyStyles) {
            stylesMap[style.name] = style.toObject();
        }
    }
    const objList = stylesMap;
    localStorage.setItem(key, YAML.stringify(objList));
}
