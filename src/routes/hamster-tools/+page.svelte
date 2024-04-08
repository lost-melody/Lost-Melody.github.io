<script lang="ts">
    import { browser } from "$app/environment";
    import { onNavigate } from "$app/navigation";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import { fade } from "svelte/transition";
    import { localStorageStore } from "@skeletonlabs/skeleton";
    import Icon from "@iconify/svelte";

    import IconButton from "$lib/Component/IconButton.svelte";
    import { ColorSchema, KeyStyle } from "$lib/Hamster/model/colorSchema";
    import { Keyboard } from "$lib/Hamster/model/keyboardLayout";
    import ColorsEditor from "$lib/Hamster/ColorSchemaEdit.svelte";
    import SchemaGallery from "$lib/Hamster/ColorSchemaGallery.svelte";
    import LayoutEdit from "$lib/Hamster/LayoutEdit.svelte";
    import LayoutGallery from "$lib/Hamster/LayoutGallery.svelte";
    import Preview from "$lib/Hamster/Preview.svelte";
    import ExportBar from "$lib/Hamster/ExportBar.svelte";
    import BatchKeyEdit from "$lib/Hamster/BatchKeyEdit.svelte";
    import PredefinedLayout from "$lib/Hamster/PredefinedLayout.svelte";
    import CustomLayout from "$lib/Hamster/CustomLayout.svelte";
    import ButtonInsets from "$lib/Hamster/ButtonInsets.svelte";
    import KeyEdit from "$lib/Hamster/KeyEditor.svelte";
    import KeyStyleEdit from "$lib/Hamster/KeyStyleEdit.svelte";
    import Manual from "$lib/Hamster/Manual.svelte";

    import { loadSchemas, saveSchemas } from "$lib/Hamster/utils/colorschemas";
    import { loadKeyboards, saveKeyboards } from "$lib/Hamster/utils/keyboardlayouts";
    import { loadKeyStyles, saveKeyStyles } from "$lib/Hamster/utils/keystyles";

    var colorSchemas: ColorSchema[] = [new ColorSchema()];
    var keyboardLayouts: Keyboard[] = [new Keyboard()];
    var keyStyles: KeyStyle[] = [];
    var indexSchema = 0;
    var indexLayout = 0;
    $: currentSchema = colorSchemas[indexSchema];
    $: currentLayout = keyboardLayouts[indexLayout];
    $: keyStyleNames = keyStyles.map((style) => style.name);
    var keyStyleMap: { [name: string]: KeyStyle };
    $: {
        keyStyleMap = {};
        for (let keyStyle of keyStyles) {
            keyStyleMap[keyStyle.name] = keyStyle;
        }
    }

    /** 預設鍵盤模板 */
    var predefinedKeyboards: object[] = [];
    /** 自定義鍵盤存儲位 */
    var customKeyboards: object[];

    const [actExport, actTemp, actSave, actBatch] = [1, 2, 3, 4];
    var actionTab = 0;
    const actNames = {
        [actExport]: "導出",
        [actTemp]: "模板",
        [actSave]: "檔案",
        [actBatch]: "操作",
    };
    const actHeight = tweened(0, {
        easing: cubicOut,
    });
    const selectActTab = (tab: number) => {
        if (actionTab === tab) {
            actionTab = 0;
        } else {
            actionTab = tab;
        }
    };

    var galleryTab = 0;
    const [galLayout, galColor] = [0, 1];
    const galNames = {
        [galLayout]: "鍵盤佈局",
        [galColor]: "配色方案",
    };
    const selectGalTab = (tab: number) => {
        galleryTab = tab;
    };

    var editorTab = 0;
    const [editKey, editColor, editLayout, editInset, editKeyStyle] = [0, 1, 2, 3, 4];
    const editNames = {
        [editKey]: "按鍵",
        [editColor]: "配色",
        [editLayout]: "佈局",
        [editInset]: "内距",
        [editKeyStyle]: "樣式",
    };
    const editHeight = tweened(0, {
        easing: cubicOut,
    });
    const selectEditTab = (tab: number) => {
        editorTab = tab;
    };

    const manHeight = tweened(0, {
        easing: cubicOut,
    });

    var selectedKey: { row: number; col: number } = { row: 0, col: 0 };
    const selectKey = (row: number, col: number) => {
        selectedKey = { row, col };
    };

    var stickyPreview = false;
    var landscapePreview = false;
    var previewFontFamilies = localStorageStore("previewFontFamilies", "");

    const colorSchemasKey = "recoveryColors";
    const keyboardLayoutsKey = "recoveryKeyboards";
    const keyStylesKey = "recoveryKeyStyles";
    /** load color schemas and keyboard layouts from local storage */
    const loadLocalData = () => {
        const savedSchemas = loadSchemas(colorSchemasKey);
        if (savedSchemas && savedSchemas.length > 0) colorSchemas = savedSchemas;
        const savedLayouts = loadKeyboards(keyboardLayoutsKey);
        if (savedLayouts && savedLayouts.length > 0) keyboardLayouts = savedLayouts;
        const savedKeyStyles = loadKeyStyles(keyStylesKey);
        if (savedKeyStyles && savedKeyStyles.length > 0) keyStyles = savedKeyStyles;
    };
    /** save color schemas and keyboard layouts to local storage */
    const saveLocalData = () => {
        saveSchemas(colorSchemasKey, colorSchemas);
        saveKeyboards(keyboardLayoutsKey, keyboardLayouts);
        saveKeyStyles(keyStylesKey, keyStyles);
    };
    /** save data on visibility hidden */
    const onVisibilityChange = (e: Event & { currentTarget: EventTarget & Document }) => {
        if (e.currentTarget.visibilityState === "hidden") {
            saveLocalData();
        }
    };
    // save before navigation
    onNavigate(saveLocalData);
    // load data if in browser
    if (browser) {
        loadLocalData();
        if (keyboardLayouts[0].rows.length === 0) {
            actionTab = actExport;
        }
    }
</script>

<!-- save before hidden -->
<svelte:document on:visibilitychange={onVisibilityChange} />

<!-- save before unload -->
<!-- this does not work in Safari -->
<!-- <svelte:window on:beforeunload={saveLocalData} /> -->

<div class="max-lg:flex max-lg:flex-col lg:grid lg:grid-cols-2 gap-2">
    <div class="p-1 gap-2 flex flex-col md:col-start-2">
        <!-- Action Tab Bar -->
        <div class="h-8 w-full max-w-md mx-auto flex gap-2">
            {#each [actExport, actTemp, actSave, actBatch] as tab}
                <button
                    on:click={() => {
                        selectActTab(tab);
                    }}
                    class:variant-soft={actionTab === tab}
                    class="p-2 gap-2 grow shrink flex items-center justify-center rounded-md hover:variant-ghost"
                >
                    {actNames[tab]}
                </button>
            {/each}
        </div>

        <!-- Action Tab Content -->
        <div style={`height: ${$actHeight}px`} class="overflow-y-hidden w-full max-w-md mx-auto">
            <!-- 監控内部容器高度變化, 並使用緩動函數應用到外部容器 -->
            <div bind:clientHeight={$actHeight} class="w-full">
                {#if actionTab === actExport}
                    <div in:fade class="p-2 w-full max-h-[25vh] overflow-y-auto rounded-md variant-ghost">
                        <ExportBar bind:colorSchemas bind:keyboardLayouts bind:keyStyles />
                    </div>
                {:else if actionTab === actTemp}
                    <div in:fade class="p-2 w-full max-h-[25vh] overflow-y-auto rounded-md variant-ghost">
                        <PredefinedLayout bind:layout={currentLayout} bind:predefinedKeyboards />
                    </div>
                {:else if actionTab === actSave}
                    <div in:fade class="p-2 w-full max-h-[25vh] overflow-y-auto rounded-md variant-ghost">
                        <CustomLayout bind:layout={currentLayout} bind:customKeyboards />
                    </div>
                {:else if actionTab === actBatch}
                    <div in:fade class="p-2 w-full max-h-[25vh] overflow-y-auto rounded-md variant-ghost">
                        <BatchKeyEdit bind:layout={currentLayout} />
                    </div>
                {/if}
            </div>
        </div>

        <!-- Gallery Tab Bar -->
        <div class="h-8 w-full max-w-md mx-auto flex gap-2">
            {#each [galLayout, galColor] as tab}
                <button
                    disabled={galleryTab === tab}
                    on:click={() => {
                        selectGalTab(tab);
                    }}
                    class:variant-soft={galleryTab === tab}
                    class="p-2 gap-2 grow shrink flex items-center justify-center rounded-md hover:variant-ghost"
                >
                    {galNames[tab]}
                </button>
            {/each}
        </div>
        <div class="w-full grid grid-cols-1 grid-rows-1">
            {#if galleryTab === galColor}
                <!-- Color Schemas Gallery -->
                <div transition:fade class="flex max-w-full mx-auto overflow-auto row-start-1 col-start-1">
                    <SchemaGallery bind:colorSchemas bind:indexSchema {currentLayout} {currentSchema} />
                </div>
            {:else if galleryTab === galLayout}
                <!-- Layouts Gallery -->
                <div transition:fade class="flex max-w-full mx-auto overflow-auto row-start-1 col-start-1">
                    <LayoutGallery bind:keyboardLayouts bind:indexLayout {currentLayout} {currentSchema} />
                </div>
            {/if}
        </div>

        <!-- Preview Keyboard -->
        <div
            style:font-family={$previewFontFamilies}
            class:sticky={stickyPreview}
            class:max-w-md={!landscapePreview}
            class:max-w-3xl={landscapePreview}
            class:max-h-[50vh]={stickyPreview}
            class="top-0 w-full max-w-md mx-auto overflow-auto"
        >
            <!-- color schema and keyboard layout preview -->
            <Preview
                bind:sticky={stickyPreview}
                bind:landscape={landscapePreview}
                schema={currentSchema}
                keyboard={currentLayout}
                {keyStyleMap}
                selected={selectedKey}
                on:clicked={(event) => {
                    selectKey(event.detail.row, event.detail.col);
                }}
            />
        </div>
    </div>

    <div class="p-1 gap-2 flex flex-col md:row-start-1 md:overflow-y-auto">
        <!-- Editor Tab Bar -->
        <div class="h-8 w-full max-w-md mx-auto flex gap-2">
            {#each [editKey, editColor, editLayout, editInset, editKeyStyle] as tab}
                <button
                    disabled={editorTab === tab}
                    on:click={() => {
                        selectEditTab(tab);
                    }}
                    class:variant-soft={editorTab === tab}
                    class="p-2 gap-2 grow shrink flex items-center justify-center rounded-md hover:variant-ghost"
                >
                    {editNames[tab]}
                </button>
            {/each}
        </div>

        <div style={`height: ${$editHeight}px`} class="overflow-y-hidden w-full max-w-md mx-auto">
            <div bind:clientHeight={$editHeight} class="w-full">
                {#if editorTab === editColor}
                    <!-- Color Schema Editor -->
                    <div in:fade class="w-full">
                        <ColorsEditor bind:schema={currentSchema} />
                    </div>
                {:else if editorTab === editLayout}
                    <!-- Layout Editor -->
                    <div in:fade class="w-full">
                        <LayoutEdit bind:layout={currentLayout} landscape={landscapePreview} />
                    </div>
                {:else if editorTab === editKey}
                    <!-- Key Editor -->
                    <div in:fade class="w-full flex flex-col gap-2">
                        <div class="p-2 w-full flex gap-2 items-center rounded-md variant-soft">
                            <Icon height="20" icon="mdi-format-size" />
                            <span class="">預覽字體</span>
                            <input
                                title="鍵盤預覽區顯示字體, 逗號分隔"
                                bind:value={$previewFontFamilies}
                                placeholder="Symbols Nerd Font, sans-serif"
                                class="h-10 px-2 grow rounded-md variant-ringed hover:variant-ghost"
                            />
                        </div>
                        <KeyEdit
                            bind:layout={currentLayout}
                            bind:selected={selectedKey}
                            {keyStyleNames}
                            landscape={landscapePreview}
                        />
                    </div>
                {:else if editorTab === editInset}
                    <!-- Button Insets Editor -->
                    <div in:fade class="w-full">
                        <div class="p-2 rounded-md variant-soft">
                            <IconButton
                                icon={currentLayout.buttonInsets.expr
                                    ? "mdi:checkbox-blank-outline"
                                    : "mdi:checkbox-marked-outline"}
                                height="20"
                                on:click={() => {
                                    currentLayout.buttonInsets.expr = !currentLayout.buttonInsets.expr;
                                }}
                                class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
                            >
                                <span class="grow text-left">使用統一内距</span>
                            </IconButton>

                            <ButtonInsets bind:buttonInsets={currentLayout.buttonInsets} />
                        </div>
                    </div>
                {:else if editorTab === editKeyStyle}
                    <div in:fade class="w-full">
                        <KeyStyleEdit bind:keyStyles />
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <div class="w-full max-w-2xl mx-auto grid grid-cols-1 grid-rows-1 md:col-span-2">
        <div class="italic text-xs">
            倉輸入法而今已實現内建佈局和配色方案編輯器,<br />
            是故本工具將不再添加新功能.<br />
            您可通過「導出配置」來將以往配置輸出並轉入内建編輯器,<br />
            感謝您的信賴與支持, 江湖路遠, 後會有期!<br />
            餅乾 敬上
        </div>
    </div>

    <div
        style={`height: ${$manHeight}px`}
        class="overflow-hidden w-full max-w-2xl mx-auto rounded-md hover:variant-ghost md:col-span-2"
    >
        <div bind:clientHeight={$manHeight} class="w-full">
            <details class="p-2 w-full">
                <summary class="max-w-md mx-auto p-2">可能有用的簡易説明書</summary>
                <Manual />
            </details>
        </div>
    </div>
</div>
