<script lang="ts">
    import YAML from "yaml";
    import IconButton from "$lib/Component/IconButton.svelte";

    import type { ColorSchema, KeyStyle } from "./model/colorSchema";
    import type { Keyboard } from "./model/keyboardLayout";

    import { exportFile } from "./utils/common";
    import { exportSchemas, importSchemas } from "./utils/colorschemas";
    import { assignKeyStyles, exportKeyboards, exportKeyStyles, importKeyboards } from "./utils/keyboardlayouts";
    import { getDateTimeString } from "./utils/format";

    export var colorSchemas: ColorSchema[];
    export var keyboardLayouts: Keyboard[];
    export var keyStyles: KeyStyle[];

    const timeoutDelay = 2000;
    // copy code
    var colorSchemasCopied = false;
    var keyboardLayoutInlineCopied = false;
    var keyStylesCopied = false;
    const copyColorSchemas = () => {
        colorSchemasCopied = true;
        setTimeout(() => (colorSchemasCopied = false), timeoutDelay);
        navigator.clipboard.writeText(YAML.stringify(exportSchemas(colorSchemas)));
    };
    const copyKeyboardLayouts = () => {
        keyboardLayoutInlineCopied = true;
        setTimeout(() => (keyboardLayoutInlineCopied = false), timeoutDelay);
        navigator.clipboard.writeText(YAML.stringify(exportKeyboards(keyboardLayouts, keyStyles)));
    };
    const copyKeyboardKeyStyles = () => {
        keyStylesCopied = true;
        setTimeout(() => (keyStylesCopied = false), timeoutDelay);
        navigator.clipboard.writeText(YAML.stringify(exportKeyStyles(keyStyles)));
    };
    // export code
    const exportConfigs = () => {
        const expSchemas = exportSchemas(colorSchemas);
        const expLayouts: any = exportKeyboards(keyboardLayouts);
        const expStyles: any = exportKeyStyles(keyStyles);
        expLayouts.keyboards = assignKeyStyles(expLayouts.keyboards, expStyles.keyStyle);
        const data = YAML.stringify({
            ...expSchemas,
            ...expStyles,
            ...expLayouts,
        });
        exportFile(data, `custom_configs-${getDateTimeString()}.yaml`);
    };
    const exportColorSchemas = () => {
        const data = YAML.stringify(exportSchemas(colorSchemas));
        exportFile(data, `custom_color_schemas-${getDateTimeString()}.yaml`);
    };
    const exportKeyboardLayouts = () => {
        const data = YAML.stringify(exportKeyboards(keyboardLayouts, keyStyles));
        exportFile(data, `custom_keyboards-${getDateTimeString()}.yaml`);
    };
    const exportKeyboardKeyStyles = () => {
        const data = YAML.stringify(exportKeyStyles(keyStyles));
        exportFile(data, `custom_key_styles-${getDateTimeString()}.yaml`);
    };
    // import code
    var importFileInput: HTMLInputElement;
    const importYaml = (data: string) => {
        var obj;
        try {
            obj = YAML.parse(data, { maxAliasCount: -1 });
        } catch (err) {
            alert(`failed to parse file: ${(err as Error).message}`);
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

    const classNames =
        "h-8 w-full p-2 gap-2 flex items-center justify-center rounded-md variant-ringed hover:variant-ghost";
</script>

<div class="w-full gap-1 flex flex-col">
    <div class="flex gap-1">
        <!-- import -->
        <IconButton title="導入配色或佈局文件" icon="mdi:import" on:click={onClickImport} class={classNames}>
            導入配置
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
        <!-- export -->
        <IconButton
            title="導出配置 (含配色方案, 鍵盤佈局及按鍵樣式)"
            icon="mdi:export"
            on:click={exportConfigs}
            class={classNames}
        >
            導出配置
        </IconButton>
    </div>
    <div class="flex gap-1">
        <IconButton title="導出配色文件" icon="mdi:export" on:click={exportColorSchemas} class={classNames}>
            導出配色
        </IconButton>
        <IconButton title="導出佈局文件" icon="mdi:export" on:click={exportKeyboardLayouts} class={classNames}>
            導出佈局
        </IconButton>
        <IconButton title="導出按鍵樣式表" icon="mdi:export" on:click={exportKeyboardKeyStyles} class={classNames}>
            導出樣式
        </IconButton>
    </div>
    <!-- copy -->
    <div class="flex gap-1">
        <IconButton
            title="複製配色代碼"
            disabled={colorSchemasCopied}
            icon={colorSchemasCopied ? "mdi:check" : "mdi:clipboard"}
            on:click={copyColorSchemas}
            class={classNames}
        >
            複製配色
        </IconButton>
        <IconButton
            title="複制佈局代碼"
            disabled={keyboardLayoutInlineCopied}
            icon={keyboardLayoutInlineCopied ? "mdi:check" : "mdi:clipboard"}
            on:click={copyKeyboardLayouts}
            class={classNames}
        >
            複製佈局
        </IconButton>
        <IconButton
            title="複製按鍵樣式表"
            disabled={keyStylesCopied}
            icon={keyStylesCopied ? "mdi:check" : "mdi:clipboard"}
            on:click={copyKeyboardKeyStyles}
            class={classNames}
        >
            複製樣式
        </IconButton>
    </div>
</div>
