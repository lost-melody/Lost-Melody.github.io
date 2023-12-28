<script lang="ts">
    import YAML from "yaml";
    import IconButton from "$lib/Component/IconButton.svelte";

    import type { ColorSchema, KeyStyle } from "./model/colorSchema";
    import type { Keyboard } from "./model/keyboardLayout";

    import { exportFile } from "./utils/common";
    import { exportSchemas, importSchemas } from "./utils/colorschemas";
    import { exportKeyboardsV2, exportKeyboardsV2Full, importKeyboards } from "./utils/keyboardlayouts";
    import { getDateTimeString } from "./utils/format";

    export var colorSchemas: ColorSchema[];
    export var keyboardLayouts: Keyboard[];
    export var keyStyles: KeyStyle[];

    const timeoutDelay = 3000;
    // copy code
    var colorSchemasCopied = false;
    const copyColorSchemas = () => {
        colorSchemasCopied = true;
        setTimeout(() => (colorSchemasCopied = false), timeoutDelay);
        navigator.clipboard.writeText(exportSchemas(colorSchemas));
    };
    // export code
    const exportColorSchemas = () => {
        const data = exportSchemas(colorSchemas);
        exportFile(data, `colorSchemas-${getDateTimeString()}.yaml`);
    };
    const exportKeyboardLayoutsV2 = () => {
        const data = exportKeyboardsV2(keyboardLayouts, keyStyles);
        exportFile(data, `keyboards-v2-${getDateTimeString()}.yaml`);
    };
    const exportKeyboardLayoutsV2Full = () => {
        const data = exportKeyboardsV2Full(keyboardLayouts, keyStyles);
        exportFile(data, `keyboards-v2-${getDateTimeString()}.yaml`);
    };
    // import code
    var importFileInput: HTMLInputElement;
    const importYaml = (data: string) => {
        var obj;
        try {
            obj = YAML.parse(data);
        } catch (err) {
            console.warn("failed to parse file:", (err as Error).message);
            return;
        }
        const schemas = importSchemas(obj);
        if (schemas && schemas.length > 0) colorSchemas = schemas;
        const layouts = importKeyboards(obj);
        if (layouts.keyboardLayouts && layouts.keyboardLayouts.length > 0) keyboardLayouts = layouts.keyboardLayouts;
        if (layouts.keyStyles && layouts.keyStyles.length > 0) keyStyles = layouts.keyStyles;
    };
    const onImportYaml = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
        var input = event.currentTarget;
        if (input.files && input.files.length > 0) {
            for (let file of input.files) {
                let reader = new FileReader();
                reader.onload = () => {
                    importYaml(reader.result as string);
                };
                reader.readAsText(file);
            }
        }
    };
    const onClickImport = () => {
        if (importFileInput) {
            importFileInput.click();
        }
    };

    const classNames = "h-8 w-full p-2 gap-2 flex items-center rounded-md hover:variant-ghost";
</script>

<div class="w-full gap-2 flex flex-col">
    <!-- import -->
    <IconButton title="導入配色或佈局文件" icon="mdi:export" on:click={onClickImport} class={classNames}>
        導入配色/佈局
        <div class="w-0 h-0 overflow-hidden">
            <input
                type="file"
                name="import_file"
                bind:this={importFileInput}
                accept=".yaml,.yml"
                on:change={onImportYaml}
            />
        </div>
    </IconButton>
    <!-- copy -->
    <IconButton
        title="複製配色代碼"
        disabled={colorSchemasCopied}
        icon={colorSchemasCopied ? "mdi:check" : "mdi:clipboard"}
        on:click={copyColorSchemas}
        class={classNames}
    >
        複製配色代碼
    </IconButton>
    <!-- export -->
    <IconButton title="導出配色文件" icon="mdi:export" on:click={exportColorSchemas} class={classNames}>
        導出配色文件
    </IconButton>
    <IconButton
        title="導出佈局文件 (所有按鍵樣式存儲在customKeyStyles節點下)"
        icon="mdi:export"
        on:click={exportKeyboardLayoutsV2}
        class={classNames}
    >
        導出佈局文件 (索引按鍵樣式)
    </IconButton>
    <IconButton
        title="導出完整佈局 (所有按鍵樣式内聯, 文件無法導入回本頁面)"
        icon="mdi:export"
        on:click={exportKeyboardLayoutsV2Full}
        class={classNames}
    >
        導出完整佈局 (内聯按鍵樣式)
    </IconButton>
</div>
