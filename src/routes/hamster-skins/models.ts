/** 區域坐標及大小 */
export class Rect {
    x: number = $state(0);
    y: number = $state(0);
    width: number = $state(0);
    height: number = $state(0);
}

/** 區域内距 */
export class Insets {
    top: number = $state(0);
    bottom: number = $state(0);
    left: number = $state(0);
    right: number = $state(0);
}

/** 貼圖册, 包含多個貼圖集 */
export class ImageAlbum {
    /** 貼圖集列表 */
    atlases: ImageAtlas[] = $state([]);
}

/** 貼圖集, 描述一張原始圖片上的多個貼圖引用 */
export class ImageAtlas {
    name: string = $state("");
    /** 源貼圖 */
    source: string = $state("");
    descriptors: ImageDescriptor[] = $state([]);
}

/** 貼圖引用, 描述貼圖集中的單張貼圖 */
export class ImageDescriptor {
    /** 裁切的圖片引用 */
    crop: string = $state("");
    rect: Rect = $state(new Rect());
    insets: Insets = $state(new Insets());
}

/** 皮膚頁面定義 */
export class Skin {
    preeditHeight: number = $state(0);
    toolbarHeight: number = $state(0);
    keyboardHeight: number = $state(0);
    preedit: SkinPreedit = $state(new SkinPreedit());
    toolbar: SkinToolbar = $state(new SkinToolbar());
    keyboard: SkinKeyboard = $state(new SkinKeyboard());
}

/** 預編輯區風格 */
export class SkinPreedit {
    insets: Insets = $state(new Insets());
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
    subviews: SkinSubview[] = $state([]);
}

/** 子視圖定義: 單元格, 横向排列, 縱向排列 */
export type SkinSubview = SkinKbdCell | SkinKbdHStack | SkinKbdVStack;

/** 排列視圖: 横向, 縱向 */
export class SkinKbdStack {
    style: SkinKbdStackSize = $state(new SkinKbdStackSize());
    subviews: SkinSubview[] = $state([]);
}

export class SkinKbdStackSize {
    width: number = $state(0);
    height: number = $state(0);
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
