import {} from "yaml";

// 一些模型定義
// https://github.com/imfuxiao/Hamster/wiki/%E8%87%AA%E5%AE%9A%E4%B9%89%E9%94%AE%E7%9B%98%E5%B8%83%E5%B1%80

export enum Direction {
    up = "up",
    down = "down",
};

export enum ActionType {
    backspace = "backspace",
    enter = "enter",
    shift = "shift",
    tab = "tab",
    space = "space",
    character = "character",
    characterMargin = "characterMargin",
    keyboardType = "keyboardType",
    symbol = "symbol",
    shortCommand = "shortCommand",
    none = "none",
    nextKeyboard = "nextKeyboard",
};

export enum KeyboardType {
    alphabetic = "alphabetic",
    classifySymbolic = "classifySymbolic",
    chinese = "chinese",
    chineseNineGrid = "chineseNineGrid",
    numericNineGrid = "numericNineGrid",
    custom = "custom",
    emojis = "emojis",
};

export enum ShortCmd {
    clear = "重输",
    trad = "繁简切换",
    eng = "中英切换",
    begin = "行首",
    second = "次选上屏",
    third = "三选上屏",
    schema = "上个输入方案",
    return = "换行",
    switcher = "RimeSwitcher",
};

export class Action {
    type: string = ActionType.character;
    text: string = "";
    kbd: string = KeyboardType.alphabetic;
    cmd: string = ShortCmd.clear;

    display(): string {
        switch (this.type) {
            case ActionType.character:
            case ActionType.characterMargin:
            case ActionType.symbol:
                return this.text;
            case ActionType.backspace:
                return "⌫";
            case ActionType.enter:
                return "↩";
            case ActionType.shift:
                return "⇧";
            case ActionType.tab:
                return "⇥";
            case ActionType.space:
                return "␣";
            case ActionType.keyboardType:
                if (this.kbd === KeyboardType.custom) {
                    return this.text;
                } else {
                    return this.kbd;
                }
            case ActionType.shortCommand:
                return this.cmd;
            case ActionType.none:
                return "";
            case ActionType.nextKeyboard:
                return "⌘";
            default:
                return ActionType.none;
        }
    }

    clone(): Action {
        let action = new Action();
        action.type = this.type;
        action.text = this.text;
        action.kbd = this.kbd;
        action.cmd = this.cmd;
        return action;
    }
};

export class ButtonInsets {
    expr: boolean = false;
    value: number = 0;
    /** 左/下/上/右 */
    insets: [number, number, number, number] = [0, 0, 0, 0];
}

export class Swipe {
    id: number = Date.now();
    action: Action = new Action();
    label: string = "";
    display: boolean = true;
    processByRIME: boolean = true;

    clone(): Swipe {
        let swipe = new Swipe();
        swipe.action = this.action.clone();
        swipe.label = this.label;
        swipe.processByRIME = this.processByRIME;
        return swipe;
    }
};

export class Key {
    id: number = Date.now();
    action: Action = new Action();
    /** 行寛百分比, 1~100 */
    width: number = 10;
    label: string = "";
    swipe: { up?: Swipe, down?: Swipe } = {};

    clone(): Key {
        let key = new Key();
        key.action = this.action.clone();
        key.label = this.label;
        if (this.swipe.up) {
            key.swipe.up = this.swipe.up.clone();
        }
        if (this.swipe.down) {
            key.swipe.down = this.swipe.down.clone();
        }
        return key;
    }
};

export class Row {
    id: number = Date.now();
    keys: Key[] = [];
    rowHeight: number = 0;
};

export class Keyboard {
    id: number = Date.now();
    name: string = "鍵盤";
    rows: Row[] = [];
    buttonInsets: ButtonInsets = new ButtonInsets();
};
