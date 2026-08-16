<script lang="ts">
    import { scale } from "svelte/transition";
    import { flip } from "svelte/animate";
    import Icon from "@iconify/svelte";
    import IconButton from "$lib/components/IconButton.svelte";

    import type { Keyboard } from "../model/keyboardLayout.svelte.ts";
    import { ColorSchema } from "../model/colorSchema.svelte.ts";
    import Thumbnail from "./Thumbnail.svelte";

    interface Props {
        colorSchemas: ColorSchema[];
        indexSchema: number;
        currentSchema: ColorSchema;
        currentLayout: Keyboard;
    }
    let { colorSchemas = $bindable(), indexSchema = $bindable(), currentSchema, currentLayout }: Props = $props();

    let clipSchema = $state(new ColorSchema());
    const copySchema = () => {
        clipSchema = currentSchema.clone();
    };
    const pasteSchema = () => {
        colorSchemas[indexSchema] = clipSchema.clone();
        colorSchemas = colorSchemas;
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
                onclick={() => selectSchema(index)}
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
                class="absolute right-0.5 bottom-6 rounded-md border p-0.5 text-xs"
            >
                {schema.schemaName}
            </span>
            <span
                style:color={schema.hilited_candidate_text_color.rgba()}
                style:background-color={schema.hilited_candidate_back_color.rgba()}
                class="absolute right-0.5 bottom-0.5 rounded-md border p-0.5 text-xs"
            >
                {schema.name}
            </span>
            {#if index === indexSchema}
                <IconButton
                    icon="mdi:close"
                    color="red"
                    onclick={delSchema}
                    class="preset-filled hover:preset-tonal absolute top-0 left-0 rounded-full p-1 active:scale-90"
                />
                <IconButton
                    icon="mdi:content-copy"
                    onclick={copySchema}
                    class="preset-filled hover:preset-tonal absolute top-0 right-6 rounded-full p-1 active:scale-90"
                />
                <IconButton
                    icon="mdi:content-paste"
                    onclick={pasteSchema}
                    class="preset-filled hover:preset-tonal absolute top-0 right-0 rounded-full p-1 active:scale-90"
                />
            {/if}
        </div>
    {/each}
    <button
        onclick={addSchema}
        class="preset-tonal btn flex h-20 w-32 shrink-0 items-center justify-center rounded-md p-2"
    >
        <Icon height="64" icon="mdi:plus" />
    </button>
</div>
