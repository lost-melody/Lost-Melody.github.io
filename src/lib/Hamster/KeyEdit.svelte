<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";
    import { Action, ActionType, Callout, Key } from "./model/keyboardLayout";
    import ActionEdit from "./Action.svelte";
    import IconRange from "$lib/Component/IconRange.svelte";
    import IconButton from "$lib/Component/IconButton.svelte";
    import Details from "$lib/Component/Details.svelte";

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

    // 當樣式不存在時, 將按鍵樣式恢復爲空
    $: {
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
    }

    function activateSwipe(index: number): void {
        key.swipe[index].action.type = ActionType.character;
    }

    var dispatch = createEventDispatcher();
    /** 選擇下一個按鍵 */
    function selectNextKey(): void {
        dispatch("selectnext");
    }
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
<div class="p-2 gap-2 flex flex-col">
    <!-- 鍵寛和鍵值編輯區 -->
    <div class="flex flex-col items-center p-[0.5px] rounded-md variant-ringed">
        <div class="flex w-full items-center">
            <div class="h-10 px-2 flex items-center rounded-tl-md variant-ringed">
                <Icon height="20" icon="mdi:gesture-touch" />
            </div>
            <input
                title="調整按鍵顯示標籤"
                bind:value={key.label}
                placeholder="標籤"
                class="h-10 px-2 grow rounded-none variant-ringed hover:variant-ghost"
            />
            <button
                title="是否經由 Rime 處理"
                on:click={() => (key.processByRIME = !key.processByRIME)}
                class="h-10 px-2 rounded-tr-md hover:variant-ghost active:scale-95 variant-ringed"
            >
                <Icon height="20" icon={key.processByRIME ? "mdi:web" : "mdi:web-off"} />
            </button>
        </div>
        {#if key.action.type === ActionType.space}
            <div class="flex w-full items-center">
                <input
                    title="調整空格鍵的加載時標籤"
                    bind:value={key.loading}
                    placeholder="加載標籤"
                    class="h-10 px-2 grow variant-ringed hover:variant-ghost"
                />
            </div>
        {/if}
        <ActionEdit bind:action={key.action} bind:clipAction />
    </div>

    {#each [2, 1, 0, 3] as index (key.swipe[index].id)}
        <div class="flex flex-col items-center p-[0.5px] rounded-md variant-ringed">
            {#if key.swipe[index].action.type === ActionType.none}
                <div class="flex w-full">
                    <div class="h-10 px-2 flex items-center rounded-l-md variant-ringed">
                        <Icon height="20" icon={icons[index]} />
                    </div>
                    <button
                        title="添加劃動配置"
                        on:click={() => {
                            activateSwipe(index);
                        }}
                        class="h-10 px-2 rounded-r-md grow flex justify-center items-center variant-ringed hover:variant-ghost"
                    >
                        <Icon height="20" icon="mdi:plus" />
                    </button>
                </div>
            {:else}
                <div class="flex w-full">
                    <div class="h-10 px-2 flex items-center rounded-tl-md variant-ringed">
                        <Icon height="20" icon={icons[index]} />
                    </div>
                    <input
                        title="調整劃動顯示標籤"
                        bind:value={key.swipe[index].label}
                        placeholder="標籤"
                        class="h-10 px-2 grow rounded-none variant-ringed hover:variant-ghost"
                    />
                    <!-- 經由 rime 處理 -->
                    <button
                        title="劃動是否經由 Rime 處理"
                        on:click={() => (key.swipe[index].processByRIME = !key.swipe[index].processByRIME)}
                        class="h-10 px-2 variant-ringed hover:variant-ghost"
                    >
                        <Icon height="20" icon={key.swipe[index].processByRIME ? "mdi:web" : "mdi:web-off"} />
                    </button>
                    <!-- 顯示劃動 -->
                    <button
                        title="是否顯示此劃動"
                        on:click={() => (key.swipe[index].display = !key.swipe[index].display)}
                        class="h-10 px-2 rounded-tr-md variant-ringed hover:variant-ghost"
                    >
                        <Icon height="20" icon={key.swipe[index].display ? "mdi:eye" : "mdi:eye-off"} />
                    </button>
                </div>
                <ActionEdit bind:action={key.swipe[index].action} bind:clipAction />
            {/if}
        </div>
    {/each}

    <!-- 長按動作 -->
    <Details summary="長按動作配置">
        <div class="p-1.5 gap-2 flex flex-col">
            <IconRange
                icon="mdi:table-cog"
                title="長按動作數量"
                value={key.callout.length}
                on:change={onCalloutCountChange}
                min="0"
                max="12"
                class="h-10 px-2 flex items-center rounded-md variant-ringed hover:variant-ghost"
            />
            {#each key.callout as callout, index (callout.id)}
                <div class="flex flex-col items-center p-[0.5px] rounded-md variant-ringed">
                    <div class="flex w-full items-center">
                        <div class="h-10 px-2 flex items-center rounded-tl-md variant-ringed">
                            <Icon height="20" icon="mdi:message-outline" />
                        </div>
                        <input
                            title="調整長按動作標籤"
                            bind:value={callout.label}
                            placeholder="標籤"
                            class="h-10 px-2 grow rounded-none variant-ringed hover:variant-ghost"
                        />
                        <IconButton
                            icon="mdi:arrow-up"
                            height="20"
                            title="上移長按動作"
                            on:click={() => {
                                moveCalloutUp(index);
                            }}
                            class="h-10 px-2 variant-ringed hover:variant-ghost active:scale-95"
                        />
                        <IconButton
                            icon="mdi:arrow-down"
                            height="20"
                            title="下移長按動作"
                            on:click={() => {
                                moveCalloutDown(index);
                            }}
                            class="h-10 px-2 rounded-tr-md variant-ringed hover:variant-ghost active:scale-95"
                        />
                    </div>
                    <ActionEdit bind:action={callout.action} bind:clipAction />
                </div>
            {/each}
        </div>
    </Details>

    <!-- 按鍵樣式設置 -->
    <div class="w-full p-[0.5px] rounded-md variant-ringed">
        <div class="w-full flex">
            <div class="h-10 px-2 flex items-center rounded-tl-md variant-ringed">
                <Icon icon="mdi:weather-sunny" />
            </div>
            <span class="h-10 px-2 items-center flex variant-ringed grow shrink"> 亮色樣式 </span>
            <select
                bind:value={key.lightStyle}
                class="w-[50%] h-10 px-2 bg-transparent rounded-tr-md variant-ringed hover:variant-ghost"
            >
                <option value="">none</option>
                {#each keyStyleNames as name}
                    <option value={name}>{name}</option>
                {/each}
            </select>
        </div>
        <div class="w-full flex">
            <div class="h-10 px-2 flex items-center rounded-bl-md variant-ringed">
                <Icon icon="mdi:weather-night" />
            </div>
            <span class="h-10 px-2 items-center flex variant-ringed grow shrink"> 暗色樣式 </span>
            <select
                bind:value={key.darkStyle}
                class="w-[50%] h-10 px-2 bg-transparent rounded-br-md variant-ringed hover:variant-ghost"
            >
                <option value="">none</option>
                {#each keyStyleNames as name}
                    <option value={name}>{name}</option>
                {/each}
            </select>
        </div>
    </div>

    <!-- 按鍵動作按鈕 -->
    <div class="w-full flex mx-auto p-[0.5px] rounded-md variant-ringed overflow-auto">
        <button
            title="在鍵盤中删除此按鍵"
            on:click={delKey}
            class="gap-1 p-2 flex items-center rounded-l-md variant-ringed hover:variant-ghost active:scale-95"
        >
            <Icon height="20" icon="mdi:close" />
        </button>
        <button
            title="將此按鍵左移一位"
            on:click={moveLeft}
            class="gap-1 p-2 flex items-center variant-ringed hover:variant-ghost active:scale-95"
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
            class="gap-1 p-2 flex items-center variant-ringed hover:variant-ghost active:scale-95"
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
                class="min-w-0 grow shrink p-2 rounded-none variant-ringed hover:variant-ghost"
            />
        {:else}
            <input
                title="調整按鍵寛度"
                type="number"
                bind:value={key.width}
                placeholder="鍵寛"
                min={1}
                max={100}
                class="min-w-0 grow shrink p-2 rounded-none variant-ringed hover:variant-ghost"
            />
        {/if}
        <button
            title="複製按鍵配置"
            on:click={copyKey}
            class="gap-1 p-2 flex items-center variant-ringed hover:variant-ghost active:scale-95"
        >
            <Icon height="20" icon="mdi:content-copy" />
        </button>
        <button
            title="粘貼按鍵配置"
            on:click={pasteKey}
            class="gap-1 p-2 flex items-center variant-ringed hover:variant-ghost active:scale-95"
        >
            <Icon height="20" icon="mdi:content-paste" />
        </button>
        <button
            title="將此按鍵右移一位"
            on:click={moveRight}
            class="gap-1 p-2 flex items-center variant-ringed hover:variant-ghost active:scale-95"
        >
            <Icon height="20" icon="mdi:arrow-right" />
        </button>
        <button
            title="繼續編輯下一個按鍵"
            on:click={selectNextKey}
            class="gap-1 p-2 flex items-center rounded-r-md variant-ringed hover:variant-ghost active:scale-95"
        >
            <Icon height="20" icon="mdi:check-circle-outline" />
        </button>
    </div>
</div>
