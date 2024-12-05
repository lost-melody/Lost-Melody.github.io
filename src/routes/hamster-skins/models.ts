export class SkinConfig {
    name: string = "倉鼠皮";
    author: string = "倉師傅";

    pinyin?: SkinEntries;
    alphabetic?: SkinEntries;
    numeric?: SkinEntries;
    symbolic?: SkinEntries;
}

export class SkinEntries {
    iphone?: SkinEntry;
    ipad?: SkinEntry;
}

export class SkinEntry {
    portrait?: SkinStyles;
    landscape?: SkinStyles;
    floating?: SkinStyles;
}

export class SkinStyles {
    dark?: Skin;
    light?: Skin;
}

export class Skin {
    preeditHeight: number = 0;
    toolbarHeight: number = 0;
    keyboardHeight: number = 0;
    preedit?: SkinPreedit;
    toolbar?: SkinToolbar;
    keyboard?: SkinKeyboard;
}

export class SkinPreedit {
    insets: any;
    backgroundStyle: any;
    foregroundStyle: any;
}

export class SkinToolbar {
    backgroundStyle: any;
    primaryButtonStyle: any;
    secondaryButtonStyle: any;
    horizontalCandidateStyle: any;
    verticalCandidateStyle: any;
}

export class SkinKeyboard {
    style: any;
    subviews: SkinSubview[] = [];
}

export type SkinSubview = SkinKbdCell | SkinKbdHStack | SkinKbdVStack;

export class SkinKbdStack {
    style: any;
    subviews: SkinSubview[] = [];
}

export class SkinKbdHStack extends SkinKbdStack {
    constructor() {
        super();
    }
}

export class SkinKbdVStack extends SkinKbdStack {
    constructor() {
        super();
    }
}

export class SkinKbdCell {
    size: any;
    bounds: any;
    backgroundStyle: any;
    foregroundStyle: any;
    uppercaseStateForegroundStyle: any;
    capsLockedStateForegroundStyle: any;
    preeditStateForegroundStyle: any;
}

export class Rect {
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
}

export class Insets {
    top: number = 0;
    bottom: number = 0;
    left: number = 0;
    right: number = 0;
}
