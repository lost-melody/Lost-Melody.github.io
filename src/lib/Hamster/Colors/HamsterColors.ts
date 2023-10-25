var id: number = Date.now();

function newId(): number {
    id++;
    return id;
}

function asString(obj: any, defaultValue?: string): string {
    if (typeof obj === "number") {
        // 數字轉字符串: 0xabcdef => "0xabcdef"
        obj = "0x" + obj.toString(16);
    }
    return typeof obj === "string" ? obj : (defaultValue || "");
}

function asNumber(obj: any, defaultValue?: number): number {
    return typeof obj === "number" ? obj : (defaultValue || 0);
}

export class Color {
    color: string;
    alpha: number;

    constructor(color?: string, alpha?: number) {
        this.color = color || "#000000";
        this.alpha = typeof alpha === "number" && alpha >= 0 && alpha <= 0xff ? alpha : 0xff;
    }

    rgba(): string {
        var r = parseInt(this.color.slice(1, 3), 16);
        var g = parseInt(this.color.slice(3, 5), 16);
        var b = parseInt(this.color.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${this.alpha / 256})`;
    }

    abgr(): string {
        var r = this.color.slice(1, 3);
        var g = this.color.slice(3, 5);
        var b = this.color.slice(5, 7);
        var a = this.alpha === 0xff ? "" : (this.alpha || 1).toString(16);
        if (a.length === 1) {
            a = "0" + a;
        }
        return "0x" + `${a}${b}${g}${r}`.toUpperCase();
    }

    clone(): Color {
        var color = new Color();
        color.color = this.color;
        color.alpha = this.alpha;
        return color;
    }

    fromAbgr(abgr: string): void {
        const matcher = /^0x([0-9a-fA-F]{2})?([0-9a-fA-F]{6})$/;
        var res = matcher.exec(abgr);
        this.alpha = parseInt(res && res[1] || "FF", 16);
        var bgr = res && res[2] || "000000";
        this.color = "#" + bgr.slice(4, 6) + bgr.slice(2, 4) + bgr.slice(0, 2);
    }
}

/** 配色方案結構定義 */
export class ColorSchema {
    id: number = newId();
    /** 配置方案唯一名稱代碼 */
    schemaName: string = "schema";
    /** 顯示名 */
    name: string = "配色方案";
    /** 作者 */
    author: string = "佚名";
    /** 鍵盤背景 */
    back_color: Color = new Color("#ffffff");
    /** 按鍵背景 */
    button_back_color: Color = new Color("#ffffff");
    /** 按鍵按下背景 */
    button_pressed_back_color: Color = new Color("#d0d0d0");
    /** 按鍵文本 */
    button_front_color: Color = new Color("#000000");
    /** 按鍵按下文本 */
    button_pressed_front_color: Color = new Color("#000000");
    /** 按鍵劃動文本 */
    button_swipe_front_color: Color = new Color("#000000");
    /** 按鍵圓角 */
    corner_radius: number = 5;
    /** 按鍵邊框 */
    border_color: Color = new Color("#000000");
    /** 預編輯文本 */
    text_color: Color = new Color("#000000");
    /** 首選背景 */
    hilited_candidate_back_color: Color = new Color("#ffffff");
    /** 首選文本 */
    hilited_candidate_text_color: Color = new Color("#000000");
    /** 首選註釋文本 */
    hilited_comment_text_color: Color = new Color("#000000");
    /** 候選文本 */
    candidate_text_color: Color = new Color("#000000");
    /** 注釋文本 */
    comment_text_color: Color = new Color("#000000");

    toObject(): object {
        var obj: any = {
            schemaName: this.schemaName,
            name: this.name,
            author: this.author,
            back_color: this.back_color.abgr(),
            button_back_color: this.button_back_color.abgr(),
            button_pressed_back_color: this.button_pressed_back_color.abgr(),
            button_front_color: this.button_front_color.abgr(),
            button_pressed_front_color: this.button_pressed_front_color.abgr(),
            button_swipe_front_color: this.button_swipe_front_color.abgr(),
            corner_radius: this.corner_radius,
            border_color: this.border_color.abgr(),
            text_color: this.text_color.abgr(),
            hilited_candidate_back_color: this.hilited_candidate_back_color.abgr(),
            hilited_candidate_text_color: this.hilited_candidate_text_color.abgr(),
            hilited_comment_text_color: this.hilited_comment_text_color.abgr(),
            candidate_text_color: this.candidate_text_color.abgr(),
            comment_text_color: this.comment_text_color.abgr(),
        };
        return obj;
    }

    fromObject(obj: any): void {
        if (obj && typeof obj === "object") {
            this.schemaName = asString(obj.schemaName, "schema");
            this.name = asString(obj.name, "配色方案");
            this.author = asString(obj.author, "佚名");
            this.back_color.fromAbgr(asString(obj.back_color, "0xffffff"));
            this.button_back_color.fromAbgr(asString(obj.button_back_color, "0xffffff"));
            this.button_pressed_back_color.fromAbgr(asString(obj.button_pressed_back_color, "0xD0D0D0"));
            this.button_front_color.fromAbgr(asString(obj.button_front_color, "0x000000"));
            this.button_pressed_front_color.fromAbgr(asString(obj.button_pressed_front_color, "0x000000"));
            this.button_swipe_front_color.fromAbgr(asString(obj.button_swipe_front_color, "0x000000"));
            this.corner_radius = asNumber(obj.corner_radius, 5);
            this.border_color.fromAbgr(asString(obj.border_color, "0x000000"));
            this.text_color.fromAbgr(asString(obj.text_color, "0x000000"));
            this.hilited_candidate_back_color.fromAbgr(asString(obj.hilited_candidate_back_color, "0xffffff"));
            this.hilited_candidate_text_color.fromAbgr(asString(obj.hilited_candidate_text_color, "0x000000"));
            this.hilited_comment_text_color.fromAbgr(asString(obj.hilited_comment_text_color, "0x000000"));
            this.candidate_text_color.fromAbgr(asString(obj.candidate_text_color, "0x000000"));
            this.comment_text_color.fromAbgr(asString(obj.comment_text_color, "0x000000"));
        }
    }

    clone(): ColorSchema {
        var schema = new ColorSchema();
        schema.schemaName = this.schemaName;
        schema.name = this.name;
        schema.author = this.author;
        schema.back_color = this.back_color.clone();
        schema.button_back_color = this.button_back_color.clone();
        schema.button_pressed_back_color = this.button_pressed_back_color.clone();
        schema.button_front_color = this.button_front_color.clone();
        schema.button_pressed_front_color = this.button_pressed_front_color.clone();
        schema.button_swipe_front_color = this.button_swipe_front_color.clone();
        schema.corner_radius = this.corner_radius;
        schema.border_color = this.border_color.clone();
        schema.text_color = this.text_color.clone();
        schema.hilited_candidate_back_color = this.hilited_candidate_back_color.clone();
        schema.hilited_candidate_text_color = this.hilited_candidate_text_color.clone();
        schema.hilited_comment_text_color = this.hilited_comment_text_color.clone();
        schema.candidate_text_color = this.candidate_text_color.clone();
        schema.comment_text_color = this.comment_text_color.clone();
        return schema;
    }
}
