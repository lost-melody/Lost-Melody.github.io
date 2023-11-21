<script lang="ts">
    import { scale } from "svelte/transition";
    import { flip } from "svelte/animate";
    import Icon from "@iconify/svelte";
    import IconButton from "$lib/Component/IconButton.svelte";

    import type { Keyboard } from "./model/keyboardLayout";
    import { ColorSchema } from "./model/colorSchema";
    import Thumbnail from "./Thumbnail.svelte";

    export var colorSchemas: ColorSchema[];
    export var indexSchema: number;
    export var currentSchema: ColorSchema;
    export var currentLayout: Keyboard;

    var clipSchema = new ColorSchema();
    const copySchema = () => {
        clipSchema = currentSchema.clone();
    };
    const pasteSchema = () => {
        colorSchemas[indexSchema] = clipSchema.clone();
    };
    const selectSchema = (index: number) => {
        indexSchema = index;
    };
    const addSchema = () => {
        colorSchemas.push(currentSchema.clone());
        colorSchemas = colorSchemas;
        indexSchema = colorSchemas.length - 1;
    };
    const delSchema = () => {
        colorSchemas.splice(indexSchema, 1);
        if (colorSchemas.length === 0) {
            colorSchemas.push(new ColorSchema());
        }
        colorSchemas = colorSchemas;
        if (indexSchema >= colorSchemas.length) {
            indexSchema = colorSchemas.length - 1;
        }
    };
</script>

<div class="flex gap-2 px-8">
    {#each colorSchemas as schema, index (schema.id)}
        <div animate:flip transition:scale class="relative">
            <button
                on:click={() => selectSchema(index)}
                style:background-color={schema.back_color.rgba()}
                style:border-color={schema.border_color.rgba()}
                class:border-2={index === indexSchema}
                class:border-dashed={index === indexSchema}
                class="w-32 h-24 p-2 shrink-0 flex flex-col rounded-md border active:scale-95"
            >
                <Thumbnail layout={currentLayout} {schema} />
            </button>
            <span
                style={`color: ${schema.hilited_candidate_text_color.rgba()};`}
                style:background-color={schema.hilited_candidate_back_color.rgba()}
                class="absolute right-0.5 bottom-6 p-0.5 rounded-md border text-xs"
            >
                {schema.schemaName}
            </span>
            <span
                style:color={schema.hilited_candidate_text_color.rgba()}
                style:background-color={schema.hilited_candidate_back_color.rgba()}
                class="absolute right-0.5 bottom-0.5 p-0.5 rounded-md border text-xs"
            >
                {schema.name}
            </span>
            {#if index === indexSchema}
                <IconButton
                    icon="mdi:close"
                    color="red"
                    on:click={delSchema}
                    class="absolute top-0 left-0 p-1 active:scale-90 rounded-full variant-filled hover:variant-ghost"
                />
                <IconButton
                    icon="mdi:content-copy"
                    on:click={copySchema}
                    class="absolute top-0 right-6 p-1 active:scale-90 rounded-full variant-filled hover:variant-ghost"
                />
                <IconButton
                    icon="mdi:content-paste"
                    on:click={pasteSchema}
                    class="absolute top-0 right-0 p-1 active:scale-90 rounded-full variant-filled hover:variant-ghost"
                />
            {/if}
        </div>
    {/each}
    <button
        on:click={addSchema}
        class="flex justify-center items-center w-32 h-24 p-2 shrink-0 btn rounded-md variant-ghost"
    >
        <Icon height="64" icon="mdi:plus" />
    </button>
</div>
