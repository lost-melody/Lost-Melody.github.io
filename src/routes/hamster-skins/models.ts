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

/** 貼圖册, 包含多個貼圖集 */
export class ImageAlbum {
    /** 貼圖集列表 */
    atlases: ImageAtlas[] = [];
}

/** 貼圖集, 描述一張原始圖片上的多個貼圖引用 */
export class ImageAtlas {
    name: string = "";
    /** 源貼圖 */
    source: string = "";
    descriptors: ImageDescriptor[] = [];
}

/** 貼圖引用, 描述貼圖集中的單張貼圖 */
export class ImageDescriptor {
    /** 裁切的圖片引用 */
    crop: string = "";
    rect: Rect = new Rect();
    insets: Insets = new Insets();
}

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
