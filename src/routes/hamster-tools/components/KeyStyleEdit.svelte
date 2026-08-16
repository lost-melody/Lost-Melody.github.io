<script lang="ts">
    import { setContext } from "svelte";
    import Icon from "@iconify/svelte";
    import { flip } from "svelte/animate";
    import { ColorSchema, KeyStyle } from "../model/colorSchema.svelte.ts";
    import ColorSelector from "./ColorSelector.svelte";
    import IconButton from "$lib/components/IconButton.svelte";
    import Details from "$lib/components/Details.svelte";
    import KeyStylePreview from "./KeyStylePreview.svelte";
    import { persisted } from "$lib/utils/persisted";

    interface Props {
        colorSchema: ColorSchema;
        keyStyles?: KeyStyle[];
    }
    let { colorSchema, keyStyles = $bindable([]) }: Props = $props();

    const preferAbgr = setContext("prefer-abgr", persisted("prefer-abgr", false));

    const sortKeyStyles = () => {
        keyStyles.sort((a, b) => (a.name < b.name ? -1 : a.name === b.name ? 0 : 1));
    };

    let keyStyle = $state<KeyStyle>(new KeyStyle());
    const copyKeyStyle = (index: number) => {
        keyStyle = keyStyles[index].clone();
    };
    const pasteKeyStyle = (index: number) => {
        keyStyles[index] = keyStyle.clone();
    };
</script>

<div class="preset-tonal flex w-full flex-col gap-1 rounded-md p-2">
    <div class="flex w-full items-center gap-2">
        <Icon icon={$preferAbgr ? "mdi:checkbox-marked" : "mdi:checkbox-blank-off"} class="h-10 w-10 p-2" />
        <button
            class="shrink grow"
            onclick={() => {
                $preferAbgr = !$preferAbgr;
            }}
        >
            使用 ABGR 顔色格式
        </button>
        <span class="code w-6"> {$preferAbgr ? "是" : "否"} </span>
    </div>
    {#each keyStyles as keyStyle, index (keyStyle.id)}
        <div animate:flip={{ duration: 250 }}>
            <Details>
                {#snippet snip_summary()}
                    <div class="flex grow items-center">
                        <span class="preset-tonal rounded px-2 font-mono">{keyStyle.name}</span>
                        <span class="border-surface-500 h-[48px] grow border-r"></span>
                        <KeyStylePreview {keyStyle} {colorSchema} />
                        <KeyStylePreview pressed {keyStyle} {colorSchema} />
                        <IconButton
                            title="複製"
                            icon={"mdi:content-copy"}
                            onclick={() => copyKeyStyle(index)}
                            class="preset-outlined hover:preset-tonal flex h-[48px] items-center px-2 active:scale-95"
                        />
                        <IconButton
                            title="粘貼"
                            icon={"mdi:content-paste"}
                            onclick={() => pasteKeyStyle(index)}
                            class="preset-outlined hover:preset-tonal flex h-[48px] items-center px-2 active:scale-95"
                        />
                        <IconButton
                            title="删除"
                            icon="mdi:close"
                            onclick={() => {
                                keyStyles.splice(index, 1);
                                keyStyles = keyStyles;
                            }}
                            class="preset-outlined hover:preset-tonal flex h-[48px] items-center px-2 active:scale-95"
                        />
                    </div>
                {/snippet}

                {#snippet snip_default()}
                    <div class="flex flex-col gap-1 p-1">
                        <div class="preset-outlined flex h-10 w-full items-center gap-2 rounded-md">
                            <Icon icon="mdi:rename-box" class="h-8 w-10 px-1" />
                            <span class="shrink grow"> 樣式唯一標識名 </span>
                            <input
                                title={"樣式標識名, 不可重複.\n" +
                                    "建議使用蛇形或駝峰命名: keyname_style_variant; keynameStyleVariant.\n" +
                                    "如: space_light_alphabet26, returnDarkNumeric."}
                                type="text"
                                bind:value={keyStyle.name}
                                onchange={() => {
                                    sortKeyStyles();
                                    keyStyles = keyStyles;
                                }}
                                placeholder="space_light_eng"
                                class="preset-outlined hover:preset-tonal h-10 w-[40%] rounded-none rounded-r-md p-1 font-mono"
                            />
                        </div>
                        <ColorSelector title="背景" allowEmpty bind:color={keyStyle.buttonBackgroundColor} />
                        <ColorSelector title="按下背景" allowEmpty bind:color={keyStyle.pressedButtonBackgroundColor} />
                        <ColorSelector title="前景" allowEmpty bind:color={keyStyle.buttonForegroundColor} />
                        <ColorSelector title="按下前景" allowEmpty bind:color={keyStyle.pressedButtonForegroundColor} />
                        <ColorSelector title="劃動前景" allowEmpty bind:color={keyStyle.swipeForegroundColor} />
                        <ColorSelector
                            title="按下劃動前景"
                            allowEmpty
                            bind:color={keyStyle.pressedSwipeForegroundColor}
                        />
                        <ColorSelector
                            title="按下氣泡背景"
                            allowEmpty
                            bind:color={keyStyle.buttonBubbleBackgroundColor}
                        />
                        <ColorSelector
                            title="長按氣泡背景"
                            allowEmpty
                            bind:color={keyStyle.actionCalloutBackgroundColor}
                        />
                        <ColorSelector
                            title="長按首選背景"
                            allowEmpty
                            bind:color={keyStyle.actionCalloutSelectedBackgroundColor}
                        />
                        <ColorSelector
                            title="長按首選文字"
                            allowEmpty
                            bind:color={keyStyle.actionCalloutSelectedForegroundColor}
                        />
                        <div class="flex w-full items-center gap-2">
                            <Icon icon="mdi:rounded-corner" class="h-8 w-10 px-1" />
                            <span class="shrink grow"> 按鍵圓角 </span>
                            <input type="range" min="-1" max="32" bind:value={keyStyle.cornerRadius} class="w-[30%]" />
                            <span class="code w-6"> {keyStyle.cornerRadius} </span>
                        </div>
                        <div class="flex w-full items-center gap-2">
                            <Icon icon="mdi:border-all-variant" class="h-8 w-10 px-1" />
                            <span class="shrink grow"> 邊框寛度 </span>
                            <input type="range" min="-1" max="8" bind:value={keyStyle.borderSize} class="w-[30%]" />
                            <span class="code w-6"> {keyStyle.borderSize} </span>
                        </div>
                        <ColorSelector title="邊框" allowEmpty bind:color={keyStyle.borderColor} />
                        <ColorSelector title="下邊框" allowEmpty bind:color={keyStyle.lowerEdgeColor} />
                        <ColorSelector title="陰影" allowEmpty bind:color={keyStyle.shadowColor} />
                        <div class="flex w-full items-center gap-2">
                            <Icon icon="mdi:format-size" class="h-8 w-10 px-1" />
                            <span class="shrink grow"> 陰影大小 </span>
                            <input type="range" min="-1" max="8" bind:value={keyStyle.shadowSize} class="w-[30%]" />
                            <span class="code w-6"> {keyStyle.shadowSize} </span>
                        </div>
                        <div class="flex w-full items-center gap-2">
                            <Icon icon="mdi:format-size" class="h-8 w-10 px-1" />
                            <span class="shrink grow"> 鍵面字體大小 </span>
                            <input type="range" min="0" max="32" bind:value={keyStyle.fontSize} class="w-[30%]" />
                            <span class="code w-6"> {keyStyle.fontSize} </span>
                        </div>
                        <div class="flex w-full items-center gap-2">
                            <Icon icon="mdi:format-size" class="h-8 w-10 px-1" />
                            <span class="shrink grow"> 劃動字體大小 </span>
                            <input type="range" min="0" max="24" bind:value={keyStyle.swipeFontSize} class="w-[30%]" />
                            <span class="code w-6"> {keyStyle.swipeFontSize} </span>
                        </div>
                    </div>
                {/snippet}
            </Details>
        </div>
    {/each}
    <button
        class="hover:preset-tonal flex justify-center rounded p-2 active:scale-95"
        onclick={() => {
            keyStyles.push(new KeyStyle());
            sortKeyStyles();
            keyStyles = keyStyles;
        }}
    >
        <Icon icon="mdi:plus" height="24" />
    </button>
</div>
