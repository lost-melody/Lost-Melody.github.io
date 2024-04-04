import YAML from "yaml";

import { Keyboard } from "$lib/Hamster/model/keyboardLayout";
import { KeyStyle } from "$lib/Hamster/model/colorSchema";

export function exportKeyboards(layouts: Keyboard[], keyStyles?: KeyStyle[]): string {
    var objList: any[] = layouts.map((keyboard) => keyboard.toObject());
    var stylesMap: { [name: string]: object } | undefined;
    if (keyStyles && keyStyles.length != 0) {
        stylesMap = {};
        for (let style of keyStyles) {
            stylesMap[style.name] = style.toObject();
        }
    }
    // 將按鍵樣式索引展開並内聯到屬性中
    for (let kbd of objList) {
        for (let row of kbd.rows) {
            for (let key of row.keys) {
                if (key.lightModeStyleName) {
                    key.lightModeStyle = stylesMap && stylesMap[key.lightModeStyleName];
                }
                if (key.darkModeStyleName) {
                    key.darkModeStyle = stylesMap && stylesMap[key.darkModeStyleName];
                }
                key.lightModeStyleName = undefined;
                key.darkModeStyleName = undefined;
            }
        }
    }
    return YAML.stringify({
        keyStyle: stylesMap,
        keyboards: objList,
    });
}

export function exportKeyStyles(keyStyles: KeyStyle[]): string {
    var stylesMap: { [name: string]: object } | undefined;
    if (keyStyles) {
        stylesMap = {};
        for (let style of keyStyles) {
            stylesMap[style.name] = style.toObject();
        }
    }
    return YAML.stringify({
        keyStyle: stylesMap,
    });
}

export function importKeyboards(obj: any): { keyboardLayouts: Keyboard[] | null; keyStyles: KeyStyle[] | null } {
    var keyboardLayouts: Keyboard[] | null = null;
    var keyStyles: KeyStyle[] | null = null;
    try {
        if (obj && obj.keyboards) {
            let layouts = obj.keyboards;
            keyboardLayouts = (layouts as object[]).map((o) => {
                var keyboard = new Keyboard();
                keyboard.fromObject(o);
                return keyboard;
            });
        }
        if (obj && obj.customKeyStyles) {
            obj.keyStyle = obj.customKeyStyles;
        }
        if (obj && obj.keyStyle) {
            let styles = obj.keyStyle;
            keyStyles = Object.keys(styles)
                .map((name) => {
                    let style = new KeyStyle();
                    style.name = name;
                    if (styles) style.fromObject(styles[name]);
                    return style;
                })
                .filter((style) => style.name)
                .sort((a, b) => (a.name < b.name ? -1 : a.name === b.name ? 0 : 1));
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
    const objList = layouts.map((keyboard) => keyboard.toObject());
    localStorage.setItem(key, YAML.stringify(objList));
}
