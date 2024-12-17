/** 區域坐標及大小 */
export class Rect {
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
}

/** 區域内距 */
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

/** 皮膚頁面定義 */
export class Skin {
    preeditHeight: number = 0;
    toolbarHeight: number = 0;
    keyboardHeight: number = 0;
    preedit: SkinPreedit = new SkinPreedit();
    toolbar: SkinToolbar = new SkinToolbar();
    keyboard: SkinKeyboard = new SkinKeyboard();
}

/** 預編輯區風格 */
export class SkinPreedit {
    insets: Insets = new Insets();
    backgroundStyle: any;
    foregroundStyle: any;
}

/** 工具欄風格 */
export class SkinToolbar {
    backgroundStyle: any;
    primaryButtonStyle: any;
    secondaryButtonStyle: any;
    horizontalCandidateStyle: any;
    verticalCandidateStyle: any;
    candidateContextMenu: any;
}

/** 鍵盤佈局 */
export class SkinKeyboard {
    style: any;
    subviews: SkinSubview[] = [];
}

/** 子視圖定義: 單元格, 横向排列, 縱向排列 */
export type SkinSubview = SkinKbdCell | SkinKbdHStack | SkinKbdVStack;

/** 排列視圖: 横向, 縱向 */
export class SkinKbdStack {
    style: SkinKbdStackSize = new SkinKbdStackSize();
    subviews: SkinSubview[] = [];
}

export class SkinKbdStackSize {
    width: number = 0;
    height: number = 0;
}

/** 横向排列視圖 */
export class SkinKbdHStack extends SkinKbdStack {
    constructor() {
        super();
    }
}

/** 縱向排列視圖 */
export class SkinKbdVStack extends SkinKbdStack {
    constructor() {
        super();
    }
}

/** 單元格, 表示單個按鍵 */
export class SkinKbdCell {
    size: any;
    bounds: any;
    backgroundStyle: any;
    foregroundStyle: any;
    uppercaseStateForegroundStyle: any;
    capsLockedStateForegroundStyle: any;
    preeditStateForegroundStyle: any;
}
