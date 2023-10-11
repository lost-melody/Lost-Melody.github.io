<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { Keyboard } from "./Hamster";
    import { Key, Row } from "./Hamster";
    import BtnInsetsEdit from "./ButtonInsets.svelte";
    import RowEdit from "./Row.svelte";
    import KeyEdit from "./Key.svelte";

    /** 按鍵區域寛度 */
    var kbdAreaWidth: number = 512;

    /** 當前正在編輯的鍵盤 */
    export var keyboard: Keyboard;

    /** 當前選中的按鍵: 某行某列 */
    var selected: { row: number; col: number } = { row: 0, col: 0 };
    /** 更新選中的按鍵坐標 */
    function select(row: number, col: number): void {
        selected = { row, col };
    }
    /** 判定當前坐標是否有效 */
    function selectedValid(
        selected: { row: number; col: number },
        keyboard: Keyboard
    ): boolean {
        return (
            selected.row < keyboard.rows.length &&
            selected.col < keyboard.rows[selected.row].keys.length
        );
    }

    /** 新增一行按鍵 */
    function newRow(): void {
        var newRow;
        if (selected.row < keyboard.rows.length) {
            newRow = keyboard.rows[selected.row].clone();
        }
        keyboard.rows = [...keyboard.rows, newRow || new Row()];
    }
    /** 删除一行按鍵 */
    function delRow(index: number): void {
        // 從列表中移除選定的按鍵行
        keyboard.rows.splice(index, 1);
        keyboard.rows = keyboard.rows;
    }
    /** 新增按鍵 */
    function newButton(index: number): void {
        var newKey;
        if (selectedValid(selected, keyboard)) {
            newKey = keyboard.rows[selected.row].keys[selected.col].clone();
        }
        keyboard.rows[index].keys = [
            ...keyboard.rows[index].keys,
            newKey || new Key(),
        ];
    }
    /** 删除按鍵 */
    function delButton(): void {
        if (selectedValid(selected, keyboard)) {
            keyboard.rows[selected.row].keys.splice(selected.col, 1);
            keyboard.rows[selected.row].keys = keyboard.rows[selected.row].keys;
        }
    }
    /** 左移按鍵 */
    function moveBtnLeft(): void {
        if (selected.col > 0 && selectedValid(selected, keyboard)) {
            var [i, j] = [selected.row, selected.col];
            [keyboard.rows[i].keys[j], keyboard.rows[i].keys[j - 1]] = [
                keyboard.rows[i].keys[j - 1],
                keyboard.rows[i].keys[j],
            ];
            selected.col--;
        }
    }
    /** 右移按鍵 */
    function moveBtnRight(): void {
        if (
            selectedValid(selected, keyboard) &&
            selected.col < keyboard.rows[selected.row].keys.length - 1
        ) {
            var [i, j] = [selected.row, selected.col];
            [keyboard.rows[i].keys[j], keyboard.rows[i].keys[j + 1]] = [
                keyboard.rows[i].keys[j + 1],
                keyboard.rows[i].keys[j],
            ];
            selected.col++;
        }
    }

    /** 當前選中的按鍵對象 */
    var selectedKey: Key;
    /** 無可用按鍵時, 用這個 */
    const theHiddenKey = new Key();
    // 坐標無效時, 置零
    $: if (!selectedValid(selected, keyboard)) {
        let found = false;
        for (let i = 0; i < keyboard.rows.length; i++) {
            for (let j = 0; j < keyboard.rows[i].keys.length; j++) {
                selected = { row: i, col: j };
                found = true;
                break;
            }
            if (found) {
                break;
            }
        }
        if (!found) {
            selected = { row: 0, col: 0 };
        }
    }
    // 綁定選中按鍵
    $: if (selectedValid(selected, keyboard)) {
        selectedKey = keyboard.rows[selected.row].keys[selected.col];
    } else {
        selectedKey = theHiddenKey;
    }
</script>

<div class="flex flex-col gap-2 justify-center items-center">
    <!-- 鍵盤基本控件 -->
    <div class="card p-2 gap-2 flex flex-col justify-center items-center">
        <!-- 内距「數值·表達式」切換開關 -->
        <div class="btn-group variant-ringed h-8">
            <button
                on:click={() => (keyboard.buttonInsets.expr = false)}
                class:variant-ghost={!keyboard.buttonInsets.expr}
                class="w-20">統一内距</button
            >
            <button
                on:click={() => (keyboard.buttonInsets.expr = true)}
                class:variant-ghost={keyboard.buttonInsets.expr}
                class="w-24">自定義内距</button
            >
        </div>
        <!-- 鍵盤内距編輯框 -->
        <BtnInsetsEdit bind:buttonInsets={keyboard.buttonInsets} />
    </div>

    <KeyEdit
        bind:key={selectedKey}
        on:delkey={delButton}
        on:moveleft={moveBtnLeft}
        on:moveright={moveBtnRight}
    />

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
            <span> 區域寛度 </span>
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
