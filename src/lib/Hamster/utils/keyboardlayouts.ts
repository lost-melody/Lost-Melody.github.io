import YAML from "yaml";

import { Keyboard } from "$lib/Hamster/model/keyboardLayout";
import { KeyStyle } from "$lib/Hamster/model/colorSchema";

export function exportKeyboards(layouts: Keyboard[], keyStyles?: KeyStyle[]): string {
    var objList: any[] = layouts.map((keyboard) => keyboard.toObject());
    var stylesMap: { [name: string]: object } | undefined;
    if (keyStyles) {
        stylesMap = {};
        for (let style of keyStyles) {
            stylesMap[style.name] = style.toObject();
        }
    }
    // 將按鍵樣式索引展開並内聯到屬性中
    for (let i = 0; i < layouts.length; i++) {
        let kbd = layouts[i];
        for (let j = 0; j < kbd.rows.length; j++) {
            let row = kbd.rows[j];
            for (let k = 0; k < row.keys.length; k++) {
                let key = row.keys[k];
                if (key.lightStyle) {
                    let style = stylesMap && stylesMap[key.lightStyle];
                    if (style) {
                        objList[i].rows[j].keys[k].lightModeStyle = style;
                    } else {
                        objList[i].rows[j].keys[k].lightModeStyle = undefined;
                    }
                }
                if (key.darkStyle) {
                    let style = stylesMap && stylesMap[key.darkStyle];
                    if (style) {
                        objList[i].rows[j].keys[k].darkModeStyle = style;
                    } else {
                        objList[i].rows[j].keys[k].darkModeStyle = undefined;
                    }
                }
            }
        }
    }
    return YAML.stringify({
        customKeyStyles: stylesMap,
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
        customKeyStyles: stylesMap,
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
            let styles = obj.customKeyStyles;
            keyStyles = Object.keys(styles).map((name) => {
                let style = new KeyStyle();
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
    const objList = layouts.map((keyboard) => keyboard.toObject());
    localStorage.setItem(key, YAML.stringify(objList));
}
