<script lang="ts">
    import { scale } from "svelte/transition";
    import { flip } from "svelte/animate";
    import Icon from "@iconify/svelte";
    import IconButton from "$lib/components/IconButton.svelte";

    import type { ColorSchema } from "../model/colorSchema.svelte.ts";
    import { Keyboard } from "../model/keyboardLayout.svelte.ts";
    import Thumbnail from "./Thumbnail.svelte";

    interface Props {
        currentSchema: ColorSchema;
        keyboardLayouts: Keyboard[];
        indexLayout: number;
        currentLayout: Keyboard;
    }
    let { currentSchema, keyboardLayouts = $bindable(), indexLayout = $bindable(), currentLayout }: Props = $props();

    let clipLayout = $state(new Keyboard());
    const copyLayout = () => {
        clipLayout = currentLayout.clone();
    };
    const pasteLayout = () => {
        keyboardLayouts[indexLayout] = clipLayout.clone();
        keyboardLayouts = keyboardLayouts;
    };
    const selectLayout = (index: number) => {
        indexLayout = index;
    };
    const addLayout = () => {
        keyboardLayouts.push(currentLayout.clone());
        keyboardLayouts = keyboardLayouts;
        indexLayout = keyboardLayouts.length - 1;
    };
    const delLayout = () => {
        keyboardLayouts.splice(indexLayout, 1);
        if (keyboardLayouts.length === 0) {
            keyboardLayouts.push(new Keyboard());
        }
        keyboardLayouts = keyboardLayouts;
        if (indexLayout >= keyboardLayouts.length) {
            indexLayout = keyboardLayouts.length - 1;
        }
    };
</script>

<div class="flex gap-2 px-8">
    {#each keyboardLayouts as layout, index (layout.id)}
        <div animate:flip={{ duration: 250 }} transition:scale={{ duration: 250 }} class="relative">
            <button
                onclick={() => selectLayout(index)}
                style:background-color={currentSchema.back_color.rgba()}
                style:border-color={currentSchema.border_color.rgba()}
                class:border-2={index === indexLayout}
                class:border-dashed={index === indexLayout}
                class="flex h-20 w-32 shrink-0 flex-col rounded-md border p-2 active:scale-95"
            >
                <Thumbnail {layout} schema={currentSchema} />
            </button>
            <span
                style:color={currentSchema.hilited_candidate_text_color.rgba()}
                style:background-color={currentSchema.hilited_candidate_back_color.rgba()}
                class="absolute right-0.5 bottom-0.5 rounded-md border p-0.5 text-xs"
            >
                {layout.name}
            </span>
            {#if index === indexLayout}
                <IconButton
                    icon="mdi:close"
                    color="red"
                    onclick={delLayout}
                    class="preset-filled hover:preset-tonal absolute top-0 left-0 rounded-full p-1 active:scale-[90%]"
                />
                <IconButton
                    icon="mdi:content-copy"
                    onclick={copyLayout}
                    class="preset-filled hover:preset-tonal absolute top-0 right-6 rounded-full p-1 active:scale-[90%]"
                />
                <IconButton
                    icon="mdi:content-paste"
                    onclick={pasteLayout}
                    class="preset-filled hover:preset-tonal absolute top-0 right-0 rounded-full p-1 active:scale-[90%]"
                />
            {/if}
        </div>
    {/each}
    <button
        onclick={addLayout}
        class="preset-tonal btn flex h-20 w-32 shrink-0 items-center justify-center rounded-md p-2"
    >
        <Icon height="64" icon="mdi:plus" />
    </button>
</div>
