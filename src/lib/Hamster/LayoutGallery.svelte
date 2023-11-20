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
        <div animate:flip transition:scale class="relative">
            <button
                on:click={() => selectLayout(index)}
                style:background-color={currentSchema.back_color.rgba()}
                style:border-color={currentSchema.border_color.rgba()}
                class:border-2={index === indexLayout}
                class:border-dashed={index === indexLayout}
                class="w-32 h-24 p-2 shrink-0 flex flex-col rounded-md border active:scale-95"
            >
                <Thumbnail {layout} schema={currentSchema} />
            </button>
            <span
                style:color={currentSchema.hilited_candidate_text_color.rgba()}
                style:background-color={currentSchema.hilited_candidate_back_color.rgba()}
                class="absolute right-0.5 bottom-0.5 p-0.5 rounded-md border text-sm"
            >
                {layout.name}
            </span>
            {#if index === indexLayout}
                <IconButton
                    icon="mdi:close"
                    color="red"
                    on:click={delLayout}
                    class="absolute top-0 left-0 p-1 active:scale-[90%] rounded-full variant-filled hover:variant-ghost"
                />
                <IconButton
                    icon="mdi:content-copy"
                    on:click={copyLayout}
                    class="absolute top-0 right-6 p-1 active:scale-[90%] rounded-full variant-filled hover:variant-ghost"
                />
                <IconButton
                    icon="mdi:content-paste"
                    on:click={pasteLayout}
                    class="absolute top-0 right-0 p-1 active:scale-[90%] rounded-full variant-filled hover:variant-ghost"
                />
            {/if}
        </div>
    {/each}
    <button
        on:click={addLayout}
        class="flex justify-center items-center w-32 h-24 p-2 shrink-0 btn rounded-md variant-ghost"
    >
        <Icon height="64" icon="mdi:plus" />
    </button>
</div>
