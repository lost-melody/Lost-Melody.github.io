<script lang="ts">
    import { browser } from "$app/environment";
    import { onNavigate } from "$app/navigation";

    import IconButton from "$lib/Component/IconButton.svelte";
    import { ColorSchema } from "$lib/Hamster/model/colorSchema";
    import { Keyboard } from "$lib/Hamster/model/keyboardLayout";
    import ColorsEditor from "$lib/Hamster/ColorSchemaEdit.svelte";
    import SchemaGallery from "$lib/Hamster/ColorSchemaGallery.svelte";
    import LayoutEdit from "$lib/Hamster/LayoutEdit.svelte";
    import LayoutGallery from "$lib/Hamster/LayoutGallery.svelte";
    import Preview from "$lib/Hamster/Preview.svelte";
    import ExportBar from "$lib/Hamster/ExportBar.svelte";

    import { loadSchemas, saveSchemas } from "$lib/Hamster/utils/colorschemas";
    import {
        loadKeyboards,
        saveKeyboards,
    } from "$lib/Hamster/utils/keyboardlayouts";

    var colorSchemas: ColorSchema[] = [new ColorSchema()];
    var keyboardLayouts: Keyboard[] = [new Keyboard()];
    var indexSchema = 0;
    var indexLayout = 0;
    $: currentSchema = colorSchemas[indexSchema];
    $: currentLayout = keyboardLayouts[indexLayout];

    var selectedKey: { row: number; col: number } = { row: 0, col: 0 };
    const selectKey = (row: number, col: number) => {
        selectedKey = { row, col };
    };

    var stickyPreview = true;

    const [tabColorSchema, tabKeyboardLayout] = [1, 2];
    var editorTab = tabColorSchema;

    const colorSchemasKey = "recoveryColors";
    const keyboardLayoutsKey = "recoveryKeyboards";
    /** load color schemas and keyboard layouts from local storage */
    const loadLocalData = () => {
        const savedSchemas = loadSchemas(colorSchemasKey);
        if (savedSchemas && savedSchemas.length > 0)
            colorSchemas = savedSchemas;
        const savedLayouts = loadKeyboards(keyboardLayoutsKey);
        if (savedLayouts && savedLayouts.length > 0)
            keyboardLayouts = savedLayouts;
    };
    /** save color schemas and keyboard layouts to local storage */
    const saveLocalData = () => {
        saveSchemas(colorSchemasKey, colorSchemas);
        saveKeyboards(keyboardLayoutsKey, keyboardLayouts);
    };
    // save before navigation
    onNavigate(saveLocalData);
    // load data if in browser
    if (browser) loadLocalData();
</script>

<!-- save before unload -->
<svelte:window on:beforeunload={saveLocalData} />

<div class="flex flex-col py-2 gap-2">
    <!-- Action Buttons -->
    <details
        class="p-2 w-full max-w-[400px] mx-auto rounded-md hover:variant-ghost"
    >
        <summary class="p-2">導入導出</summary>
        <ExportBar bind:colorSchemas bind:keyboardLayouts />
    </details>

    <!-- Color Schemas Gallery -->
    <div class="flex max-w-full mx-auto overflow-auto">
        <SchemaGallery bind:colorSchemas bind:indexSchema {currentSchema} />
    </div>

    <!-- Layouts Gallery -->
    <div class="flex max-w-full mx-auto overflow-auto">
        <LayoutGallery
            bind:keyboardLayouts
            bind:indexLayout
            {currentLayout}
            {currentSchema}
        />
    </div>

    <!-- Preview Keyboard -->
    <div
        class:sticky={stickyPreview}
        class="top-12 w-full max-w-[400px] mx-auto max-h-[50vh] overflow-auto"
    >
        <!-- color schema and keyboard layout preview -->
        <Preview
            bind:sticky={stickyPreview}
            schema={currentSchema}
            keyboard={currentLayout}
            selected={selectedKey}
            on:clicked={(event) => {
                selectKey(event.detail.row, event.detail.col);
            }}
        />
    </div>

    <div class="h-10 w-full max-w-[400px] gap-2 mx-auto flex">
        <IconButton
            disabled={editorTab === tabColorSchema}
            on:click={() => {
                editorTab = tabColorSchema;
            }}
            icon="mdi:palette"
            class="flex p-1 gap-1 grow rounded-md justify-center items-center disabled:variant-soft"
            >編輯配色</IconButton
        >
        <IconButton
            disabled={editorTab === tabKeyboardLayout}
            on:click={() => {
                editorTab = tabKeyboardLayout;
            }}
            icon="mdi:keyboard"
            class="flex p-1 gap-1 grow rounded-md justify-center items-center disabled:variant-soft"
            >編輯佈局</IconButton
        >
    </div>

    <!-- Color Schema Editor -->
    {#if editorTab === tabColorSchema}
        <div class="w-full max-w-[400px] mx-auto">
            <ColorsEditor bind:schema={currentSchema} />
        </div>
    {/if}

    <!-- Layout Editor -->
    {#if editorTab === tabKeyboardLayout}
        <div class="w-full max-w-[400px] mx-auto">
            <LayoutEdit
                bind:layout={currentLayout}
                bind:selected={selectedKey}
            />
        </div>
    {/if}
</div>
