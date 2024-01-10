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
    return typeof obj === "string" ? obj : defaultValue || "";
}

function asNumber(obj: any, defaultValue?: number): number {
    return typeof obj === "number" ? obj : defaultValue || 0;
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
        this.alpha = parseInt((res && res[1]) || "FF", 16);
        var bgr = (res && res[2]) || "000000";
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
    /** 按鍵氣泡背景 */
    button_bubble_back_color: Color = new Color("#d0d0d0");
    /** 按鍵文本 */
    button_front_color: Color = new Color("#000000");
    /** 按鍵按下文本 */
    button_pressed_front_color: Color = new Color("#000000");
    /** 按鍵劃動文本 */
    button_swipe_front_color: Color = new Color("#000000");
    /** 鍵面字體大小 */
    font_size: number = 0;
    /** 劃動字體大小 */
    swipe_font_size: number = 0;
    /** 按鍵圓角 */
    corner_radius: number = 5;
    /** 按鍵邊框 */
    border_color: Color = new Color("#000000");
    /** 預編輯文本 */
    text_color: Color = new Color("#000000");
    /** 按鍵下邊框 */
    lower_edge_col: Color = new Color("#000000");
    /** 按鍵陰影 */
    shadow_color: Color = new Color("#000000");
    /** 按鍵陰影大小 */
    shadow_size: number = 0;
    /** 首選背景 */
    hilited_candidate_back_color: Color = new Color("#ffffff");
    /** 首選文本 */
    hilited_candidate_text_color: Color = new Color("#000000");
    /** 首選註釋文本 */
    hilited_comment_text_color: Color = new Color("#000000");
    /** 候選欄首選序號 */
    hilited_candidate_label_color: Color = new Color("#000000");
    /** 候選文本 */
    candidate_text_color: Color = new Color("#000000");
    /** 注釋文本 */
    comment_text_color: Color = new Color("#000000");
    /** 候選欄次選序號 */
    label_color: Color = new Color("#000000");
    /** 長按首選背景 */
    hilited_callout_back_color: Color = new Color("#ffffff");
    /** 長按首選文本 */
    hilited_callout_foreground_color: Color = new Color("#000000");

    toObject(): object {
        var obj: any = {
            schemaName: this.schemaName,
            name: this.name,
            author: this.author,
            back_color: this.back_color.abgr(),
            button_back_color: this.button_back_color.abgr(),
            button_pressed_back_color: this.button_pressed_back_color.abgr(),
            button_bubble_back_color: this.button_bubble_back_color.abgr(),
            button_foreground_color: this.button_front_color.abgr(),
            button_pressed_foreground_color: this.button_pressed_front_color.abgr(),
            button_swipe_foreground_color: this.button_swipe_front_color.abgr(),
            font_size: this.font_size || undefined,
            swipe_font_size: this.swipe_font_size || undefined,
            corner_radius: this.corner_radius,
            border_color: this.border_color.abgr(),
            text_color: this.text_color.abgr(),
            lower_edge_col: this.lower_edge_col.abgr(),
            shadow_color: this.shadow_color.abgr(),
            shadow_size: this.shadow_size || undefined,
            hilited_candidate_back_color: this.hilited_candidate_back_color.abgr(),
            hilited_candidate_text_color: this.hilited_candidate_text_color.abgr(),
            hilited_candidate_label_color: this.hilited_candidate_label_color.abgr(),
            hilited_comment_text_color: this.hilited_comment_text_color.abgr(),
            candidate_text_color: this.candidate_text_color.abgr(),
            comment_text_color: this.comment_text_color.abgr(),
            label_color: this.label_color.abgr(),
            hilited_callout_back_color: this.hilited_callout_back_color.abgr(),
            hilited_callout_foreground_color: this.hilited_callout_foreground_color.abgr(),
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
            this.button_bubble_back_color.fromAbgr(asString(obj.button_bubble_back_color, "0xD0D0D0"));
            if (
                obj.button_foreground_color ||
                obj.button_pressed_foreground_color ||
                obj.button_swipe_foreground_color
            ) {
                this.button_front_color.fromAbgr(asString(obj.button_foreground_color, "0x000000"));
                this.button_pressed_front_color.fromAbgr(asString(obj.button_pressed_foreground_color, "0x000000"));
                this.button_swipe_front_color.fromAbgr(asString(obj.button_swipe_foreground_color, "0x000000"));
            } else {
                this.button_front_color.fromAbgr(asString(obj.button_front_color, "0x000000"));
                this.button_pressed_front_color.fromAbgr(asString(obj.button_pressed_front_color, "0x000000"));
                this.button_swipe_front_color.fromAbgr(asString(obj.button_swipe_front_color, "0x000000"));
            }
            this.font_size = asNumber(obj.font_size);
            this.swipe_font_size = asNumber(obj.swipe_font_size);
            this.corner_radius = asNumber(obj.corner_radius, 5);
            this.border_color.fromAbgr(asString(obj.border_color, "0x000000"));
            this.text_color.fromAbgr(asString(obj.text_color, "0x000000"));
            this.lower_edge_col.fromAbgr(asString(obj.lower_edge_col, "0x000000"));
            this.shadow_color.fromAbgr(asString(obj.shadow_color, "0x000000"));
            this.shadow_size = asNumber(obj.shadow_size);
            this.hilited_candidate_back_color.fromAbgr(asString(obj.hilited_candidate_back_color, "0xffffff"));
            this.hilited_candidate_text_color.fromAbgr(asString(obj.hilited_candidate_text_color, "0x000000"));
            this.hilited_candidate_label_color.fromAbgr(asString(obj.hilited_candidate_label_color, "0x000000"));
            this.hilited_comment_text_color.fromAbgr(asString(obj.hilited_comment_text_color, "0x000000"));
            this.candidate_text_color.fromAbgr(asString(obj.candidate_text_color, "0x000000"));
            this.comment_text_color.fromAbgr(asString(obj.comment_text_color, "0x000000"));
            this.label_color.fromAbgr(asString(obj.label_color, "0x000000"));
            this.hilited_callout_back_color.fromAbgr(asString(obj.hilited_callout_back_color, "0xffffff"));
            this.hilited_callout_foreground_color.fromAbgr(asString(obj.hilited_callout_foreground_color, "0x000000"));
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
        schema.button_bubble_back_color = this.button_bubble_back_color.clone();
        schema.button_front_color = this.button_front_color.clone();
        schema.button_pressed_front_color = this.button_pressed_front_color.clone();
        schema.button_swipe_front_color = this.button_swipe_front_color.clone();
        schema.font_size = this.font_size;
        schema.swipe_font_size = this.swipe_font_size;
        schema.corner_radius = this.corner_radius;
        schema.border_color = this.border_color.clone();
        schema.text_color = this.text_color.clone();
        schema.lower_edge_col = this.lower_edge_col.clone();
        schema.shadow_color = this.shadow_color.clone();
        schema.shadow_size = this.shadow_size;
        schema.hilited_candidate_back_color = this.hilited_candidate_back_color.clone();
        schema.hilited_candidate_text_color = this.hilited_candidate_text_color.clone();
        schema.hilited_candidate_label_color = this.hilited_candidate_label_color.clone();
        schema.hilited_comment_text_color = this.hilited_comment_text_color.clone();
        schema.candidate_text_color = this.candidate_text_color.clone();
        schema.comment_text_color = this.comment_text_color.clone();
        schema.label_color = this.label_color.clone();
        schema.hilited_callout_back_color = this.hilited_callout_back_color.clone();
        schema.hilited_callout_foreground_color = this.hilited_callout_foreground_color.clone();
        return schema;
    }
}

export class KeyStyle {
    id: number = newId();
    name: string = "name";
    buttonBackgroundColor: Color = new Color("#ffffff");
    pressedButtonBackgroundColor: Color = new Color("#d0d0d0");
    buttonForegroundColor: Color = new Color("#000000");
    pressedButtonForegroundColor: Color = new Color("#000000");
    swipeForegroundColor: Color = new Color("#000000");
    pressedSwipeForegroundColor: Color = new Color("#000000");
    cornerRadius: number = 5;
    borderSize: number = 1;
    borderColor: Color = new Color("#000000");
    lowerEdgeColor: Color = new Color("#000000");
    shadowColor: Color = new Color("#000000");
    shadowSize: number = 0;
    fontSize: number = 0;
    swipeFontSize: number = 0;

    toObject(): object {
        var obj: any = {};
        obj.buttonBackgroundColor = this.buttonBackgroundColor.abgr();
        obj.pressedButtonBackgroundColor = this.pressedButtonBackgroundColor.abgr();
        obj.buttonForegroundColor = this.buttonForegroundColor.abgr();
        obj.pressedButtonForegroundColor = this.pressedButtonForegroundColor.abgr();
        obj.swipeForegroundColor = this.swipeForegroundColor.abgr();
        obj.pressedSwipeForegroundColor = this.pressedSwipeForegroundColor.abgr();
        obj.cornerRadius = this.cornerRadius;
        obj.borderSize = this.borderSize;
        obj.borderColor = this.borderColor.abgr();
        obj.lowerEdgeColor = this.lowerEdgeColor.abgr();
        obj.shadowColor = this.shadowColor.abgr();
        obj.shadowSize = this.shadowSize || undefined;
        obj.fontSize = this.fontSize || undefined;
        obj.swipeFontSize = this.swipeFontSize || undefined;
        return obj;
    }

    fromObject(obj: any): void {
        if (obj && typeof obj === "object") {
            this.buttonBackgroundColor.fromAbgr(asString(obj.buttonBackgroundColor, "0xffffff"));
            this.pressedButtonBackgroundColor.fromAbgr(asString(obj.pressedButtonBackgroundColor, "0xd0d0d0"));
            this.buttonForegroundColor.fromAbgr(asString(obj.buttonForegroundColor, "0x000000"));
            this.pressedButtonForegroundColor.fromAbgr(asString(obj.pressedButtonForegroundColor, "0x000000"));
            this.swipeForegroundColor.fromAbgr(asString(obj.swipeForegroundColor, "0x000000"));
            this.pressedSwipeForegroundColor.fromAbgr(asString(obj.pressedSwipeForegroundColor, "0x000000"));
            this.cornerRadius = asNumber(obj.cornerRadius, 5);
            this.borderSize = asNumber(obj.borderSize, 1);
            this.borderColor.fromAbgr(asString(obj.borderColor, "0x000000"));
            this.lowerEdgeColor.fromAbgr(asString(obj.lowerEdgeColor, "0x000000"));
            this.shadowColor.fromAbgr(asString(obj.shadowColor, "0x000000"));
            this.shadowSize = asNumber(obj.shadowSize);
            this.fontSize = asNumber(obj.fontSize);
            this.swipeFontSize = asNumber(obj.swipeFontSize);
        }
    }

    clone(): KeyStyle {
        var keyStyle = new KeyStyle();
        keyStyle.name = this.name;
        keyStyle.buttonBackgroundColor = this.buttonBackgroundColor.clone();
        keyStyle.pressedButtonBackgroundColor = this.pressedButtonBackgroundColor.clone();
        keyStyle.buttonForegroundColor = this.buttonForegroundColor.clone();
        keyStyle.pressedButtonForegroundColor = this.pressedButtonForegroundColor.clone();
        keyStyle.swipeForegroundColor = this.swipeForegroundColor.clone();
        keyStyle.pressedSwipeForegroundColor = this.pressedSwipeForegroundColor.clone();
        keyStyle.cornerRadius = this.cornerRadius;
        keyStyle.borderSize = this.borderSize;
        keyStyle.lowerEdgeColor = this.lowerEdgeColor.clone();
        keyStyle.shadowColor = this.shadowColor.clone();
        keyStyle.fontSize = this.fontSize;
        keyStyle.swipeFontSize = this.swipeFontSize;
        return keyStyle;
    }
}
