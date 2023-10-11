<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";
    import { ActionType, Key } from "./Hamster";
    import ActionEdit from "./Action.svelte";

    /** 綁定的按鍵對象 */
    export var key: Key;

    const icons: [string, string, string, string] = [
        "mdi:arrow-collapse-left",
        "mdi:arrow-collapse-down",
        "mdi:arrow-collapse-up",
        "mdi:arrow-collapse-right",
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
    <!-- 按鍵内容展示和删除按鈕 -->
    <div class="flex items-center gap-2">
        <button on:click={delKey} class="btn-icon variant-ringed">
            <Icon height="20" color="red" icon="mdi:delete" />
        </button>
        <span class="text-lg badge variant-ghost h-10 w-16">
            {key.action.display()}
        </span>
    </div>

    <!-- 鍵寛和鍵值編輯區 -->
    <div class="flex items-center gap-1">
        <span class="p-2"> 鍵寛 </span>
        <input
            type="number"
            bind:value={key.width}
            min={1}
            max={100}
            class="rounded-md variant-ghost w-20 p-2"
        />
        <div class="flex p-2 rounded-md variant-ghost items-center">
            <ActionEdit bind:action={key.action} />
        </div>
    </div>

    <!-- 劃動配置 -->
    <div class="grid grid-cols-2 gap-1">
        {#each [0, 3, 2, 1] as index (key.swipe[index].id)}
            <div class="flex p-2 gap-1 rounded-md variant-ghost items-center">
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
                {/if}
            </div>
        {/each}
    </div>

    <!-- 按鍵動作按鈕 -->
    <div class="flex items-center gap-1">
        <div class="input-group flex px-2 items-center">
            <Icon height="20" icon="mdi:arrow-left" />
            <button on:click={moveLeft} class="w-16 px-2 py-1"> 左移 </button>
        </div>
        <div class="input-group flex px-2 items-center">
            <button on:click={moveRight} class="w-16 px-2 py-1"> 右移 </button>
            <Icon height="20" icon="mdi:arrow-right" />
        </div>
    </div>
</div>
