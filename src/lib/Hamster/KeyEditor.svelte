<script lang="ts">
    import { Action, Key, Keyboard } from "./model/keyboardLayout";
    import KeyEdit from "./KeyEdit.svelte";

    export var landscape: boolean = false;
    export var layout: Keyboard;
    export var selected: { row: number; col: number };

    var clipKey: Key;
    var clipAction: Action;
    var selectedKey: Key = new Key();
    $: if (selectedValid(selected, layout))
        selectedKey = layout.rows[selected.row].keys[selected.col] || new Key();

    /** 判定當前坐標是否有效 */
    function selectedValid(
        selected: { row: number; col: number },
        layout: Keyboard
    ): boolean {
        return (
            selected.row < layout.rows.length &&
            selected.col < layout.rows[selected.row].keys.length
        );
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
            [layout.rows[i].keys[j], layout.rows[i].keys[j - 1]] = [
                layout.rows[i].keys[j - 1],
                layout.rows[i].keys[j],
            ];
            selected.col--;
        }
    }
    /** 右移按鍵 */
    function moveBtnRight(): void {
        if (
            selectedValid(selected, layout) &&
            selected.col < layout.rows[selected.row].keys.length - 1
        ) {
            var [i, j] = [selected.row, selected.col];
            [layout.rows[i].keys[j], layout.rows[i].keys[j + 1]] = [
                layout.rows[i].keys[j + 1],
                layout.rows[i].keys[j],
            ];
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
<div class="p-2 w-full rounded-md variant-soft">
    <KeyEdit
        bind:key={selectedKey}
        bind:clipAction
        {landscape}
        on:delkey={delButton}
        on:moveleft={moveBtnLeft}
        on:moveright={moveBtnRight}
        on:copykey={copyKey}
        on:pastekey={pasteKey}
    />
</div>
