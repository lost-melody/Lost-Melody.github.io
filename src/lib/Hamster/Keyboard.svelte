<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";
    import type { Keyboard } from "$lib/Hamster/Hamster";

    // 點擊「删除」按鈕時, 發送删除事件
    const dispatch = createEventDispatcher();
    function onDelete() {
        dispatch("delete");
    }

    //** 當前正在編輯的鍵盤 */
    export var keyboard: Keyboard;
</script>

<div class="flex p-4 gap-4 justify-center items-center">
    <!-- 删除按鈕 -->
    <button class="btn-icon variant-ghost" on:click={onDelete}>
        <Icon color="red" icon="mdi:delete" />
    </button>
    <!-- 鍵盤名稱編輯框 -->
    <label class="label">
        <span>鍵盤名</span>
        <input
            type="text"
            placeholder="鍵盤名"
            bind:value={keyboard.name}
            class="input rounded px-2 py-1"
        />
    </label>
    <!-- 鍵盤内距編輯框 -->
    <label class="label">
        <span>内距</span>
        <input
            type="text"
            placeholder="left(2),right(2),top(2),bottom(2)"
            value="2"
            class="input rounded px-2 py-1"
        />
    </label>
</div>
