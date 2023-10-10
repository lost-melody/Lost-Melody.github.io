<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { Keyboard } from "./Hamster";
    import { Key, Row } from "./Hamster";
    import BtnInsetsEdit from "./ButtonInsets.svelte";
    import RowEdit from "./Row.svelte";

    /** 當前正在編輯的鍵盤 */
    export var keyboard: Keyboard;

    /** 新增一行按鍵 */
    function newRow(): void {
        keyboard.rows = [...keyboard.rows, new Row()];
    }
    /** 新增按鍵 */
    function newButton(index: number): void {
        keyboard.rows[index].keys = [...keyboard.rows[index].keys, new Key()];
    }

    var selected: { row: number; col: number } = { row: 0, col: 0 };
    function select(row: number, col: number): void {
        selected = { row, col };
    }
</script>

<div class="flex flex-col gap-2 justify-center items-center">
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

    <!-- 鍵盤行編輯控件 -->
    <div class="flex flex-col gap-2">
        {#each keyboard.rows as row, index (row.id)}
            <!-- 一行按鍵 -->
            <RowEdit
                selected={index === selected.row ? selected.col : null}
                bind:row
                on:select={(event) => {
                    select(index, event.detail.index);
                }}
                on:newbtn={() => newButton(index)}
            />
        {/each}
        <button on:click={newRow} class="btn variant-ringed self-center">
            <Icon icon="mdi:table-row-add-after" />
        </button>
    </div>
</div>
