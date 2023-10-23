<script lang="ts">
    import { browser } from "$app/environment";
    import { onNavigate } from "$app/navigation";
    import { scale } from "svelte/transition";
    import YAML from "yaml";
    import Icon from "@iconify/svelte";
    import { ColorSchema } from "$lib/Hamster/Colors/HamsterColors";
    import Preview from "$lib/Hamster/Colors/Preview.svelte";
    import Editor from "$lib/Hamster/Colors/Editor.svelte";

    var schemas: ColorSchema[] = [new ColorSchema()];

    var selected = 0;
    var theHiddenSchema = new ColorSchema();
    $: schema = schemas[selected] || theHiddenSchema;

    var copiedState = false;

    const addSchema = () => {
        schemas.push(schemas[selected].clone() || theHiddenSchema.clone());
        schemas = schemas;
        selected = schemas.length - 1;
    };
    const delSchema = () => {
        schemas.splice(selected, 1);
        if (schemas.length === 0) {
            schemas.push(theHiddenSchema.clone());
        }
        if (selected >= schemas.length) {
            selected = schemas.length - 1;
        }
        schemas = schemas;
    };
    const copySchema = () => {
        theHiddenSchema = schema.clone();
    };
    const pasteSchema = () => {
        schemas[selected] = theHiddenSchema.clone();
    };
    const selectSchema = (index: number) => {
        selected = index;
    };

    const generateYaml: () => string = () => {
        var objList = schemas.map((schema) => schema.toObject());
        return YAML.stringify({
            Keyboard: {
                colorSchemas: objList,
            },
        });
    };
    const copyYaml = () => {
        copiedState = true;
        setTimeout(() => (copiedState = false), 3000);
        navigator.clipboard.writeText(generateYaml());
    };
    const downloadYaml = () => {
        var link = document.createElement("a");
        var blob = new Blob([generateYaml()], {
            type: "application/yaml; charset=utf-8",
        });
        var url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = `colorSchemas-${Date.now()}.yaml`;
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    var importFileInput: HTMLInputElement;
    const importYaml = (data: string) => {
        try {
            let obj = YAML.parse(data);
            if (obj && obj.Keyboard && obj.Keyboard.colorSchemas) {
                schemas = (obj.Keyboard.colorSchemas as object[]).map((o) => {
                    var sch = new ColorSchema();
                    sch.fromObject(o);
                    return sch;
                });
            }
        } catch (err) {
            console.error("import file failed:", (err as Error).message);
        }
    };
    function onImportYaml(
        event: Event & { currentTarget: EventTarget & HTMLInputElement }
    ): void {
        var input = event.currentTarget;
        if (input.files && input.files.length > 0) {
            for (let file of input.files) {
                let reader = new FileReader();
                reader.onload = (_) => {
                    importYaml(reader.result as string);
                };
                reader.readAsText(file);
            }
        }
    }
    function onClickImport(
        event: Event & { currentTarget: EventTarget & HTMLButtonElement }
    ): void {
        if (importFileInput) {
            importFileInput.click();
        }
    }

    // 加載頁面恢復數據
    const recoveryDataKey = "recoveryColors";
    var recoveryData = browser && localStorage.getItem(recoveryDataKey);
    if (recoveryData) {
        try {
            let objList = YAML.parse(recoveryData);
            schemas = (objList as object[]).map((o) => {
                var sch = new ColorSchema();
                sch.fromObject(o);
                return sch;
            });
        } catch (err) {
            console.error(
                "failed to load recovery data:",
                (err as Error).message
            );
        }
    }
    /** 保存頁面恢復數據 */
    function saveCurrentSchemas(): void {
        localStorage.setItem(
            recoveryDataKey,
            YAML.stringify(schemas.map((sch) => sch.toObject()))
        );
    }
    // 頁面路由前, 保存恢復數據
    onNavigate(saveCurrentSchemas);
</script>

<!-- 頁面關閉前, 保存恢復數據 -->
<svelte:window on:beforeunload={saveCurrentSchemas} />

<div class="flex flex-col p-2 gap-2">
    <!-- 配色列表 -->
    <div class="flex max-w-full gap-2 mx-auto overflow-auto">
        {#each schemas as schema, index (schema.id)}
            <button
                on:click={() => selectSchema(index)}
                transition:scale
                style={`background-color: ${schema.back_color.rgba()};` +
                    `border-color: ${schema.border_color.rgba()};`}
                class:border-2={index === selected}
                class:border-dashed={index === selected}
                class="w-32 h-24 p-2 shrink-0 flex flex-col btn rounded-md border"
            >
                <span
                    style={`color: ${schema.text_color.rgba()};`}
                    class="text-xs"
                >
                    {schema.schemaName}
                </span>
                <span
                    style={`color: ${schema.hilited_candidate_text_color.rgba()};` +
                        `background-color: ${schema.hilited_candidate_back_color.rgba()};`}
                    class="p-1 rounded-md border text-sm"
                >
                    {schema.name}
                </span>
            </button>
        {/each}
        <button
            on:click={addSchema}
            class="flex justify-center items-center w-32 h-24 p-2 shrink-0 btn rounded-md variant-ghost"
        >
            <Icon height="64" icon="mdi:plus" />
        </button>
    </div>

    <hr />

    <!-- 複製和導出 -->
    <div class="mx-auto max-w-full overflow-auto btn-group variant-ghost">
        <button
            disabled={copiedState}
            on:click={copyYaml}
            class="flex items-center gap-1"
        >
            <Icon icon={copiedState ? "mdi:check" : "mdi:clipboard"} />
            {copiedState ? "已複製" : "複製"}
        </button>
        <button on:click={downloadYaml} class="flex items-center gap-1">
            <Icon icon="mdi:export" />
            導出
        </button>
        <button on:click={onClickImport} class="flex items-center gap-1">
            <Icon icon="mdi:import" />
            導入
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
        </button>
    </div>

    <!-- 配色預覽區 -->
    <div class="sticky top-0">
        <Preview {schema} />
    </div>

    <!-- 動作按鈕 -->
    <div class="flex">
        <div class="mx-auto">
            <button
                title="删除配色"
                on:click={delSchema}
                class="btn-icon variant-soft"
            >
                <Icon color="red" icon="mdi:close" />
            </button>
            <button
                title="複製配色"
                on:click={copySchema}
                class="btn-icon variant-soft"
            >
                <Icon icon="mdi:content-copy" />
            </button>
            <button
                title="粘貼配色"
                on:click={pasteSchema}
                class="btn-icon variant-soft"
            >
                <Icon icon="mdi:content-paste" />
            </button>
        </div>
    </div>

    <!-- 配色調整區 -->
    <div class="py-2">
        <Editor bind:schema />
    </div>
</div>
