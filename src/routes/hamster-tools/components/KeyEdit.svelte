<script lang="ts">
    import Icon from "@iconify/svelte";
    import { Action, ActionType, Callout, Key } from "../model/keyboardLayout.svelte.ts";
    import ActionEdit from "./Action.svelte";
    import IconRange from "$lib/components/IconRange.svelte";
    import IconButton from "$lib/components/IconButton.svelte";
    import Details from "$lib/components/Details.svelte";

    interface Props {
        landscape?: boolean;
        /** 綁定的按鍵對象 */
        key: Key;
        clipAction: Action;
        keyStyleNames: string[];
        onselectnext?: () => void;
        ondelkey?: () => void;
        onmoveleft?: () => void;
        onmoveright?: () => void;
        oncopykey?: () => void;
        onpastekey?: () => void;
    }
    let {
        landscape = false,
        key = $bindable(),
        clipAction = $bindable(),
        keyStyleNames,
        onselectnext,
        ondelkey,
        onmoveleft,
        onmoveright,
        oncopykey,
        onpastekey,
    }: Props = $props();

    const icons: [string, string, string, string] = [
        "mdi:gesture-swipe-left",
        "mdi:gesture-swipe-down",
        "mdi:gesture-swipe-up",
        "mdi:gesture-swipe-right",
    ];

    // 當樣式不存在時, 將按鍵樣式恢復爲空
    $effect(() => {
        let [lightStyleExists, darkStyleExists] = [false, false];
        for (let keyStyleName of keyStyleNames) {
            if ((!key.lightStyle || lightStyleExists) && (!key.darkStyle || darkStyleExists)) {
                break;
            }
            if (key.lightStyle === keyStyleName) {
                lightStyleExists = true;
            }
            if (key.darkStyle === keyStyleName) {
                darkStyleExists = true;
            }
        }
        if (!lightStyleExists) {
            key.lightStyle = "";
        }
        if (!darkStyleExists) {
            key.darkStyle = "";
        }
    });

    function activateSwipe(index: number): void {
        key.swipe[index].action.type = ActionType.character;
    }

    /** 選擇下一個按鍵 */
    function selectNextKey(): void {
        onselectnext?.();
    }
    /** 發送删除按鍵事件 */
    function delKey(): void {
        ondelkey?.();
    }
    /** 發送左移事件 */
    function moveLeft(): void {
        onmoveleft?.();
    }
    /** 發送右移事件 */
    function moveRight(): void {
        onmoveright?.();
    }
    /** 發送複製事件 */
    function copyKey(): void {
        oncopykey?.();
    }
    /** 發送粘貼事件 */
    function pasteKey(): void {
        onpastekey?.();
    }

    function onCalloutCountChange(event: Event) {
        const count = Number((event.currentTarget as HTMLInputElement).value);
        if (count < key.callout.length) {
            key.callout = key.callout.slice(0, count);
        } else if (count > key.callout.length) {
            key.callout = [
                ...key.callout,
                ...Array(count - key.callout.length)
                    .fill(0)
                    .map(() => new Callout()),
            ];
        }
    }
    /** 上移長按動作 */
    function moveCalloutUp(index: number): void {
        if (index > 0) {
            [key.callout[index], key.callout[index - 1]] = [key.callout[index - 1], key.callout[index]];
        }
    }
    /** 下移長按動作 */
    function moveCalloutDown(index: number): void {
        if (index + 1 < key.callout.length) {
            [key.callout[index], key.callout[index + 1]] = [key.callout[index + 1], key.callout[index]];
        }
    }
</script>

<!-- 劃動配置 -->
<div class="flex flex-col gap-2 p-2">
    <!-- 鍵寛和鍵值編輯區 -->
    <div class="preset-outlined flex flex-col items-center rounded-md p-[0.5px]">
        <div class="flex w-full items-center">
            <div class="preset-outlined flex h-10 items-center rounded-tl-md px-2">
                <Icon height="20" icon="mdi:gesture-touch" />
            </div>
            <input
                title="調整按鍵顯示標籤"
                bind:value={key.label.text}
                placeholder="標籤"
                style:font-family="sans-serif, Symbols Nerd Font"
                class="preset-outlined hover:preset-tonal h-10 grow rounded-none px-2"
            />
            <button
                title="是否經由 Rime 處理"
                onclick={() => (key.processByRIME = !key.processByRIME)}
                class="preset-outlined hover:preset-tonal h-10 rounded-tr-md px-2 active:scale-95"
            >
                <Icon height="20" icon={key.processByRIME ? "mdi:web" : "mdi:web-off"} />
            </button>
        </div>
        {#if key.action.type === ActionType.space}
            <div class="flex w-full items-center">
                <input
                    title="調整空格鍵的加載時標籤"
                    bind:value={key.label.loading}
                    placeholder="加載標籤"
                    style:font-family="sans-serif, Symbols Nerd Font"
                    class="preset-outlined hover:preset-tonal h-10 grow rounded-none px-2"
                />
            </div>
        {/if}
        <div class="flex w-full items-center">
            <input
                title="使用 SF Symbol 作爲標籤 (覆蓋文本標籤)"
                bind:value={key.label.sysImage}
                placeholder="SF Symbol"
                class="preset-outlined hover:preset-tonal h-10 grow rounded-none px-2 font-mono"
            />
        </div>
        <ActionEdit bind:action={key.action} bind:clipAction />
    </div>

    <Details summary="劃動動作配置">
        {#snippet snip_default()}
            <div class="flex flex-col gap-2 p-1.5">
                {#each [2, 1, 0, 3] as index (key.swipe[index].id)}
                    <div class="preset-outlined flex flex-col items-center rounded-md p-[0.5px]">
                        {#if key.swipe[index].action.type === ActionType.none}
                            <div class="flex w-full">
                                <div class="preset-outlined flex h-10 items-center rounded-l-md px-2">
                                    <Icon height="20" icon={icons[index]} />
                                </div>
                                <button
                                    title="添加劃動配置"
                                    onclick={() => {
                                        activateSwipe(index);
                                    }}
                                    class="preset-outlined hover:preset-tonal flex h-10 grow items-center justify-center rounded-r-md px-2"
                                >
                                    <Icon height="20" icon="mdi:plus" />
                                </button>
                            </div>
                        {:else}
                            <div class="flex w-full">
                                <div class="preset-outlined flex h-10 items-center rounded-tl-md px-2">
                                    <Icon height="20" icon={icons[index]} />
                                </div>
                                <input
                                    title="調整劃動顯示標籤"
                                    bind:value={key.swipe[index].label.text}
                                    placeholder="標籤"
                                    style:font-family="sans-serif, Symbols Nerd Font"
                                    class="preset-outlined hover:preset-tonal h-10 grow rounded-none px-2"
                                />
                                <!-- 經由 rime 處理 -->
                                <button
                                    title="劃動是否經由 Rime 處理"
                                    onclick={() => (key.swipe[index].processByRIME = !key.swipe[index].processByRIME)}
                                    class="preset-outlined hover:preset-tonal h-10 px-2"
                                >
                                    <Icon
                                        height="20"
                                        icon={key.swipe[index].processByRIME ? "mdi:web" : "mdi:web-off"}
                                    />
                                </button>
                                <!-- 顯示劃動 -->
                                <button
                                    title="是否顯示此劃動"
                                    onclick={() => (key.swipe[index].display = !key.swipe[index].display)}
                                    class="preset-outlined hover:preset-tonal h-10 rounded-tr-md px-2"
                                >
                                    <Icon height="20" icon={key.swipe[index].display ? "mdi:eye" : "mdi:eye-off"} />
                                </button>
                            </div>
                            <ActionEdit bind:action={key.swipe[index].action} bind:clipAction />
                        {/if}
                    </div>
                {/each}
            </div>
        {/snippet}
    </Details>

    <!-- 長按動作 -->
    <Details summary="長按動作配置">
        {#snippet snip_default()}
            <div class="flex flex-col gap-2 p-1.5">
                <IconRange
                    icon="mdi:table-cog"
                    title="長按動作數量"
                    value={key.callout.length}
                    onchange={onCalloutCountChange}
                    min="0"
                    max="12"
                    class="preset-outlined hover:preset-tonal flex h-10 items-center rounded-md px-2"
                />
                {#each key.callout as callout, index (callout.id)}
                    <div class="preset-outlined flex flex-col items-center rounded-md p-[0.5px]">
                        <div class="flex w-full items-center">
                            <div class="preset-outlined flex h-10 items-center rounded-tl-md px-2">
                                <Icon height="20" icon="mdi:message-outline" />
                            </div>
                            <input
                                title="調整長按動作標籤"
                                bind:value={callout.label.text}
                                placeholder="標籤"
                                style:font-family="sans-serif, Symbols Nerd Font"
                                class="preset-outlined hover:preset-tonal h-10 grow rounded-none px-2"
                            />
                            <IconButton
                                icon="mdi:arrow-up"
                                height="20"
                                title="上移長按動作"
                                onclick={() => {
                                    moveCalloutUp(index);
                                }}
                                class="preset-outlined hover:preset-tonal h-10 px-2 active:scale-95"
                            />
                            <IconButton
                                icon="mdi:arrow-down"
                                height="20"
                                title="下移長按動作"
                                onclick={() => {
                                    moveCalloutDown(index);
                                }}
                                class="preset-outlined hover:preset-tonal h-10 rounded-tr-md px-2 active:scale-95"
                            />
                        </div>
                        <ActionEdit bind:action={callout.action} bind:clipAction />
                    </div>
                {/each}
            </div>
        {/snippet}
    </Details>

    <!-- 按鍵樣式設置 -->
    <div class="preset-outlined w-full rounded-md p-[0.5px]">
        <div class="flex w-full">
            <div class="preset-outlined flex h-10 items-center rounded-tl-md px-2">
                <Icon icon="mdi:weather-sunny" />
            </div>
            <span class="preset-outlined flex h-10 shrink grow items-center px-2"> 亮色樣式 </span>
            <select
                bind:value={key.lightStyle}
                class="preset-outlined hover:preset-tonal h-10 w-[50%] rounded-tr-md bg-transparent px-2"
            >
                <option value="">none</option>
                {#each keyStyleNames as name}
                    <option value={name}>{name}</option>
                {/each}
            </select>
        </div>
        <div class="flex w-full">
            <div class="preset-outlined flex h-10 items-center rounded-bl-md px-2">
                <Icon icon="mdi:weather-night" />
            </div>
            <span class="preset-outlined flex h-10 shrink grow items-center px-2"> 暗色樣式 </span>
            <select
                bind:value={key.darkStyle}
                class="preset-outlined hover:preset-tonal h-10 w-[50%] rounded-br-md bg-transparent px-2"
            >
                <option value="">none</option>
                {#each keyStyleNames as name}
                    <option value={name}>{name}</option>
                {/each}
            </select>
        </div>
    </div>

    <!-- 按鍵動作按鈕 -->
    <div class="preset-outlined mx-auto flex w-full overflow-auto rounded-md p-[0.5px]">
        <button
            title="在鍵盤中删除此按鍵"
            onclick={delKey}
            class="preset-outlined hover:preset-tonal flex items-center gap-1 rounded-l-md p-2 active:scale-95"
        >
            <Icon height="20" icon="mdi:close" />
        </button>
        <button
            title="將此按鍵左移一位"
            onclick={moveLeft}
            class="preset-outlined hover:preset-tonal flex items-center gap-1 p-2 active:scale-95"
        >
            <Icon height="20" icon="mdi:arrow-left" />
        </button>
        <button
            title="自動鍵寛"
            onclick={() => {
                if (landscape) {
                    key.autoLandscape = !key.autoLandscape;
                } else {
                    key.autoWidth = !key.autoWidth;
                }
            }}
            class="preset-outlined hover:preset-tonal flex items-center gap-1 p-2 active:scale-95"
        >
            <Icon
                height="20"
                icon={(landscape ? key.autoLandscape : key.autoWidth) ? "mdi:table-sync" : "mdi:table-remove"}
            />
        </button>
        {#if landscape}
            <input
                title="調整按鍵寛度"
                type="number"
                bind:value={key.landscape}
                placeholder="鍵寛"
                min={1}
                max={100}
                class="preset-outlined hover:preset-tonal min-w-0 shrink grow rounded-none p-2"
            />
        {:else}
            <input
                title="調整按鍵寛度"
                type="number"
                bind:value={key.width}
                placeholder="鍵寛"
                min={1}
                max={100}
                class="preset-outlined hover:preset-tonal min-w-0 shrink grow rounded-none p-2"
            />
        {/if}
        <button
            title="複製按鍵配置"
            onclick={copyKey}
            class="preset-outlined hover:preset-tonal flex items-center gap-1 p-2 active:scale-95"
        >
            <Icon height="20" icon="mdi:content-copy" />
        </button>
        <button
            title="粘貼按鍵配置"
            onclick={pasteKey}
            class="preset-outlined hover:preset-tonal flex items-center gap-1 p-2 active:scale-95"
        >
            <Icon height="20" icon="mdi:content-paste" />
        </button>
        <button
            title="將此按鍵右移一位"
            onclick={moveRight}
            class="preset-outlined hover:preset-tonal flex items-center gap-1 p-2 active:scale-95"
        >
            <Icon height="20" icon="mdi:arrow-right" />
        </button>
        <button
            title="繼續編輯下一個按鍵"
            onclick={selectNextKey}
            class="preset-outlined hover:preset-tonal flex items-center gap-1 rounded-r-md p-2 active:scale-95"
        >
            <Icon height="20" icon="mdi:check-circle-outline" />
        </button>
    </div>
</div>
