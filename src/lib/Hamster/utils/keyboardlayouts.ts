import YAML from "yaml";

import { Keyboard } from "$lib/Hamster/model/keyboardLayout";
import { KeyStyle } from "$lib/Hamster/model/colorSchema";

export function exportKeyboards(layouts: Keyboard[], keyStyles?: KeyStyle[]): object {
    var kbdList: object[] = layouts.map((keyboard) => keyboard.toObject());
    if (keyStyles) {
        let styles: any = exportKeyStyles(keyStyles);
        kbdList = assignKeyStyles(kbdList, styles.keyStyle);
    }
    return {
        keyboards: kbdList,
    };
}

export function exportKeyStyles(keyStyles: KeyStyle[]): object {
    var stylesMap: { [name: string]: object } = {};
    if (keyStyles) {
        stylesMap = {};
        for (let style of keyStyles) {
            stylesMap[style.name] = style.toObject();
        }
    }
    return {
        keyStyle: stylesMap,
    };
}

export function assignKeyStyles(kbdList: any, styles: any): any {
    if (!kbdList || !styles) {
        return kbdList;
    }
    for (let kbd of kbdList) {
        for (let row of kbd.rows) {
            for (let key of row.keys) {
                for (let name of [key.lightModeStyleName, key.darkModeStyleName]) {
                    if (name && styles[name]) {
                        if (!kbd.keyStyle) {
                            kbd.keyStyle = {};
                        }
                        if (!kbd.keyStyle[name]) {
                            kbd.keyStyle[name] = styles[name];
                        }
                    }
                }
            }
        }
    }
    return kbdList;
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
