<script lang="ts">
    import type { Keyboard } from "./Hamster";
    import BtnInsetsEdit from "./ButtonInsets.svelte";

    //** 當前正在編輯的鍵盤 */
    export var keyboard: Keyboard;
</script>

<div class="flex flex-col justify-center items-center">
    <!-- 鍵盤基本控件 -->
    <div class="card p-2 gap-2 flex flex-col justify-center items-center">
        <!-- 内距「數值·表達式」切換開關 -->
        <div class="btn-group variant-ringed h-8">
            <button
                on:click={() => (keyboard.buttonInsets.expr = false)}
                class="w-20">統一内距</button
            >
            <button
                on:click={() => (keyboard.buttonInsets.expr = true)}
                class="w-24">自定義内距</button
            >
        </div>
        <!-- 鍵盤内距編輯框 -->
        <BtnInsetsEdit bind:buttonInsets={keyboard.buttonInsets} />
    </div>
</div>
