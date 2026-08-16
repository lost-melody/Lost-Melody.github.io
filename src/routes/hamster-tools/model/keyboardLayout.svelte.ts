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
function extractFunc(src: string): { func: string; args: string } | null {
    var r = new RegExp(/^([^()]+)(\((.+)\))?$/);
    var res = r.exec(src);
    return res && { func: res[1], args: res[3] || "" };
}

/** 方向枚舉 */
export enum Direction {
    left = "left",
    down = "down",
    up = "up",
    right = "right",
}

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
}

/** 動作類型名稱映射表 */
export var ActionNames: { [key: string]: string } = {
    [ActionType.backspace]: "退格",
    [ActionType.enter]: "回車",
    [ActionType.shift]: "Shift",
    [ActionType.tab]: "縮進",
    [ActionType.space]: "空格",
    [ActionType.character]: "字符",
    [ActionType.characterMargin]: "佔位",
    [ActionType.keyboardType]: "鍵盤",
    [ActionType.symbol]: "符號",
    [ActionType.shortCommand]: "命令",
    [ActionType.none]: "無",
    [ActionType.nextKeyboard]: "地球",
};

/** 鍵盤類型枚舉 */
export enum KeyboardType {
    alphabetic = "alphabetic",
    chinese = "chinese",
    classifySymbolic = "classifySymbolic",
    chineseNineGrid = "chineseNineGrid",
    numericNineGrid = "numericNineGrid",
    numeric = "numeric",
    symbolic = "symbolic",
    emojis = "emojis",
    custom = "custom",
}

/** 鍵盤類型名稱映射表 */
export var KeyboardNames: { [key: string]: string } = {
    [KeyboardType.alphabetic]: "英文26鍵",
    [KeyboardType.chinese]: "中文26鍵",
    [KeyboardType.classifySymbolic]: "分類符號",
    [KeyboardType.chineseNineGrid]: "中文九宫",
    [KeyboardType.numericNineGrid]: "數字九宫",
    [KeyboardType.numeric]: "數字",
    [KeyboardType.symbolic]: "符號",
    [KeyboardType.emojis]: "Emoji",
    [KeyboardType.custom]: "自定義",
};

/** 快捷命令枚舉 */
export enum ShortCmd {
    clear = "重输",
    trad = "简繁切换",
    eng = "中英切换",
    begin = "行首",
    end = "行尾",
    second = "次选上屏",
    third = "三选上屏",
    schema = "上个输入方案",
    schemas = "方案切换",
    return = "换行",
    switcher = "RimeSwitcher",
    left = "左移",
    right = "右移",
    lefthand = "左手模式",
    righthand = "右手模式",
    clearAll = "清空",
    selectAll = "全选",
    deleteText = "deleteText",
    selectText = "selectText",
    cut = "剪切",
    copy = "复制",
    paste = "粘贴",
    undo = "撤销",
    redo = "重做",
    sendkeys = "sendKeys",
    close = "关闭键盘",
    enter = "Enter",
    showPhrase = "showPhraseView",
    showPasteboard = "showPasteboardView",
    showScript = "showScriptView",
    hideScript = "hideScriptView",
    toggleScript = "toggleScriptView",
    openUrl = "openURL",
}

/** 按鍵動作 */
export class Action {
    type: ActionType = $state(ActionType.none);
    text: string = $state("");
    kbd: KeyboardType = $state(KeyboardType.alphabetic);
    cmd: ShortCmd = $state(ShortCmd.clear);

    display(): string {
        switch (this.type) {
            case ActionType.character:
            case ActionType.characterMargin:
            case ActionType.symbol:
                return this.text;
            case ActionType.backspace:
                return "󰭜";
            case ActionType.enter:
                return "󰒊";
            case ActionType.shift:
                return "󰘶";
            case ActionType.tab:
                return "󰌒";
            case ActionType.space:
                return "espace";
            case ActionType.keyboardType:
                switch (this.kbd) {
                    case KeyboardType.alphabetic:
                        return "󰀬";
                    case KeyboardType.classifySymbolic:
                        return "󱔁";
                    case KeyboardType.chinese:
                        return "漢";
                    case KeyboardType.chineseNineGrid:
                        return "󱗼";
                    case KeyboardType.numericNineGrid:
                        return "󰎠";
                    case KeyboardType.numeric:
                        return "󰎠";
                    case KeyboardType.custom:
                        return "󰥻";
                    case KeyboardType.emojis:
                        return "😀";
                    default:
                        return this.kbd;
                }
            case ActionType.shortCommand:
                switch (this.cmd) {
                    case ShortCmd.clear:
                        return "󰁮";
                    case ShortCmd.trad:
                        return "簡";
                    case ShortCmd.eng:
                        return "󰗊";
                    case ShortCmd.begin:
                        return "";
                    case ShortCmd.end:
                        return "";
                    case ShortCmd.second:
                        return "󰲣";
                    case ShortCmd.third:
                        return "󰲥";
                    case ShortCmd.schema:
                        return "󱑞";
                    case ShortCmd.schemas:
                        return "󱑠";
                    case ShortCmd.return:
                        return "󰌑";
                    case ShortCmd.switcher:
                        return "󰒓";
                    case ShortCmd.left:
                        return "";
                    case ShortCmd.right:
                        return "";
                    case ShortCmd.lefthand:
                        return "󱂫";
                    case ShortCmd.righthand:
                        return "󱂪";
                    case ShortCmd.clearAll:
                        return "󰗨";
                    case ShortCmd.selectAll:
                        return "󰄭";
                    case ShortCmd.deleteText:
                        return "󰗨";
                    case ShortCmd.selectText:
                        return "󰄭";
                    case ShortCmd.cut:
                        return "󰆐";
                    case ShortCmd.copy:
                        return "󰆏";
                    case ShortCmd.paste:
                        return "󰆒";
                    case ShortCmd.undo:
                        return "󰕌";
                    case ShortCmd.redo:
                        return "󰑎";
                    case ShortCmd.close:
                        return "󰹋";
                    case ShortCmd.enter:
                        return "";
                    case ShortCmd.showPhrase:
                        return "";
                    case ShortCmd.showPasteboard:
                        return "";
                    case ShortCmd.showScript:
                        return "󰈮";
                    case ShortCmd.hideScript:
                        return "";
                    case ShortCmd.toggleScript:
                        return "󰈮";
                    case ShortCmd.sendkeys:
                        return "󰌹";
                    case ShortCmd.openUrl:
                        return "";
                    default:
                        return this.cmd;
                }
            case ActionType.nextKeyboard:
                return "󱞑";
            case ActionType.none:
                return "";
            default:
                return this.type;
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
                        let cmd = extractFunc(res.args.replace(/^#/, ""));
                        if (cmd && (Object.values(ShortCmd) as string[]).includes(cmd.func)) {
                            this.type = res.func;
                            this.cmd = cmd.func as ShortCmd;
                            if (this.cmd === ShortCmd.sendkeys) {
                                this.text = cmd.args;
                            }
                            return;
                        }
                    default:
                }
            }
        } else if (obj && typeof obj === "object") {
            // { character: { char: "c" } }
            for (let key of [ActionType.character, ActionType.characterMargin, ActionType.symbol]) {
                if (obj[key] && typeof obj[key] === "object") {
                    this.type = key;
                    this.text = obj[key].char || "";
                    return;
                }
            }
            // { keyboardType: "emojis" }
            if (typeof obj[ActionType.keyboardType] === "string") {
                let kbd = obj[ActionType.keyboardType];
                if (
                    [
                        KeyboardType.alphabetic,
                        KeyboardType.chinese,
                        KeyboardType.chineseNineGrid,
                        KeyboardType.classifySymbolic,
                        KeyboardType.emojis,
                        KeyboardType.numeric,
                        KeyboardType.numericNineGrid,
                        KeyboardType.symbolic,
                    ].includes(kbd as KeyboardType)
                ) {
                    this.type = ActionType.keyboardType;
                    this.kbd = kbd as KeyboardType;
                } else {
                    this.type = ActionType.keyboardType;
                    this.kbd = KeyboardType.custom;
                    this.text = kbd;
                }
                return;
            } else if (typeof obj[ActionType.keyboardType] === "object") {
                let kbd = obj[ActionType.keyboardType];
                this.type = ActionType.keyboardType;
                this.kbd = KeyboardType.custom;
                if (kbd.custom && kbd.custom.named) {
                    this.text = kbd.custom.named || "";
                }
                return;
            }
            // { shortcutCommand: "#重输" }
            if (typeof obj.shortcutCommand === "string") {
                this.type = ActionType.shortCommand;
                this.cmd = (obj.shortcutCommand as string).replace(/^#/, "") as ShortCmd;
                if ((this.cmd as string) === "繁简切换") {
                    this.cmd = ShortCmd.trad;
                }
                return;
            }
            // { shortcutCommand: { sendKeys: { keys: "Control+k" } } }
            if (obj.shortcutCommand && typeof obj.shortcutCommand === "object") {
                let sc = obj.shortcutCommand;
                if (sc.sendKeys && typeof sc.sendKeys === "object" && typeof sc.sendKeys.keys === "string") {
                    this.type = ActionType.shortCommand;
                    this.cmd = ShortCmd.sendkeys;
                    this.text = sc.sendKeys.keys;
                    return;
                }
            }
            // { shortcutCommand: { openURL: { url: "#pasteboardContent | weixin://" } } }
            if (obj.shortcutCommand && typeof obj.shortcutCommand === "object") {
                let sc = obj.shortcutCommand;
                if (sc.openURL && typeof sc.openURL === "object" && typeof sc.openURL.url === "string") {
                    this.type = ActionType.shortCommand;
                    this.cmd = ShortCmd.openUrl;
                    this.text = sc.openURL.url;
                    return;
                }
            }
        }
        this.type = ActionType.none;
    }

    toObject(): any {
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
                return { [this.type]: { char: this.text } };
            case ActionType.keyboardType:
                if (this.kbd === KeyboardType.custom) {
                    return { [this.type]: this.text };
                }
                return { [this.type]: this.kbd };
            case ActionType.shortCommand:
                if (this.cmd === ShortCmd.sendkeys) {
                    return { shortcutCommand: { [this.cmd]: { keys: this.text } } };
                } else if (this.cmd === ShortCmd.openUrl) {
                    return { shortcutCommand: { [this.cmd]: { url: this.text } } };
                }
                return { shortcutCommand: "#" + this.cmd };
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
}

/** 按鍵内距 */
export class ButtonInsets {
    expr: boolean = $state(true);
    value: number = $state(3);
    /** 左/下/上/右 */
    insets: [number, number, number, number] = $state([3, 4, 8, 3]);

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
        } else if (insets && typeof insets === "object") {
            this.expr = true;
            this.insets = [Number(insets.left), Number(insets.bottom), Number(insets.top), Number(insets.right)];
        } else {
            // invalid
            this.expr = true;
            this.insets = [3, 4, 8, 3];
        }
    }

    toObject(): any {
        var [l, b, t, r] = this.insets;
        return this.expr ? { left: l, bottom: b, top: t, right: r } : this.value;
    }

    clone(): ButtonInsets {
        var insets = new ButtonInsets();
        insets.expr = this.expr;
        insets.value = this.value;
        insets.insets = this.insets.map((value) => value) as [number, number, number, number];
        return insets;
    }
}

export class Label {
    text: string = $state("");
    loading: string = $state("");
    sysImage: string = $state("");

    fromObject(label: any) {
        if (typeof label === "string") {
            this.text = label;
        } else if (label && typeof label === "object") {
            if (typeof label.text === "string") {
                this.text = label.text;
                if (typeof label.loadingText === "string") {
                    this.loading = label.loadingText;
                }
            } else if (typeof label.systemImageName === "string") {
                this.sysImage = label.systemImageName;
            }
        }
    }

    toObject(): object {
        var obj: any = {};
        if (this.sysImage) {
            obj.systemImageName = this.sysImage;
        } else if (this.text) {
            if (this.loading) {
                obj.text = this.text;
                obj.loadingText = this.loading;
            } else {
                obj = this.text;
            }
        } else {
            obj.text = "";
        }
        return obj;
    }

    clone(): Label {
        var label = new Label();
        label.text = this.text;
        label.loading = this.loading;
        label.sysImage = this.sysImage;
        return label;
    }
}

/** 按鍵劃動 */
export class Swipe {
    id: number = newId();
    action: Action = $state(new Action());
    label: Label = $state(new Label());
    display: boolean = $state(true);
    processByRIME: boolean = $state(true);

    fromObject(obj: any) {
        if (obj && typeof obj === "object") {
            this.action.fromObject(obj.action);
            this.label.fromObject(obj.label);
            this.display = obj.display ? true : false;
            this.processByRIME = obj.processByRIME ? true : false;
        }
    }

    toObject(): object {
        var obj: any = {};
        obj.action = this.action.toObject();
        obj.label = this.label.toObject();
        obj.display = this.display;
        obj.processByRIME = this.processByRIME;
        return obj;
    }

    clone(): Swipe {
        let swipe = new Swipe();
        swipe.action = this.action.clone();
        swipe.label = this.label.clone();
        swipe.display = this.display;
        swipe.processByRIME = this.processByRIME;
        return swipe;
    }
}

export class Callout {
    id: number = newId();
    action: Action = $state(new Action());
    label: Label = $state(new Label());

    constructor() {
        this.action.type = ActionType.character;
        this.action.text = "c";
    }

    fromObject(obj: any) {
        this.action.fromObject(obj.action);
        this.label.fromObject(obj.label);
    }

    toObject(): object {
        var obj: any = {};
        obj.action = this.action.toObject();
        obj.label = this.label.toObject();
        return obj;
    }

    clone(): Callout {
        let callout = new Callout();
        callout.action = this.action.clone();
        callout.label = this.label.clone();
        return callout;
    }
}

/** 按鍵属性 */
export class Key {
    id: number = newId();
    action: Action = $state(new Action());
    processByRIME: boolean = $state(true);
    /** 行寛百分比, 1~100 */
    width: number = $state(10);
    landscape: number = $state(10);
    autoWidth: boolean = $state(true);
    autoLandscape: boolean = $state(true);
    label: Label = $state(new Label());
    swipe: [Swipe, Swipe, Swipe, Swipe];
    callout: Callout[] = $state([]);
    lightStyle: string = $state("");
    darkStyle: string = $state("");

    constructor() {
        this.action.type = ActionType.character;
        this.action.text = "c";
        this.swipe = $state([new Swipe(), new Swipe(), new Swipe(), new Swipe()]);
    }

    fromObject(obj: any) {
        if (obj && typeof obj === "object") {
            this.action.fromObject(obj.action);
            this.label.fromObject(obj.label);
            this.processByRIME = obj.processByRIME !== false;
            if (typeof obj.width === "string") {
                if (obj.width === "available") {
                    this.width = 10;
                    this.autoWidth = true;
                } else {
                    let res = extractFunc(obj.width);
                    this.width = res && res.func === "percentage" ? Number(res.args) * 100 : 10;
                    this.autoWidth = false;
                }
                this.landscape = this.width;
                this.autoLandscape = this.autoWidth;
            } else if (obj.width && typeof obj.width === "object") {
                if (typeof obj.width.percentage === "number") {
                    this.width = obj.width.percentage * 100;
                    this.autoWidth = false;
                    this.landscape = this.width;
                    this.autoLandscape = this.autoWidth;
                }
                if (obj.width.portrait === "available") {
                    this.width = 10;
                    this.autoWidth = true;
                } else if (typeof obj.width.portrait === "string") {
                    let res = extractFunc(obj.width.portrait);
                    this.width = res && res.func === "percentage" ? Number(res.args) * 100 : 10;
                    this.autoWidth = false;
                } else if (obj.width.portrait && typeof obj.width.portrait === "object") {
                    this.width = Number(obj.width.portrait.percentage) * 100 || 10;
                    this.autoWidth = false;
                }
                if (obj.width.landscape === "available") {
                    this.landscape = 10;
                    this.autoLandscape = true;
                } else if (typeof obj.width.landscape === "string") {
                    let res = extractFunc(obj.width.landscape);
                    this.landscape = res && res.func === "percentage" ? Number(res.args) * 100 : 10;
                    this.autoLandscape = false;
                } else if (obj.width.landscape && typeof obj.width.landscape === "object") {
                    this.landscape = Number(obj.width.landscape.percentage) * 100 || 10;
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
            if (obj.callout && typeof obj.callout === "object" && obj.callout.length > 0) {
                for (let theCallout of obj.callout) {
                    let callout = new Callout();
                    if (theCallout && typeof theCallout === "object") {
                        callout.fromObject(theCallout);
                    }
                    this.callout.push(callout);
                }
            }
            if (obj.lightModeStyleName) {
                this.lightStyle = obj.lightModeStyleName;
            } else if (obj.lightModeStyle) {
                if (obj.lightModeStyle.name) {
                    this.lightStyle = obj.lightModeStyle.name;
                } else if (obj.lightModeStyle.__include) {
                    this.lightStyle = obj.lightModeStyle.__include.split("/").at(-1);
                }
            }
            if (obj.darkModeStyleName) {
                this.darkStyle = obj.darkModeStyleName;
            } else if (obj.darkModeStyle) {
                if (obj.darkModeStyle.name) {
                    this.darkStyle = obj.darkModeStyle.name;
                } else if (obj.darkModeStyle.__include) {
                    this.darkStyle = obj.darkModeStyle.__include.split("/").at(-1);
                }
            }
        }
    }

    toObject(): object {
        var obj: any = {};
        obj.action = this.action.toObject();
        if (!this.processByRIME) obj.processByRIME = this.processByRIME;
        if (
            (!this.autoLandscape && this.landscape === 0) ||
            (this.autoWidth && this.autoLandscape) ||
            (!this.autoWidth && !this.autoLandscape && this.width === this.landscape)
        ) {
            obj.width = this.autoWidth ? "available" : { percentage: this.width / 100 };
        } else {
            obj.width = {
                portrait: this.autoWidth ? "available" : { percentage: this.width / 100 },
                landscape: this.autoLandscape ? "available" : { percentage: this.landscape / 100 },
            };
        }
        obj.label = this.label.toObject();
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
        if (this.callout.length > 0) {
            obj.callout = this.callout.map((callout) => callout.toObject());
        }
        if (this.lightStyle) {
            obj.lightModeStyleName = this.lightStyle;
        }
        if (this.darkStyle) {
            obj.darkModeStyleName = this.darkStyle;
        }
        return obj;
    }

    clone(): Key {
        let key = new Key();
        key.action = this.action.clone();
        key.processByRIME = this.processByRIME;
        key.width = this.width;
        key.autoWidth = this.autoWidth;
        key.landscape = this.landscape;
        key.autoLandscape = this.autoLandscape;
        key.label = this.label.clone();
        key.swipe = this.swipe.map((swipe) => swipe.clone()) as [Swipe, Swipe, Swipe, Swipe];
        key.lightStyle = this.lightStyle;
        key.darkStyle = this.darkStyle;
        return key;
    }
}

/** 按鍵行属性 */
export class Row {
    id: number = newId();
    keys: Key[] = $state([]);
    rowHeight: number = $state(0);
    landscapeHeight: number = $state(0);

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
        if (this.landscapeHeight > 0 && this.landscapeHeight !== this.rowHeight) {
            obj.rowHeight = {
                portrait: this.rowHeight,
                landscape: this.landscapeHeight,
            };
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
}

/** 鍵盤属性 */
export class Keyboard {
    id: number = newId();
    name: string = $state("鍵盤");
    primary: boolean = $state(false);
    rows: Row[] = $state([]);
    buttonInsets: ButtonInsets = $state(new ButtonInsets());

    fromObject(obj: any) {
        if (obj && typeof obj === "object") {
            this.name = typeof obj.name === "string" ? (this.name = obj.name) : "鍵盤";
            this.primary = obj.isPrimary ? true : false;
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
        obj.isPrimary = this.primary;
        obj.rows = this.rows.map((row) => row.toObject());
        obj.buttonInsets = this.buttonInsets.toObject();
        return obj;
    }

    clone(): Keyboard {
        let keyboard = new Keyboard();
        keyboard.name = this.name;
        keyboard.primary = this.primary;
        keyboard.rows = this.rows.map((row) => row.clone());
        keyboard.buttonInsets = this.buttonInsets.clone();
        return keyboard;
    }
}
