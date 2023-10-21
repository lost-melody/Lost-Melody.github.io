<script lang="ts">
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
        return YAML.stringify(objList);
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
</script>

<div class="flex flex-col gap-2">
    <!-- 配色列表 -->
    <div class="flex max-w-full p-2 gap-2 mx-auto overflow-auto">
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
                    class="p-2 rounded-md border"
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

    <hr class="!border-t-2" />

    <!-- 配色預覽區 -->
    <div class="sticky top-0">
        <Preview {schema} />
    </div>

    <div class="flex">
        <div class="mx-auto">
            <button title="删除配色" on:click={delSchema} class="btn-icon variant-soft">
                <Icon color="red" icon="mdi:close" />
            </button>
            <button title="複製配色" on:click={copySchema} class="btn-icon variant-soft">
                <Icon icon="mdi:content-copy" />
            </button>
            <button title="粘貼配色" on:click={pasteSchema} class="btn-icon variant-soft">
                <Icon icon="mdi:content-paste" />
            </button>
        </div>
    </div>

    <!-- 配色調整區 -->
    <div class="py-2">
        <Editor bind:schema />
    </div>

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
    </div>
</div>
