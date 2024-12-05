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
        <div animate:flip={{ duration: 250 }} transition:scale={{ duration: 250 }} class="relative">
            <button
                on:click={() => selectSchema(index)}
                style:background-color={schema.back_color.rgba()}
                style:border-color={schema.border_color.rgba()}
                class:border-2={index === indexSchema}
                class:border-dashed={index === indexSchema}
                class="flex h-20 w-32 shrink-0 flex-col rounded-md border p-2 active:scale-95"
            >
                <Thumbnail layout={currentLayout} {schema} />
            </button>
            <span
                style={`color: ${schema.hilited_candidate_text_color.rgba()};`}
                style:background-color={schema.hilited_candidate_back_color.rgba()}
                class="absolute bottom-6 right-0.5 rounded-md border p-0.5 text-xs"
            >
                {schema.schemaName}
            </span>
            <span
                style:color={schema.hilited_candidate_text_color.rgba()}
                style:background-color={schema.hilited_candidate_back_color.rgba()}
                class="absolute bottom-0.5 right-0.5 rounded-md border p-0.5 text-xs"
            >
                {schema.name}
            </span>
            {#if index === indexSchema}
                <IconButton
                    icon="mdi:close"
                    color="red"
                    on:click={delSchema}
                    class="variant-filled absolute left-0 top-0 rounded-full p-1 hover:variant-ghost active:scale-90"
                />
                <IconButton
                    icon="mdi:content-copy"
                    on:click={copySchema}
                    class="variant-filled absolute right-6 top-0 rounded-full p-1 hover:variant-ghost active:scale-90"
                />
                <IconButton
                    icon="mdi:content-paste"
                    on:click={pasteSchema}
                    class="variant-filled absolute right-0 top-0 rounded-full p-1 hover:variant-ghost active:scale-90"
                />
            {/if}
        </div>
    {/each}
    <button
        on:click={addSchema}
        class="variant-ghost btn flex h-20 w-32 shrink-0 items-center justify-center rounded-md p-2"
    >
        <Icon height="64" icon="mdi:plus" />
    </button>
</div>
