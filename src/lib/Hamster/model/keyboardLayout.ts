// 一些模型定義
// https://github.com/imfuxiao/Hamster/wiki/%E8%87%AA%E5%AE%9A%E4%B9%89%E9%94%AE%E7%9B%98%E5%B8%83%E5%B1%80

var id: number = Date.now();

function newId(): number {
    id++;
    return id;
}

/**
解析函數表達式
```
extractFunc("") => null
extractFunc("input") => { func: "input", args: "" }
extractFunc("percentage(0.1)") => { func: "percentage", args: "0.1" }
```
*/
function extractFunc(src: string): { func: string, args: string } | null {
    var r = new RegExp(/^([a-zA-Z]+)(\((.+)\))?$/);
    var res = r.exec(src);
    return res && { func: res[1], args: res[3] || "" };
}

/** 方向枚舉 */
export enum Direction {
    left = "left",
    down = "down",
    up = "up",
    right = "right",
};

/** 動作類型枚舉 */
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

/** 動作類型名稱映射表 */
export var ActionNames: { [key: string]: string } = {
    [ActionType.backspace]: "退格",
    [ActionType.enter]: "回車",
    [ActionType.shift]: "Shift",
    [ActionType.tab]: "縮進",
    [ActionType.space]: "空格",
    [ActionType.character]: "字符",
    [ActionType.characterMargin]: "佔位符",
    [ActionType.keyboardType]: "鍵盤",
    [ActionType.symbol]: "短語",
    [ActionType.shortCommand]: "命令",
    [ActionType.none]: "無",
    [ActionType.nextKeyboard]: "地球",
};

/** 鍵盤類型枚舉 */
export enum KeyboardType {
    alphabetic = "alphabetic",
    classifySymbolic = "classifySymbolic",
    chinese = "chinese",
    chineseNineGrid = "chineseNineGrid",
    numericNineGrid = "numericNineGrid",
    custom = "custom",
    emojis = "emojis",
};

/** 鍵盤類型名稱映射表 */
export var KeyboardNames: { [key: string]: string } = {
    [KeyboardType.alphabetic]: "英文26鍵",
    [KeyboardType.classifySymbolic]: "分類符號",
    [KeyboardType.chinese]: "中文26鍵",
    [KeyboardType.chineseNineGrid]: "中文九宫",
    [KeyboardType.numericNineGrid]: "數字九宫",
    [KeyboardType.custom]: "自定義",
    [KeyboardType.emojis]: "Emoji",
}

/** 快捷命令枚舉 */
export enum ShortCmd {
    clear = "重输",
    trad = "繁简切换",
    eng = "中英切换",
    begin = "行首",
    end = "行尾",
    second = "次选上屏",
    third = "三选上屏",
    schema = "上个输入方案",
    return = "换行",
    switcher = "RimeSwitcher",
    left = "左移",
    right = "右移",
    cut = "剪切",
    copy = "复制",
    paste = "粘贴",
};

/** 按鍵動作 */
export class Action {
    type: ActionType = ActionType.none;
    text: string = "";
    kbd: KeyboardType = KeyboardType.alphabetic;
    cmd: ShortCmd = ShortCmd.clear;

    display(): string {
        switch (this.type) {
            case ActionType.character:
            case ActionType.characterMargin:
            case ActionType.symbol:
                return this.text;
            case ActionType.backspace:
                return "⌫";
            case ActionType.enter:
                return "↵";
            case ActionType.shift:
                return "⇧";
            case ActionType.tab:
                return "⇥";
            case ActionType.space:
                return "____";
            case ActionType.keyboardType:
                switch (this.kbd) {
                    case KeyboardType.alphabetic:
                        return "En";
                    case KeyboardType.classifySymbolic:
                        return "#+=";
                    case KeyboardType.chinese:
                        return "漢²⁶";
                    case KeyboardType.chineseNineGrid:
                        return "漢⁹";
                    case KeyboardType.numericNineGrid:
                        return "123";
                    case KeyboardType.custom:
                        return this.text;
                    case KeyboardType.emojis:
                        return "😀";
                    default:
                        return this.kbd;
                }
            case ActionType.shortCommand:
                switch (this.cmd) {
                    case ShortCmd.clear:
                        return "清空";
                    case ShortCmd.trad:
                        return "繁簡";
                    case ShortCmd.eng:
                        return "中英";
                    case ShortCmd.begin:
                        return "行首";
                    case ShortCmd.end:
                        return "行尾";
                    case ShortCmd.second:
                        return "次選";
                    case ShortCmd.third:
                        return "三選";
                    case ShortCmd.schema:
                        return "方案";
                    case ShortCmd.return:
                        return "換行";
                    case ShortCmd.switcher:
                        return "開關";
                    case ShortCmd.left:
                        return "左移";
                    case ShortCmd.right:
                        return "右移";
                    default:
                        return this.cmd;
                }
            case ActionType.none:
                return "";
            case ActionType.nextKeyboard:
                return "⌘";
            default:
                return ActionType.none;
        }
    }

    fromObject(obj: any) {
        if (typeof obj === "string") {
            var res = extractFunc(obj);
            if (res) {
                switch (res.func) {
                    case ActionType.backspace:
                    case ActionType.enter:
                    case ActionType.shift:
                    case ActionType.tab:
                    case ActionType.space:
                    case ActionType.nextKeyboard:
                    case ActionType.none:
                        this.type = res.func;
                        return;
                    case ActionType.character:
                    case ActionType.characterMargin:
                    case ActionType.symbol:
                        this.type = res.func;
                        this.text = res.args;
                        return;
                    case ActionType.keyboardType:
                        let kbd = extractFunc(res.args);
                        if (kbd && (Object.values(KeyboardType) as string[]).includes(kbd.func)) {
                            this.type = res.func;
                            this.kbd = kbd.func as KeyboardType;
                            if (this.kbd === KeyboardType.custom) {
                                this.text = kbd.args;
                            }
                            return;
                        }
                    case ActionType.shortCommand:
                        let cmd = res.args.replace(/^#/, "");
                        if ((Object.values(ShortCmd) as string[]).includes(cmd)) {
                            this.type = res.func;
                            this.cmd = cmd as ShortCmd;
                            return;
                        }
                    default:
                }
            }
        }
        this.type = ActionType.none;
    }

    toObject(): string {
        switch (this.type) {
            case ActionType.backspace:
            case ActionType.enter:
            case ActionType.shift:
            case ActionType.tab:
            case ActionType.space:
            case ActionType.nextKeyboard:
            case ActionType.none:
                return this.type;
            case ActionType.character:
            case ActionType.characterMargin:
            case ActionType.symbol:
                return `${this.type}(${this.text})`;
            case ActionType.keyboardType:
                if (this.kbd === KeyboardType.custom) {
                    return `${this.type}(${this.kbd}(${this.text}))`;
                }
                return `${this.type}(${this.kbd})`;
            case ActionType.shortCommand:
                return `${this.type}(#${this.cmd})`;
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

/** 按鍵内距 */
export class ButtonInsets {
    expr: boolean = true;
    value: number = 3;
    /** 左/下/上/右 */
    insets: [number, number, number, number] = [3, 4, 8, 3];

    fromObject(insets: any) {
        if (typeof insets === "number") {
            // 3
            this.expr = false;
            this.value = insets;
        } else if (typeof insets === "string") {
            if (insets.includes("(")) {
                // "left(2),right(2)"
                this.expr = true;
                this.insets = [0, 0, 0, 0];
                for (let expr of insets.split(",")) {
                    let res = extractFunc(expr);
                    if (res) {
                        switch (res.func) {
                            case "left":
                                this.insets[0] = Number(res.args);
                                break;
                            case "bottom":
                                this.insets[1] = Number(res.args);
                                break;
                            case "top":
                                this.insets[2] = Number(res.args);
                                break;
                            case "right":
                                this.insets[3] = Number(res.args);
                                break;
                            default:
                        }
                    }
                }
            } else {
                // "3"
                this.expr = false;
                this.value = Number(insets);
            }
        } else {
            // invalid
            this.expr = true;
            this.insets = [3, 4, 8, 3];
        }
    }

    toObject(): string {
        var [l, b, t, r] = this.insets;
        return this.expr
            ? `left(${l}),bottom(${b}),top(${t}),right(${r})`
            : `${this.value}`;
    }

    clone(): ButtonInsets {
        var insets = new ButtonInsets();
        insets.expr = this.expr;
        insets.value = this.value;
        insets.insets = this.insets.map((value) => value) as [number, number, number, number];
        return insets;
    }
}

/** 按鍵劃動 */
export class Swipe {
    id: number = newId();
    action: Action = new Action();
    label: string = "";
    display: boolean = true;
    processByRIME: boolean = true;

    fromObject(obj: any) {
        if (obj && typeof obj === "object") {
            this.action.fromObject(obj.action);
            if (typeof obj.label === "string") {
                this.label = obj.label;
            } else if (obj.label && typeof obj.label === "object" && typeof obj.label.text === "string") {
                this.label = obj.label.text;
            }
            this.display = obj.display ? true : false;
            this.processByRIME = obj.processByRIME ? true : false;
        }
    }

    toObject(): object {
        var obj: any = {};
        obj.action = this.action.toObject();
        if (this.label) {
            obj.label = this.label;
        }
        obj.display = this.display;
        obj.processByRIME = this.processByRIME;
        return obj;
    }

    clone(): Swipe {
        let swipe = new Swipe();
        swipe.action = this.action.clone();
        swipe.label = this.label;
        swipe.display = this.display;
        swipe.processByRIME = this.processByRIME;
        return swipe;
    }
};

/** 按鍵属性 */
export class Key {
    id: number = newId();
    action: Action = new Action();
    /** 行寛百分比, 1~100 */
    width: number = 10;
    landscape: number = 10;
    autoWidth: boolean = false;
    autoLandscape: boolean = false;
    label: string = "";
    loading: string = "";
    swipe: [Swipe, Swipe, Swipe, Swipe];

    constructor() {
        this.action.type = ActionType.character;
        this.action.text = "c";
        this.swipe = [
            new Swipe(),
            new Swipe(),
            new Swipe(),
            new Swipe(),
        ];
    }

    fromObject(obj: any) {
        if (obj && typeof obj === "object") {
            this.action.fromObject(obj.action);
            if (typeof obj.label === "string") {
                this.label = obj.label;
            } else if (obj.label && typeof obj.label === "object" && typeof obj.label.text === "string") {
                this.label = obj.label.text;
                if (this.action.type === ActionType.space && typeof obj.label.loadingText === "string") {
                    this.loading = obj.label.loadingText;
                }
            }
            if (typeof obj.width === "string") {
                if (obj.width === "available") {
                    this.width = 10;
                    this.autoWidth = true;
                } else {
                    let res = extractFunc(obj.width);
                    this.width = (res && res.func === "percentage") ? Number(res.args) * 100 : 10;
                    this.autoWidth = false;
                }
                this.landscape = this.width;
                this.autoLandscape = this.autoWidth;
            } else if (obj.width && typeof obj.width === "object" && typeof obj.width.portrait === "string" && typeof obj.width.landscape === "string") {
                if (obj.width.portrait === "available") {
                    this.width = 10;
                    this.autoWidth = true;
                } else {
                    let res = extractFunc(obj.width.portrait);
                    this.width = (res && res.func === "percentage") ? Number(res.args) * 100 : 10;
                    this.autoWidth = false;
                }
                if (obj.width.landscape === "available") {
                    this.landscape = 10;
                    this.autoLandscape = true;
                } else {
                    let res = extractFunc(obj.width.landscape);
                    this.landscape = (res && res.func === "percentage") ? Number(res.args) * 100 : 10;
                    this.autoLandscape = false;
                }
            } else {
                this.width = 10;
                this.landscape = 10;
                this.autoWidth = true;
                this.autoLandscape = true;
            }
            for (let swipe of this.swipe) {
                swipe.action.type = ActionType.none;
            }
            if (obj.swipe && typeof obj.swipe === "object" && obj.swipe.length > 0) {
                for (let theSwipe of obj.swipe) {
                    let index = -1;
                    if (theSwipe && typeof theSwipe === "object") {
                        index = Object.values(Direction).findIndex((dir) => theSwipe.direction === dir);
                    }
                    if (index >= 0) {
                        this.swipe[index].fromObject(theSwipe);
                    }
                }
            }
        }
    }

    toObject(): object {
        var obj: any = {};
        obj.action = this.action.toObject();
        if (this.width === this.landscape && this.autoWidth === this.autoLandscape) {
            obj.width = this.autoWidth ? "available" : `percentage(${this.width / 100})`;
        } else {
            obj.width = {
                portrait: this.autoWidth ? "available" : `percentage(${this.width / 100})`,
                landscape: this.autoLandscape ? "available" : `percentage(${this.landscape / 100})`,
            };
        }
        if (this.label) {
            if (this.loading && this.action.type === ActionType.space) {
                obj.label = {
                    text: this.label,
                    loadingText: this.loading,
                }
            } else {
                obj.label = this.label;
            }
        }
        var swipes: object[] = [];
        for (let i of [2, 1, 0, 3]) {
            if (this.swipe[i].action.type !== ActionType.none) {
                let swipe: any = this.swipe[i].toObject();
                swipe.direction = Object.values(Direction)[i];
                swipes.push(swipe);
            }
        }
        if (swipes.length > 0) {
            obj.swipe = swipes;
        }
        return obj;
    }

    clone(): Key {
        let key = new Key();
        key.action = this.action.clone();
        key.width = this.width;
        key.autoWidth = this.autoWidth;
        key.landscape = this.landscape;
        key.autoLandscape = this.autoLandscape;
        key.label = this.label;
        key.swipe = this.swipe.map((swipe) => swipe.clone()) as [Swipe, Swipe, Swipe, Swipe];
        return key;
    }
};

/** 按鍵行属性 */
export class Row {
    id: number = newId();
    keys: Key[] = [];
    rowHeight: number = 0;
    landscapeHeight: number = 0;

    fromObject(obj: any) {
        this.keys = [];
        if (obj && typeof obj === "object") {
            if (typeof obj.rowHeight === "number" || typeof obj.rowHeight === "string") {
                this.rowHeight = Number(obj.rowHeight) || 0;
                this.landscapeHeight = this.rowHeight;
            } else if (obj.rowHeight && typeof obj.rowHeight === "object") {
                this.rowHeight = Number(obj.rowHeight.portrait) || 0;
                this.landscapeHeight = Number(obj.rowHeight.landscape) || 0;
            }
            if (obj.keys && typeof obj.keys === "object" && obj.keys.length > 0) {
                this.keys = obj.keys.map((theKey: any) => {
                    let key = new Key();
                    key.fromObject(theKey);
                    return key;
                });
            }
        }
    }

    toObject(): object {
        var obj: any = {};
        obj.keys = this.keys.map((key) => key.toObject());
        if (this.landscapeHeight > 0) {
            obj.rowHeight = {
                portrait: this.rowHeight,
                landscape: this.landscapeHeight,
            }
        } else if (this.rowHeight > 0) {
            obj.rowHeight = this.rowHeight;
        }
        return obj;
    }

    clone(): Row {
        let row = new Row();
        row.keys = this.keys.map((key) => key.clone());
        row.rowHeight = this.rowHeight;
        row.landscapeHeight = this.landscapeHeight;
        return row;
    }
};

/** 鍵盤属性 */
export class Keyboard {
    id: number = newId();
    name: string = "鍵盤";
    rows: Row[] = [];
    buttonInsets: ButtonInsets = new ButtonInsets();

    fromObject(obj: any) {
        if (obj && typeof obj === "object") {
            this.name = typeof obj.name === "string" ? this.name = obj.name : "鍵盤";
            this.buttonInsets.fromObject(obj.buttonInsets);
            this.rows = [];
            if (obj.rows && typeof obj.rows === "object") {
                if (obj.rows.length > 0) {
                    this.rows = obj.rows.map((theRow: any) => {
                        let row = new Row();
                        row.fromObject(theRow);
                        return row;
                    });
                }
            }
        }
    }

    toObject(): object {
        var obj: any = {};
        obj.name = this.name;
        obj.rows = this.rows.map((row) => row.toObject());
        obj.buttonInsets = this.buttonInsets.toObject();
        return obj;
    }

    clone(): Keyboard {
        let keyboard = new Keyboard();
        keyboard.name = this.name;
        keyboard.rows = this.rows.map((row) => row.clone());
        keyboard.buttonInsets = this.buttonInsets.clone();
        return keyboard;
    }
};
