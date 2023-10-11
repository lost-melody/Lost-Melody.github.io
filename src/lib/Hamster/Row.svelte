<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";
    import type { ButtonInsets, Row } from "./Hamster";

    /** 綁定按鍵行數據 */
    export var row: Row;
    /** 選中的按鍵是否在當前行 */
    export var selected: number | null;
    /** 鍵盤區域寛度和行高 */
    export var width: number, height: number;
    /** 是否首行|末行, 用於渲染上下邊框及圓角效果 */
    export var first: boolean, last: boolean;
    /** 按鍵内距 */
    export var buttonInsets: ButtonInsets;

    /** 工具函數, 處理寛高範圍 */
    function between(x: number, min: number, max: number): number {
        if (x < min) {
            return min;
        } else if (x > max) {
            return max;
        } else {
            return x;
        }
    }

    // 寛高样式
    const [maxWidth, maxHeight] = [4096, 256];
    $: _width = (width && between(width, 64, maxWidth)) || 512;
    $: _height = (height && between(height, 16, maxHeight)) || 48;
    $: styleHeight = `height: ${_height}px`;
    $: style = `width:${_width}px;height:${_height}px;`;

    // 按鍵内距样式
    var pl: number, pb: number, pt: number, pr: number;
    $: if (buttonInsets.expr) {
        [pl, pb, pt, pr] = buttonInsets.insets;
    } else {
        let p = buttonInsets.value;
        [pl, pb, pt, pr] = [p, p, p, p];
    }
    $: styleInsets = `padding: ${pt}px ${pr}px ${pb}px ${pl}px;`;

    var dispatch = createEventDispatcher();
    /** 發送按鍵選定事件 */
    function select(index: number): void {
        dispatch("select", { index });
    }
    /** 發送新增按鍵事件 */
    function newButton(): void {
        dispatch("newbtn");
    }
    /** 發送删除按鍵行事件 */
    function delRow(): void {
        dispatch("delrow");
    }
</script>

<div class="flex gap-2">
    <!-- 行高控件 -->
    <div
        class:border-t={first}
        class:rounded-t-md={first}
        class:rounded-b-md={last}
        style={styleHeight}
        class="flex border-x border-b border-surface-500 bg-surface-200 dark:bg-surface-800"
    >
        <input
            type="number"
            bind:value={height}
            class="w-16 px-2 h-full rounded-md bg-transparent hover:variant-ghost"
            min={0}
            max={maxHeight}
        />
    </div>

    <!-- 按鍵行 -->
    <div
        {style}
        class:border-t={first}
        class:rounded-t-md={first}
        class:border-b={last}
        class:rounded-b-md={last}
        class="flex border-x border-b border-surface-500"
    >
        {#each row.keys as key, index (key.id)}
            <!-- 遍歷本行所有按鍵 -->
            <div
                style={styleInsets +
                    `width: ${key.width}%; height: ${_height}px;`}
                class=""
            >
                <button
                    class:border={index === selected}
                    class="
                        h-full w-full rounded-md
                        border-gray-700 dark:border-gray-300
                        bg-surface-300 dark:bg-surface-700
                        hover:bg-surface-400 hover:dark:bg-surface-800
                    "
                    on:click={() => select(index)}
                >
                    {key.action.display()}
                </button>
            </div>
        {/each}
    </div>

    <!-- 新增按鍵, 删除行 -->
    <div
        class:border-t={first}
        class:rounded-t-md={first}
        class:rounded-b-md={last}
        class="flex items-center border-x border-b border-surface-500 bg-surface-200 dark:bg-surface-800"
    >
        <button
            on:click={newButton}
            class="px-2 h-full rounded-md bg-transparent hover:variant-ghost"
        >
            <Icon icon="mdi:plus" />
        </button>
        <button
            on:click={delRow}
            class="px-2 h-full rounded-md bg-transparent hover:variant-ghost"
        >
            <Icon color="red" icon="mdi:close" />
        </button>
    </div>
</div>
