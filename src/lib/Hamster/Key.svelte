<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";
    import type { Key } from "./Hamster";

    /** 綁定的按鍵對象 */
    export var key: Key;

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
        <span class="text-lg badge variant-ghost h-10 w-16"> {key.action.display()} </span>
    </div>

    <!-- 鍵寛和鍵值編輯區 -->
    <div class="flex items-center">
        <span class="p-2"> 鍵寛 </span>
        <input
            type="number"
            bind:value={key.width}
            min={1}
            max={100}
            class="input rounded-md w-20 p-2"
        />
        <span class="p-2"> 鍵值 </span>
        <input
            bind:value={key.action.text}
            min={1}
            max={100}
            class="input rounded-md w-20 p-2"
        />
    </div>

    <!-- 按鍵動作按鈕 -->
    <div class="flex items-center">
        <button on:click={moveLeft} class="btn variant-ringed">
            <Icon height="20" icon="mdi:arrow-left" />
            左移按鍵
        </button>
        <button on:click={moveRight} class="btn variant-ringed">
            右移按鍵
            <Icon height="20" icon="mdi:arrow-right" />
        </button>
    </div>
</div>
