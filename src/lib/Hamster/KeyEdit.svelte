<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";
    import { Action, ActionType, Callout, Key } from "./model/keyboardLayout";
    import ActionEdit from "./Action.svelte";
    import IconRange from "$lib/Component/IconRange.svelte";
    import IconButton from "$lib/Component/IconButton.svelte";

    export var landscape: boolean = false;
    /** 綁定的按鍵對象 */
    export var key: Key;
    export var clipAction: Action;
    export var keyStyleNames: string[];

    const icons: [string, string, string, string] = [
        "mdi:gesture-swipe-left",
        "mdi:gesture-swipe-down",
        "mdi:gesture-swipe-up",
        "mdi:gesture-swipe-right",
    ];

    function activateSwipe(index: number): void {
        key.swipe[index].action.type = ActionType.character;
    }

    var dispatch = createEventDispatcher();
    /** 發送删除按鍵事件 */
    function delKey(): void {
        dispatch("delkey");
    }
    /** 發送左移事件 */
    function moveLeft(): void {
        dispatch("moveleft");
    }
    /** 發送右移事件 */
    function moveRight(): void {
        dispatch("moveright");
    }
    /** 發送複製事件 */
    function copyKey(): void {
        dispatch("copykey");
    }
    /** 發送粘貼事件 */
    function pasteKey(): void {
        dispatch("pastekey");
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
<div class="flex flex-col gap-1">
    <!-- 鍵寛和鍵值編輯區 -->
    <div class="flex flex-col p-2 gap-1 rounded-md hover:variant-ghost items-center">
        <div class="flex w-full p-1 gap-2 items-center">
            <Icon height="20" icon="mdi:gesture-touch" />
            <input
                title="調整按鍵顯示標籤"
                bind:value={key.label}
                placeholder="標籤"
                class="p-1 grow rounded-md bg-transparent variant-ringed hover:variant-ghost"
            />
            <button
                title="是否經由 Rime 處理"
                on:click={() => (key.processByRIME = !key.processByRIME)}
                class="hover:scale-105 active:scale-95"
            >
                <Icon height="20" icon={key.processByRIME ? "mdi:web" : "mdi:web-off"} />
            </button>
        </div>
        <ActionEdit bind:action={key.action} bind:clipAction />
        {#if key.action.type === ActionType.space}
            <div class="flex w-full px-2 py-1 gap-1 items-center">
                <input
                    title="調整空格鍵的加載時標籤"
                    bind:value={key.loading}
                    placeholder="加載標籤"
                    class="p-1 grow rounded-md bg-transparent variant-ringed hover:variant-ghost"
                />
            </div>
        {/if}
    </div>

    {#each [2, 1, 0, 3] as index (key.swipe[index].id)}
        <div class="flex flex-col p-2 gap-1 rounded-md hover:variant-ghost items-center">
            {#if key.swipe[index].action.type === ActionType.none}
                <div class="flex w-full p-1 gap-1">
                    <Icon height="20" icon={icons[index]} />
                    <button
                        title="添加劃動配置"
                        on:click={() => {
                            activateSwipe(index);
                        }}
                        class="rounded-md grow px-2 py-1 flex justify-center items-center hover:variant-soft"
                    >
                        <Icon height="20" icon="mdi:plus" />
                    </button>
                </div>
            {:else}
                <div class="flex w-full p-1 gap-1">
                    <Icon height="20" icon={icons[index]} />
                    <input
                        title="調整劃動顯示標籤"
                        bind:value={key.swipe[index].label}
                        placeholder="標籤"
                        class="p-1 grow rounded-md bg-transparent variant-ringed hover:variant-ghost"
                    />
                    <!-- 經由 rime 處理 -->
                    <button
                        title="劃動是否經由 Rime 處理"
                        on:click={() => (key.swipe[index].processByRIME = !key.swipe[index].processByRIME)}
                        class="rounded-full p-1 hover:variant-soft"
                    >
                        <Icon height="20" icon={key.swipe[index].processByRIME ? "mdi:web" : "mdi:web-off"} />
                    </button>
                    <!-- 顯示劃動 -->
                    <button
                        title="是否顯示此劃動"
                        on:click={() => (key.swipe[index].display = !key.swipe[index].display)}
                        class="rounded-full p-1 hover:variant-soft"
                    >
                        <Icon height="20" icon={key.swipe[index].display ? "mdi:eye" : "mdi:eye-off"} />
                    </button>
                </div>
                <ActionEdit bind:action={key.swipe[index].action} bind:clipAction />
            {/if}
        </div>
    {/each}

    <!-- 長按動作 -->
    <details class="p-2 w-full rounded-md hover:variant-ghost">
        <summary class="p-2">長按動作配置</summary>
        <IconRange
            icon="mdi:table-cog"
            title="長按動作數量"
            value={key.callout.length}
            on:change={onCalloutCountChange}
            min="0"
            max="12"
            class="p-2 gap-1 flex items-center rounded-md hover:variant-ghost"
        />
        {#each key.callout as callout, index (callout.id)}
            <div class="flex flex-col p-2 gap-1 rounded-md hover:variant-ghost items-center">
                <div class="flex w-full px-2 py-1 gap-1 items-center">
                    <Icon height="20" icon="mdi:message-outline" />
                    <input
                        title="調整長按動作標籤"
                        bind:value={callout.label}
                        placeholder="標籤"
                        class="p-1 grow rounded-md bg-transparent variant-ringed hover:variant-ghost"
                    />
                    <IconButton
                        icon="mdi:arrow-up"
                        height="20"
                        title="整行按鍵上移"
                        on:click={() => {
                            moveCalloutUp(index);
                        }}
                        class="p-2 rounded-md variant-ringed hover:variant-ghost active:scale-95"
                    />
                    <IconButton
                        icon="mdi:arrow-down"
                        height="20"
                        title="整行按鍵下移"
                        on:click={() => {
                            moveCalloutDown(index);
                        }}
                        class="p-2 rounded-md variant-ringed hover:variant-ghost active:scale-95"
                    />
                </div>
                <ActionEdit bind:action={callout.action} bind:clipAction />
            </div>
        {/each}
    </details>

    <!-- 按鍵樣式設置 -->
    <div class="p-2 w-full rounded-md hover:variant-ghost">
        <div class="w-full p-2 gap-2 flex items-center rounded-md hover:variant-ghost">
            <Icon icon="mdi:weather-sunny" />
            <span class="grow shrink"> 亮色樣式 </span>
            <select
                bind:value={key.lightStyle}
                class="w-[50%] p-1 bg-transparent rounded-md variant-ringed hover:variant-ghost"
            >
                <option value="">None</option>
                {#each keyStyleNames as name}
                    <option value={name}>{name}</option>
                {/each}
            </select>
        </div>
        <div class="w-full p-2 gap-2 flex items-center rounded-md hover:variant-ghost">
            <Icon icon="mdi:weather-night" />
            <span class="grow shrink"> 暗色樣式 </span>
            <select
                bind:value={key.darkStyle}
                class="w-[50%] p-1 bg-transparent rounded-md variant-ringed hover:variant-ghost"
            >
                <option value="">None</option>
                {#each keyStyleNames as name}
                    <option value={name}>{name}</option>
                {/each}
            </select>
        </div>
    </div>

    <!-- 按鍵動作按鈕 -->
    <div class="max-w-full p-1 gap-1 flex mx-auto overflow-auto rounded-md hover:variant-ghost">
        <button
            title="在鍵盤中删除此按鍵"
            on:click={delKey}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost active:scale-90"
        >
            <Icon height="20" icon="mdi:close" />
        </button>
        <button
            title="將此按鍵左移一位"
            on:click={moveLeft}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost active:scale-90"
        >
            <Icon height="20" icon="mdi:arrow-left" />
        </button>
        <button
            title="自動鍵寛"
            on:click={() => {
                if (landscape) {
                    key.autoLandscape = !key.autoLandscape;
                } else {
                    key.autoWidth = !key.autoWidth;
                }
            }}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost active:scale-90"
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
                class="min-w-0 grow shrink gap-1 p-2 rounded-md variant-ghost"
            />
        {:else}
            <input
                title="調整按鍵寛度"
                type="number"
                bind:value={key.width}
                placeholder="鍵寛"
                min={1}
                max={100}
                class="min-w-0 grow shrink gap-1 p-2 rounded-md variant-ghost"
            />
        {/if}
        <button
            title="複製按鍵配置"
            on:click={copyKey}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost active:scale-90"
        >
            <Icon height="20" icon="mdi:content-copy" />
        </button>
        <button
            title="粘貼按鍵配置"
            on:click={pasteKey}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost active:scale-90"
        >
            <Icon height="20" icon="mdi:content-paste" />
        </button>
        <button
            title="將此按鍵右移一位"
            on:click={moveRight}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost active:scale-90"
        >
            <Icon height="20" icon="mdi:arrow-right" />
        </button>
    </div>
</div>
