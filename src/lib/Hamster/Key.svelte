<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";
    import { ActionType, Key } from "./Hamster";
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
</script>

<!-- 按鍵編輯面板 -->
<div class="flex flex-col items-center p-2 gap-2 rounded-md variant-ghost">
    <!-- 劃動配置 -->
    <div class="flex flex-col gap-1">
        <!-- 鍵寛和鍵值編輯區 -->
        <div class="flex h-10 p-2 gap-1 rounded-md variant-ghost items-center">
            <Icon height="20" icon="mdi:gesture-touch" />
            <ActionEdit bind:action={key.action} />
            <input
                bind:value={key.label}
                placeholder="標簽"
                class="px-2 w-20 rounded-md bg-transparent hover:variant-soft"
            />
        </div>

        {#each [2, 1, 0, 3] as index (key.swipe[index].id)}
            <div
                class="flex h-10 p-2 gap-1 rounded-md variant-ghost items-center"
            >
                <Icon height="20" icon={icons[index]} />
                {#if key.swipe[index].action.type === ActionType.none}
                    <button
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
                        bind:value={key.label}
                        placeholder="標簽"
                        class="px-2 w-20 rounded-md bg-transparent hover:variant-soft"
                    />
                    <!-- 顯示劃動 -->
                    <button
                        on:click={() =>
                            (key.swipe[index].display =
                                !key.swipe[index].display)}
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
    </div>

    <!-- 按鍵動作按鈕 -->
    <div class="flex gap-1">
        <button
            on:click={delKey}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost"
        >
            <Icon height="20" icon="mdi:close" />
        </button>
        <button
            on:click={moveLeft}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost"
        >
            <Icon height="20" icon="mdi:arrow-left" />
            左移
        </button>
        <input
            type="number"
            bind:value={key.width}
            placeholder="鍵寛"
            min={1}
            max={100}
            class="w-16 gap-1 p-2 rounded-md variant-ghost"
        />
        <button
            on:click={moveRight}
            class="gap-1 p-2 flex items-center rounded-md variant-ghost"
        >
            右移
            <Icon height="20" icon="mdi:arrow-right" />
        </button>
    </div>
</div>
