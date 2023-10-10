<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { Keyboard } from "./Hamster";
    import { Key, Row } from "./Hamster";
    import BtnInsetsEdit from "./ButtonInsets.svelte";
    import RowEdit from "./Row.svelte";

    /** 按鍵區域寛度 */
    var kbdAreaWidth: number = 512;

    /** 當前正在編輯的鍵盤 */
    export var keyboard: Keyboard;

    /** 新增一行按鍵 */
    function newRow(): void {
        keyboard.rows = [...keyboard.rows, new Row()];
    }
    /** 删除一行按鍵 */
    function delRow(index: number): void {
        // 從列表中移除選定的按鍵行
        keyboard.rows = keyboard.rows
            .slice(0, index)
            .concat(keyboard.rows.slice(index + 1));
        // 列表爲空時補充一個
        if (keyboard.rows.length === 0) {
            keyboard.rows = [new Row()];
        }
    }
    /** 新增按鍵 */
    function newButton(index: number): void {
        keyboard.rows[index].keys = [...keyboard.rows[index].keys, new Key()];
    }

    /** 當前選中的按鍵: 某行某列 */
    var selected: { row: number; col: number } = { row: 0, col: 0 };
    /** 更新選中的按鍵坐標 */
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
        <div class="flex flex-col">
            {#each keyboard.rows as row, index (row.id)}
                <!-- 一行按鍵 -->
                <RowEdit
                    bind:row
                    selected={index === selected.row ? selected.col : null}
                    first={index == 0}
                    last={index + 1 === keyboard.rows.length}
                    buttonInsets={keyboard.buttonInsets}
                    width={kbdAreaWidth}
                    height={0}
                    on:select={(event) => {
                        select(index, event.detail.index);
                    }}
                    on:newbtn={() => newButton(index)}
                    on:delrow={() => delRow(index)}
                />
            {/each}
        </div>

        <!-- 新增行, 屏幕寛度調整 -->
        <div class="flex gap-2 justify-center items-center">
            <button on:click={newRow} class="btn variant-ringed self-center">
                <Icon icon="mdi:table-row-add-after" />
                <span> 新增一行 </span>
            </button>
            <input
                type="number"
                bind:value={kbdAreaWidth}
                class="input rounded-md w-32 p-2"
                min={64}
                max={4096}
            />
        </div>
    </div>
</div>
