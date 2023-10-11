// 一些模型定義
// https://github.com/imfuxiao/Hamster/wiki/%E8%87%AA%E5%AE%9A%E4%B9%89%E9%94%AE%E7%9B%98%E5%B8%83%E5%B1%80

var id: number = Date.now();

function newId(): number {
    id++;
    return id;
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
                return "-⇥";
            case ActionType.space:
                return "⌞___⌟";
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
    expr: boolean = false;
    value: number = 2;
    /** 左/下/上/右 */
    insets: [number, number, number, number] = [0, 0, 0, 0];
}

/** 按鍵劃動 */
export class Swipe {
    id: number = newId();
    action: Action = new Action();
    label: string = "";
    display: boolean = true;
    processByRIME: boolean = true;

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
    label: string = "";
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

    toObject(): object {
        var obj: any = {};
        obj.action = this.action.toObject();
        obj.width = `percentage(${this.width / 100})`;
        if (this.label) {
            obj.label = this.label;
        }
        obj.swipe = [];
        for (var i = 0; i < this.swipe.length; i++) {
            if (this.swipe[i].action.type !== ActionType.none) {
                var swipe: any = this.swipe[i].toObject();
                swipe.direction = Object.values(Direction)[i];
                obj.swipe.push(swipe);
            }
        }
        return obj;
    }

    clone(): Key {
        let key = new Key();
        key.action = this.action.clone();
        key.width = this.width;
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

    toObject(): object {
        var obj: any = {};
        obj.keys = this.keys.map((key) => key.toObject());
        if (this.rowHeight > 0) {
            obj.rowHeight = this.rowHeight;
        }
        return obj;
    }

    clone(): Row {
        let row = new Row();
        row.keys = this.keys.map((key) => key.clone());
        row.rowHeight = this.rowHeight;
        return row;
    }
};

/** 鍵盤属性 */
export class Keyboard {
    id: number = newId();
    name: string = "鍵盤";
    rows: Row[] = [];
    buttonInsets: ButtonInsets = new ButtonInsets();

    constructor() {
        // 暫時如此初始化默認佈局
        // 以後實現佈局導入, 再從默認文件初始化
        this.rows = new Array(4).fill(0).map(() => new Row());
        this.rows[0].keys = new Array(10).fill(0).map(() => new Key());
        this.rows[1].keys = new Array(11).fill(0).map(() => new Key());
        this.rows[2].keys = new Array(11).fill(0).map(() => new Key());
        this.rows[3].keys = new Array(5).fill(0).map(() => new Key());
        for (var i = 0; i < 10; i++) {
            this.rows[0].keys[i].action.text = "qwertyuiop"[i];
        }
        for (var i = 0; i < 11; i++) {
            if (i === 0 || i === 10) {
                this.rows[1].keys[i].width = 5;
                this.rows[1].keys[i].action.type = ActionType.none;
            } else {
                this.rows[1].keys[i].action.text = "asdfghjkl"[i - 1];
            }
        }
        for (var i = 0; i < 11; i++) {
            if (i === 0) {
                this.rows[2].keys[i].width = 13;
                this.rows[2].keys[i].action.type = ActionType.shift;
            } else if (i === 10) {
                this.rows[2].keys[i].width = 13;
                this.rows[2].keys[i].action.type = ActionType.backspace;
            } else if (i === 1 || i === 9) {
                this.rows[2].keys[i].width = 2;
                this.rows[2].keys[i].action.type = ActionType.none;
            } else {
                this.rows[2].keys[i].action.text = "zxcvbnm"[i - 2];
            }
        }
        for (var i = 0; i < 5; i++) {
            switch (i) {
                case 0:
                    this.rows[3].keys[i].width = 20;
                    this.rows[3].keys[i].action.type = ActionType.keyboardType;
                    this.rows[3].keys[i].action.kbd = KeyboardType.numericNineGrid;
                    break;
                case 1:
                    this.rows[3].keys[i].action.text = ",";
                    break;
                case 2:
                    this.rows[3].keys[i].width = 40;
                    this.rows[3].keys[i].action.type = ActionType.space;
                    break;
                case 3:
                    this.rows[3].keys[i].action.text = ".";
                    break;
                case 4:
                    this.rows[3].keys[i].width = 20;
                    this.rows[3].keys[i].action.type = ActionType.enter;
                    break;
            }
        }
    }

    toObject(): object {
        var obj: any = {};
        obj.name = this.name;
        obj.rows = this.rows.map((row) => row.toObject());
        var [l, b, t, r] = this.buttonInsets.insets;
        obj.buttonInsets = this.buttonInsets.expr
            ? `left(${l}),bottom(${b}),top(${t}),right(${r})`
            : `${this.buttonInsets.value}`;
        return obj;
    }
};
