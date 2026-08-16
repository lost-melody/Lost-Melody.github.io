<script lang="ts">
    import { Action, Key, Keyboard } from "../model/keyboardLayout.svelte.ts";
    import KeyEdit from "./KeyEdit.svelte";

    interface Props {
        landscape?: boolean;
        layout: Keyboard;
        selected: { row: number; col: number };
        keyStyleNames: string[];
    }
    let { landscape = false, layout = $bindable(), selected = $bindable(), keyStyleNames }: Props = $props();

    let clipKey = $state<Key>(new Key());
    let clipAction = $state<Action>(new Action());
    let selectedKey = $derived(
        selectedValid(selected, layout) ? layout.rows[selected.row].keys[selected.col] || new Key() : new Key(),
    );

    /** 判定當前坐標是否有效 */
    function selectedValid(selected: { row: number; col: number }, layout: Keyboard): boolean {
        return selected.row < layout.rows.length && selected.col < layout.rows[selected.row].keys.length;
    }
    /** 繼續編輯下一個按鍵 */
    function selectNextKey() {
        // 統計總數
        var count = 0;
        layout.rows.forEach((row) => {
            row.keys.forEach((_) => count++);
        });
        // 總數爲零, 直接返回
        if (!count) {
            [selected.row, selected.col] = [0, 0];
            return;
        }
        // 遍歷查找下一個按鍵
        var { row, col } = selected;
        col++;
        while (!selectedValid({ row, col }, layout)) {
            if (row >= layout.rows.length) {
                [row, col] = [0, 0];
            } else if (col >= layout.rows[row].keys.length) {
                row++;
                col = 0;
            } else {
                col++;
            }
        }
        [selected.row, selected.col] = [row, col];
    }

    /** 删除按鍵 */
    function delButton(): void {
        if (selectedValid(selected, layout)) {
            layout.rows[selected.row].keys.splice(selected.col, 1);
            layout.rows[selected.row].keys = layout.rows[selected.row].keys;
        }
    }
    /** 左移按鍵 */
    function moveBtnLeft(): void {
        if (selected.col > 0 && selectedValid(selected, layout)) {
            var [i, j] = [selected.row, selected.col];
            [layout.rows[i].keys[j], layout.rows[i].keys[j - 1]] = [layout.rows[i].keys[j - 1], layout.rows[i].keys[j]];
            selected.col--;
        }
    }
    /** 右移按鍵 */
    function moveBtnRight(): void {
        if (selectedValid(selected, layout) && selected.col < layout.rows[selected.row].keys.length - 1) {
            var [i, j] = [selected.row, selected.col];
            [layout.rows[i].keys[j], layout.rows[i].keys[j + 1]] = [layout.rows[i].keys[j + 1], layout.rows[i].keys[j]];
            selected.col++;
        }
    }
    /** 複製按鍵配置 */
    function copyKey(): void {
        if (selectedValid(selected, layout)) {
            var [i, j] = [selected.row, selected.col];
            clipKey = layout.rows[i].keys[j].clone();
        }
    }
    /** 粘貼按鍵配置 */
    function pasteKey(): void {
        if (selectedValid(selected, layout)) {
            var [i, j] = [selected.row, selected.col];
            layout.rows[i].keys[j] = clipKey.clone();
        }
    }
</script>

<!-- 按鍵編輯器 -->
<div class="preset-tonal w-full rounded-md">
    <KeyEdit
        key={selectedKey}
        bind:clipAction
        {landscape}
        {keyStyleNames}
        onselectnext={selectNextKey}
        ondelkey={delButton}
        onmoveleft={moveBtnLeft}
        onmoveright={moveBtnRight}
        oncopykey={copyKey}
        onpastekey={pasteKey}
    />
</div>
