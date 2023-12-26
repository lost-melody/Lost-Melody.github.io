import YAML from "yaml";

import { Keyboard } from "$lib/Hamster/model/keyboardLayout";

export function exportKeyboards(layouts: Keyboard[]): string {
    var objList = layouts.map((keyboard) => keyboard.toObject());
    return YAML.stringify({
        keyboards: objList,
    });
}

export function exportKeyboardsV2(layouts: Keyboard[]): string {
    var objList = layouts.map((schema) => schema.toObjectV2());
    return YAML.stringify({
        keyboards: objList,
    });
}

export function importKeyboards(obj: any): Keyboard[] | null {
    var keyboardLayouts: Keyboard[] | null = null;
    try {
        let layouts;
        if (obj && obj.keyboards) {
            layouts = obj.keyboards;
        }
        if (layouts) {
            keyboardLayouts = (layouts as object[]).map((o) => {
                var keyboard = new Keyboard();
                keyboard.fromObject(o);
                return keyboard;
            });
        }
    } catch (err) {
        console.warn("failed to parse file:", (err as Error).message);
    }
    return keyboardLayouts;
}

export function loadKeyboards(key: string): Keyboard[] | null {
    var keyboards: Keyboard[] | null = null;
    var recoveryData = localStorage.getItem(key);
    if (recoveryData) {
        try {
            let objList = YAML.parse(recoveryData);
            keyboards = (objList as object[]).map((obj) => {
                var scheme = new Keyboard();
                scheme.fromObject(obj);
                return scheme;
            });
        } catch (err) {
            console.warn("failed to load recovery data:", (err as Error).message);
        }
    }
    return keyboards;
}

export function saveKeyboards(key: string, layouts: Keyboard[]) {
    const objList = layouts.map((keyboard) => keyboard.toObjectV2());
    localStorage.setItem(key, YAML.stringify(objList));
}
