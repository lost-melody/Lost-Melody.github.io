<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";
    import type { Keyboard } from "./Hamster";
    import BtnInsetsEdit from "./ButtonInsets.svelte";

    // 點擊「删除」按鈕時, 發送删除事件
    const dispatch = createEventDispatcher();
    function onDelete() {
        dispatch("delete");
    }

    //** 當前正在編輯的鍵盤 */
    export var keyboard: Keyboard;
</script>

<div class="flex flex-col justify-center items-center">
    <!-- 鍵盤基本控件 -->
    <div class="flex p-2 gap-4 justify-center items-center">
        <!-- 删除按鈕 -->
        <button class="btn-icon variant-ghost" on:click={onDelete}>
            <Icon color="red" icon="mdi:delete" />
        </button>

        <!-- 鍵盤名稱編輯框 -->
        <div class="flex flex-col w-32">
            <span class="text-sm">鍵盤名</span>
            <input
                type="text"
                placeholder="天行鍵"
                bind:value={keyboard.name}
                class="input px-2 py-1"
            />
        </div>

        <!-- 内距「數值·表達式」切換開關 -->
        <div class="flex flex-col">
            <span class="text-sm">内距類型</span>
            <button
                on:click={() =>
                    (keyboard.buttonInsets.expr = !keyboard.buttonInsets.expr)}
                class="btn variant-ghost"
            >
                {keyboard.buttonInsets.expr ? "表達式" : "數值"}
            </button>
        </div>
    </div>

    <!-- 鍵盤内距編輯框 -->
    <div class="card p-2 flex flex-col justify-center items-center">
        <span class="text-sm">内距</span>
        <BtnInsetsEdit bind:buttonInsets={keyboard.buttonInsets} />
    </div>
</div>
