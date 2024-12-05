<script lang="ts">
    import { scale } from "svelte/transition";
    import { flip } from "svelte/animate";
    import Icon from "@iconify/svelte";
    import IconButton from "$lib/Component/IconButton.svelte";

    import type { ColorSchema } from "./model/colorSchema";
    import { Keyboard } from "./model/keyboardLayout";
    import Thumbnail from "./Thumbnail.svelte";

    export var currentSchema: ColorSchema;
    export var keyboardLayouts: Keyboard[];
    export var indexLayout: number;
    export var currentLayout: Keyboard;

    var clipLayout = new Keyboard();
    const copyLayout = () => {
        clipLayout = currentLayout.clone();
    };
    const pasteLayout = () => {
        keyboardLayouts[indexLayout] = clipLayout.clone();
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
                on:click={() => selectLayout(index)}
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
                class="absolute bottom-0.5 right-0.5 rounded-md border p-0.5 text-xs"
            >
                {layout.name}
            </span>
            {#if index === indexLayout}
                <IconButton
                    icon="mdi:close"
                    color="red"
                    on:click={delLayout}
                    class="variant-filled absolute left-0 top-0 rounded-full p-1 hover:variant-ghost active:scale-[90%]"
                />
                <IconButton
                    icon="mdi:content-copy"
                    on:click={copyLayout}
                    class="variant-filled absolute right-6 top-0 rounded-full p-1 hover:variant-ghost active:scale-[90%]"
                />
                <IconButton
                    icon="mdi:content-paste"
                    on:click={pasteLayout}
                    class="variant-filled absolute right-0 top-0 rounded-full p-1 hover:variant-ghost active:scale-[90%]"
                />
            {/if}
        </div>
    {/each}
    <button
        on:click={addLayout}
        class="variant-ghost btn flex h-20 w-32 shrink-0 items-center justify-center rounded-md p-2"
    >
        <Icon height="64" icon="mdi:plus" />
    </button>
</div>
