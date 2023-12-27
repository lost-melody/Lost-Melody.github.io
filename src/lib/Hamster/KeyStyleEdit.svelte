<script lang="ts">
    import Icon from "@iconify/svelte";
    import { flip } from "svelte/animate";
    import { KeyStyle } from "./model/colorSchema";
    import ColorSelector from "./ColorSelector.svelte";
    import KeyStylePreview from "./KeyStylePreview.svelte";

    export var keyStyles: KeyStyle[] = [];
</script>

<div class="w-full p-1 gap-1 flex flex-col rounded-md variant-soft">
    {#each keyStyles as keyStyle, index (keyStyle.id)}
        <details animate:flip={{ duration: 250 }} class="px-2 w-full rounded-md hover:variant-ghost">
            <summary class="px-2 gap-1 flex items-center">
                <span class="p-1 font-mono rounded variant-soft">{keyStyle.name}</span>
                <span class="grow" />
                <KeyStylePreview {keyStyle} />
                <KeyStylePreview pressed {keyStyle} />
                <button
                    class="rounded-full hover:variant-ghost active:scale-95"
                    on:click={() => {
                        keyStyles.splice(index, 1);
                        keyStyles = keyStyles;
                    }}
                >
                    <Icon icon="mdi:close" class="w-8 h-8" />
                </button>
            </summary>

            <div class="p-1 gap-1 flex flex-col">
                <div class="w-full gap-2 flex items-center">
                    <Icon icon="mdi:rename-box" class="px-1 w-10 h-8" />
                    <span class="grow shrink"> 樣式唯一標識名 </span>
                    <input
                        title="樣式標識名"
                        type="text"
                        bind:value={keyStyle.name}
                        placeholder="僅大小寫字母, 需確保唯一性"
                        class="w-[40%] px-2 bg-transparent rounded-md hover:variant-ghost"
                    />
                </div>
                <ColorSelector title="背景" bind:color={keyStyle.buttonBackgroundColor} />
                <ColorSelector title="按下背景" bind:color={keyStyle.pressedButtonBackgroundColor} />
                <ColorSelector title="前景" bind:color={keyStyle.buttonForegroundColor} />
                <ColorSelector title="按下前景" bind:color={keyStyle.pressedButtonForegroundColor} />
                <ColorSelector title="劃動前景" bind:color={keyStyle.swipeForegroundColor} />
                <ColorSelector title="按下劃動前景" bind:color={keyStyle.pressedSwipeForegroundColor} />
                <div class="w-full gap-2 flex items-center">
                    <Icon icon="mdi:rounded-corner" class="px-1 w-10 h-8" />
                    <span class="grow shrink"> 按鍵圓角 </span>
                    <input type="range" min="0" max="32" bind:value={keyStyle.cornerRadius} class="w-[30%]" />
                    <span class="w-6 code"> {keyStyle.cornerRadius} </span>
                </div>
                <div class="w-full gap-2 flex items-center">
                    <Icon icon="mdi:border-all-variant" class="px-1 w-10 h-8" />
                    <span class="grow shrink"> 邊框寛度 </span>
                    <input type="range" min="0" max="8" bind:value={keyStyle.borderSize} class="w-[30%]" />
                    <span class="w-6 code"> {keyStyle.borderSize} </span>
                </div>
                <ColorSelector title="邊框" bind:color={keyStyle.borderColor} />
                <ColorSelector title="陰影" bind:color={keyStyle.lowerEdgeColor} />
                <div class="w-full gap-2 flex items-center">
                    <Icon icon="mdi:format-size" class="px-1 w-10 h-8" />
                    <span class="grow shrink"> 鍵面字體大小 </span>
                    <input type="range" min="0" max="32" bind:value={keyStyle.fontSize} class="w-[30%]" />
                    <span class="w-6 code"> {keyStyle.fontSize} </span>
                </div>
                <div class="w-full gap-2 flex items-center">
                    <Icon icon="mdi:format-size" class="px-1 w-10 h-8" />
                    <span class="grow shrink"> 劃動字體大小 </span>
                    <input type="range" min="0" max="32" bind:value={keyStyle.swipeFontSize} class="w-[30%]" />
                    <span class="w-6 code"> {keyStyle.swipeFontSize} </span>
                </div>
            </div>
        </details>
    {/each}
    <button
        class="p-2 flex justify-center rounded hover:variant-ghost active:scale-95"
        on:click={() => {
            keyStyles.push(new KeyStyle());
            keyStyles = keyStyles;
        }}
    >
        <Icon icon="mdi:plus" height="24" />
    </button>
</div>
