<script lang="ts">
    import { browser } from "$app/environment";
    import { onNavigate } from "$app/navigation";
    import { fade } from "svelte/transition";

    import IconButton from "$lib/Component/IconButton.svelte";
    import SmoothDiv from "$lib/Component/SmoothDiv.svelte";
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
    const selectActTab = (tab: number) => {
        if (actionTab === tab) {
            actionTab = 0;
        } else {
            actionTab = tab;
            stickyPreview = false;
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
    const selectEditTab = (tab: number) => {
        editorTab = tab;
    };

    var selectedKey: { row: number; col: number } = { row: 0, col: 0 };
    const selectKey = (row: number, col: number) => {
        selectedKey = { row, col };
    };

    var stickyPreview = false;
    var landscapePreview = false;
    const onStickyClick = () => {
        stickyPreview = !stickyPreview;
        if (stickyPreview) {
            actionTab = 0;
        }
    };

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

<div class="gap-2 max-lg:flex max-lg:flex-col lg:grid lg:grid-cols-2">
    <div
        class="-top-44 z-10 flex flex-col gap-2 py-1 lg:col-start-2 lg:h-full"
        class:sticky={!actionTab && stickyPreview}
    >
        <!-- Action Tab Bar -->
        <div class="mx-auto flex h-8 w-full max-w-md gap-2 px-1">
            {#each [actExport, actTemp, actSave, actBatch] as tab}
                <button
                    on:click={() => {
                        selectActTab(tab);
                    }}
                    class:variant-soft={actionTab === tab}
                    class="flex shrink grow items-center justify-center gap-2 rounded-md p-2 hover:variant-ghost"
                >
                    {actNames[tab]}
                </button>
            {/each}
        </div>

        <!-- Action Tab Content -->
        <SmoothDiv height outerClass="px-1 w-full max-w-md mx-auto" class="max-h-[25vh] w-full overflow-y-auto">
            {#if actionTab === actExport}
                <div in:fade class="variant-ghost w-full rounded-md p-2">
                    <ExportBar bind:colorSchemas bind:keyboardLayouts bind:keyStyles />
                </div>
            {:else if actionTab === actTemp}
                <div in:fade class="variant-ghost w-full rounded-md p-2">
                    <PredefinedLayout bind:layout={currentLayout} bind:predefinedKeyboards />
                </div>
            {:else if actionTab === actSave}
                <div in:fade class="variant-ghost w-full rounded-md p-2">
                    <CustomLayout bind:layout={currentLayout} bind:customKeyboards />
                </div>
            {:else if actionTab === actBatch}
                <div in:fade class="variant-ghost w-full rounded-md p-2">
                    <BatchKeyEdit bind:layout={currentLayout} />
                </div>
            {/if}
        </SmoothDiv>

        <!-- Gallery Tab Bar -->
        <div class="mx-auto flex h-8 w-full max-w-md gap-2 px-1">
            {#each [galLayout, galColor] as tab}
                <button
                    disabled={galleryTab === tab}
                    on:click={() => {
                        selectGalTab(tab);
                    }}
                    class:variant-soft={galleryTab === tab}
                    class="flex shrink grow items-center justify-center gap-2 rounded-md p-2 hover:variant-ghost"
                >
                    {galNames[tab]}
                </button>
            {/each}
        </div>
        <div class="grid w-full grid-cols-1 grid-rows-1">
            {#if galleryTab === galColor}
                <!-- Color Schemas Gallery -->
                <div transition:fade class="col-start-1 row-start-1 mx-auto flex max-w-full overflow-auto">
                    <SchemaGallery bind:colorSchemas bind:indexSchema {currentLayout} {currentSchema} />
                </div>
            {:else if galleryTab === galLayout}
                <!-- Layouts Gallery -->
                <div transition:fade class="col-start-1 row-start-1 mx-auto flex max-w-full overflow-auto">
                    <LayoutGallery bind:keyboardLayouts bind:indexLayout {currentLayout} {currentSchema} />
                </div>
            {/if}
        </div>

        <!-- Preview Keyboard -->
        <div
            style:font-family="sans-serif, Symbols Nerd Font"
            class:max-w-md={!landscapePreview}
            class:max-w-3xl={landscapePreview}
            class:max-h-[50vh]={stickyPreview}
            class:sticky={!actionTab && stickyPreview}
            class="top-2 mx-auto w-full max-w-md overflow-auto"
        >
            <!-- color schema and keyboard layout preview -->
            <Preview
                sticky={stickyPreview}
                bind:landscape={landscapePreview}
                schema={currentSchema}
                keyboard={currentLayout}
                {keyStyleMap}
                selected={selectedKey}
                on:clicked={(event) => {
                    selectKey(event.detail.row, event.detail.col);
                }}
                on:sticky={onStickyClick}
            />
        </div>
    </div>

    <div class="flex flex-col gap-2 py-1 lg:row-start-1 lg:h-full lg:overflow-y-auto">
        <!-- Editor Tab Bar -->
        <div class="mx-auto flex h-8 w-full max-w-md gap-2 px-1">
            {#each [editKey, editColor, editLayout, editInset, editKeyStyle] as tab}
                <button
                    disabled={editorTab === tab}
                    on:click={() => {
                        selectEditTab(tab);
                    }}
                    class:variant-soft={editorTab === tab}
                    class="flex shrink grow items-center justify-center gap-2 rounded-md p-2 hover:variant-ghost"
                >
                    {editNames[tab]}
                </button>
            {/each}
        </div>

        <SmoothDiv height outerClass="px-1 w-full max-w-md mx-auto" class="w-full max-sm:text-sm">
            {#if editorTab === editColor}
                <!-- Color Schema Editor -->
                <div in:fade class="w-full lg:overflow-y-auto">
                    <ColorsEditor bind:schema={currentSchema} />
                </div>
            {:else if editorTab === editLayout}
                <!-- Layout Editor -->
                <div in:fade class="w-full lg:overflow-y-auto">
                    <LayoutEdit bind:layout={currentLayout} landscape={landscapePreview} />
                </div>
            {:else if editorTab === editKey}
                <!-- Key Editor -->
                <div in:fade class="flex w-full flex-col gap-2 lg:overflow-y-auto">
                    <KeyEdit
                        bind:layout={currentLayout}
                        bind:selected={selectedKey}
                        {keyStyleNames}
                        landscape={landscapePreview}
                    />
                </div>
            {:else if editorTab === editInset}
                <!-- Button Insets Editor -->
                <div in:fade class="w-full lg:overflow-y-auto">
                    <div class="variant-soft flex flex-col gap-2 rounded-md p-2">
                        <IconButton
                            icon={currentLayout.buttonInsets.expr
                                ? "mdi:checkbox-blank-outline"
                                : "mdi:checkbox-marked-outline"}
                            height="20"
                            on:click={() => {
                                currentLayout.buttonInsets.expr = !currentLayout.buttonInsets.expr;
                            }}
                            class="variant-ringed flex w-full items-center gap-2 rounded-md p-2 hover:variant-ghost"
                        >
                            <span class="grow text-left">使用統一内距</span>
                        </IconButton>

                        <ButtonInsets bind:buttonInsets={currentLayout.buttonInsets} />
                    </div>
                </div>
            {:else if editorTab === editKeyStyle}
                <div in:fade class="w-full lg:overflow-y-auto">
                    <KeyStyleEdit bind:keyStyles colorSchema={currentSchema} />
                </div>
            {/if}
        </SmoothDiv>
    </div>

    <div class="mx-auto grid w-full max-w-2xl grid-cols-1 grid-rows-1 lg:col-span-2">
        <div class="text-xs italic">
            倉輸入法而今已實現内建佈局和配色方案編輯器,<br />
            是故本工具將不再添加新功能.<br />
            您可通過「導出配置」來將以往配置輸出並轉入内建編輯器,<br />
            感謝您的信賴與支持, 江湖路遠, 後會有期!<br />
            餅乾 敬上
        </div>
    </div>

    <SmoothDiv height outerClass="w-full max-w-2xl mx-auto rounded-md hover:variant-ghost lg:col-span-2" class="w-full">
        <details class="w-full p-2">
            <summary class="mx-auto max-w-md p-2">可能有用的簡易説明書</summary>
            <Manual />
        </details>
    </SmoothDiv>
</div>

<style>
    @font-face {
        font-family: "Symbols Nerd Font";
        src:
            local("Symbols Nerd Font"),
            url("https://www.nerdfonts.com/assets/fonts/Symbols-2048-em Nerd Font Complete.woff2") format("woff2");
        font-weight: normal;
        font-style: normal;
    }
</style>
