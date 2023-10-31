<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";
    import { ActionType, Key } from "./model/keyboardLayout";
    import ActionEdit from "./Action.svelte";

    /** 綁定的按鍵對象 */
    export var key: Key;

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
</script>

<!-- 劃動配置 -->
<div class="flex flex-col gap-1">
    <!-- 鍵寛和鍵值編輯區 -->
    <div
        class="flex h-10 p-2 gap-1 rounded-md hover:variant-ghost items-center"
    >
        <Icon height="20" icon="mdi:gesture-touch" />
        <ActionEdit bind:action={key.action} />
        <input
            title="調整按鍵顯示標籤"
            bind:value={key.label}
            placeholder="標籤"
            class="px-2 w-20 rounded-md bg-transparent hover:variant-soft"
        />
        {#if key.action.type === ActionType.space}
            <input
                title="調整空格鍵的加載時標籤"
                bind:value={key.loading}
                placeholder="加載標籤"
                class="px-2 w-20 rounded-md bg-transparent hover:variant-soft"
            />
        {/if}
    </div>

    {#each [2, 1, 0, 3] as index (key.swipe[index].id)}
        <div
            class="flex h-10 p-2 gap-1 rounded-md hover:variant-ghost items-center"
        >
            <Icon height="20" icon={icons[index]} />
            {#if key.swipe[index].action.type === ActionType.none}
                <button
                    title="添加劃動配置"
                    on:click={() => {
                        activateSwipe(index);
                    }}
                    class="rounded-md w-full px-2 py-1 flex justify-center items-center hover:variant-soft"
                >
                    <Icon height="20" icon="mdi:plus" />
                </button>
            {:else}
                <ActionEdit bind:action={key.swipe[index].action} />
                <input
                    title="調整劃動顯示標籤"
                    bind:value={key.swipe[index].label}
                    placeholder="標籤"
                    class="px-2 w-20 rounded-md bg-transparent hover:variant-soft"
                />
                <!-- 顯示劃動 -->
                <button
                    title="是否顯示此劃動"
                    on:click={() =>
                        (key.swipe[index].display = !key.swipe[index].display)}
                    class="rounded-full p-1 hover:variant-soft"
                >
                    <Icon
                        height="20"
                        icon={key.swipe[index].display
                            ? "mdi:eye"
                            : "mdi:eye-off"}
                    />
                </button>
                <!-- 經由 rime 處理 -->
                <button
                    title="劃動是否經由 Rime 處理"
                    on:click={() =>
                        (key.swipe[index].processByRIME =
                            !key.swipe[index].processByRIME)}
                    class="rounded-full p-1 hover:variant-soft"
                >
                    <Icon
                        height="20"
                        icon={key.swipe[index].processByRIME
                            ? "mdi:web"
                            : "mdi:web-off"}
                    />
                </button>
            {/if}
        </div>
    {/each}

    <!-- 按鍵動作按鈕 -->
    <div
        class="p-1 gap-1 flex mx-auto overflow-auto rounded-md hover:variant-ghost"
    >
        <button
            title="在鍵盤中删除此按鍵"
            on:click={delKey}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost"
        >
            <Icon height="20" icon="mdi:close" />
        </button>
        <button
            title="將此按鍵左移一位"
            on:click={moveLeft}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost"
        >
            <Icon height="20" icon="mdi:arrow-left" />
        </button>
        <button
            title="自動鍵寛"
            on:click={() => (key.autoWidth = !key.autoWidth)}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost"
        >
            <Icon
                height="20"
                icon={key.autoWidth ? "mdi:table-sync" : "mdi:table-remove"}
            />
        </button>
        <input
            title="調整按鍵寛度"
            type="number"
            bind:value={key.width}
            placeholder="鍵寛"
            min={1}
            max={100}
            class="w-24 gap-1 p-2 rounded-md variant-ghost"
        />
        <button
            title="複製按鍵配置"
            on:click={copyKey}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost"
        >
            <Icon height="20" icon="mdi:content-copy" />
        </button>
        <button
            title="粘貼按鍵配置"
            on:click={pasteKey}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost"
        >
            <Icon height="20" icon="mdi:content-paste" />
        </button>
        <button
            title="將此按鍵右移一位"
            on:click={moveRight}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost"
        >
            <Icon height="20" icon="mdi:arrow-right" />
        </button>
    </div>
</div>
