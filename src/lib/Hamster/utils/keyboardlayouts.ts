import YAML from "yaml";

import { Keyboard } from "$lib/Hamster/model/keyboardLayout";
import { KeyStyle } from "$lib/Hamster/model/colorSchema";

export function exportKeyboards(layouts: Keyboard[]): string {
    var objList = layouts.map((keyboard) => keyboard.toObject());
    return YAML.stringify({
        keyboards: objList,
    });
}

export function exportKeyboardsV2(layouts: Keyboard[], keyStyles?: KeyStyle[]): string {
    var objList = layouts.map((keyboard) => keyboard.toObjectV2());
    var stylesMap: { [name: string]: object } | undefined;
    if (keyStyles) {
        stylesMap = {};
        for (let style of keyStyles) {
            stylesMap[style.name] = style.toObject();
        }
    }
    return YAML.stringify({
        customKeyStyles: stylesMap,
        keyboards: objList,
    });
}

export function importKeyboards(obj: any): { keyboardLayouts: Keyboard[] | null; keyStyles: KeyStyle[] | null } {
    var keyboardLayouts: Keyboard[] | null = null;
    var keyStyles: KeyStyle[] | null = null;
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
        let styles: { [name: string]: object } | undefined;
        if (obj && obj.customKeyStyles) {
            styles = obj.customKeyStyles;
        }
        if (styles) {
            keyStyles = Object.keys(styles).map((name) => {
                var style = new KeyStyle();
                style.name = name;
                if (styles) style.fromObject(styles[name]);
                return style;
            });
        }
    } catch (err) {
        alert(`failed to parse file: ${(err as Error).message}`);
    }
    return { keyboardLayouts, keyStyles };
}

export function loadKeyboards(key: string): Keyboard[] | null {
    var keyboards: Keyboard[] | null = null;
    var recoveryData = localStorage.getItem(key);
    if (recoveryData) {
        try {
            let objList = YAML.parse(recoveryData);
            keyboards = (objList as object[]).map((obj) => {
                var keyboard = new Keyboard();
                keyboard.fromObject(obj);
                return keyboard;
            });
        } catch (err) {
            alert(`failed to load recovery data: ${(err as Error).message}`);
        }
    }
    return keyboards;
}

export function saveKeyboards(key: string, layouts: Keyboard[]) {
    const objList = layouts.map((keyboard) => keyboard.toObjectV2());
    localStorage.setItem(key, YAML.stringify(objList));
}
