<script lang="ts">
    import YAML from "yaml";
    import IconButton from "$lib/Component/IconButton.svelte";

    import type { ColorSchema } from "./model/colorSchema";
    import type { Keyboard } from "./model/keyboardLayout";

    import { exportFile } from "./utils/common";
    import { exportSchemas, importSchemas } from "./utils/colorschemas";
    import { exportKeyboards, importKeyboards } from "./utils/keyboardlayouts";

    export var colorSchemas: ColorSchema[];
    export var keyboardLayouts: Keyboard[];

    const timeoutDelay = 3000;
    // copy code
    var colorSchemasCopied = false;
    var keyboardLayoutsCopied = false;
    const copyColorSchemas = () => {
        colorSchemasCopied = true;
        setTimeout(() => (colorSchemasCopied = false), timeoutDelay);
        navigator.clipboard.writeText(exportSchemas(colorSchemas));
    };
    const copyKeyboardLayouts = () => {
        keyboardLayoutsCopied = true;
        setTimeout(() => (keyboardLayoutsCopied = false), timeoutDelay);
        navigator.clipboard.writeText(exportKeyboards(keyboardLayouts));
    };
    // export code
    const exportColorSchemas = () => {
        const data = exportSchemas(colorSchemas);
        exportFile(data, `colorSchemas-${Date.now()}.yaml`);
    };
    const exportKeyboardLayouts = () => {
        const data = exportKeyboards(keyboardLayouts);
        exportFile(data, `keyboards-${Date.now()}.yaml`);
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
        if (layouts && layouts.length > 0) keyboardLayouts = layouts;
    };
    const onImportYaml = (
        event: Event & { currentTarget: EventTarget & HTMLInputElement }
    ) => {
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
        "h-8 w-full p-2 gap-2 flex items-center rounded-md hover:variant-ghost";
</script>

<div class="w-full gap-2 flex flex-col">
    <!-- copy -->
    <IconButton
        title="複製配色代碼"
        disabled={colorSchemasCopied}
        icon={colorSchemasCopied ? "mdi:check" : "mdi:clipboard"}
        on:click={copyColorSchemas}
        class={classNames}>複製配色代碼</IconButton
    >
    <IconButton
        title="複製佈局代碼"
        disabled={keyboardLayoutsCopied}
        icon={keyboardLayoutsCopied ? "mdi:check" : "mdi:clipboard"}
        on:click={copyKeyboardLayouts}
        class={classNames}>複製佈局代碼</IconButton
    >
    <!-- export -->
    <IconButton
        title="導出配色文件"
        icon="mdi:export"
        on:click={exportColorSchemas}
        class={classNames}>導出配色文件</IconButton
    >
    <IconButton
        title="導出佈局文件"
        icon="mdi:export"
        on:click={exportKeyboardLayouts}
        class={classNames}>導出佈局文件</IconButton
    >
    <!-- import -->
    <IconButton
        title="導入配色或佈局文件"
        icon="mdi:export"
        on:click={onClickImport}
        class={classNames}
        >導入配色或佈局文件
        <div class="w-0 h-0 overflow-hidden">
            <input
                type="file"
                name="import_file"
                bind:this={importFileInput}
                accept=".yaml,.yml"
                on:change={onImportYaml}
                class="px-2 py-1 w-[60%] rounded-full variant-soft"
            />
        </div>
    </IconButton>
</div>
