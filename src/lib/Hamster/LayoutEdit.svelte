<script lang="ts">
    import { browser } from "$app/environment";
    import YAML from "yaml";
    import Icon from "@iconify/svelte";

    import { Key, Keyboard, Row } from "./model/keyboardLayout";
    import IconButton from "$lib/Component/IconButton.svelte";
    import IconRange from "$lib/Component/IconRange.svelte";
    import ButtonInsets from "./ButtonInsets.svelte";
    import KeyEdit from "./KeyEdit.svelte";
    import KeyboardLoad from "./KeyboardLoad.svelte";

    export var layout: Keyboard;
    export var selected: { row: number; col: number };

    var clipKey: Key;
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
    /** 上移按鍵行 */
    function moveRowUp(index: number): void {
        if (index > 0) {
            [layout.rows[index], layout.rows[index - 1]] = [
                layout.rows[index - 1],
                layout.rows[index],
            ];
        }
    }
    /** 下移按鍵行 */
    function moveRowDown(index: number): void {
        if (index < layout.rows.length) {
            [layout.rows[index], layout.rows[index + 1]] = [
                layout.rows[index + 1],
                layout.rows[index],
            ];
        }
    }

    function allSwipeUp(show: boolean): void {
        var flagged = false;
        for (let row of layout.rows) {
            for (let key of row.keys) {
                if (key.swipe[2].display !== show) {
                    key.swipe[2].display = show;
                    flagged = true;
                }
            }
        }
        if (flagged) {
            layout.rows = layout.rows;
        }
    }
    function allSwipeDown(show: boolean): void {
        var flagged = false;
        for (let row of layout.rows) {
            for (let key of row.keys) {
                if (key.swipe[1].display !== show) {
                    key.swipe[1].display = show;
                    flagged = true;
                }
            }
        }
        if (flagged) {
            layout.rows = layout.rows;
        }
    }

    import keyboardsYaml from "$lib/assets/hamster-tools/keyboards.yaml?raw";
    function initPredefined() {
        try {
            var keyboardsObj = YAML.parse(keyboardsYaml);
            return keyboardsObj.keyboards as object[];
        } catch (err) {
            console.error(
                "parse keyboards.yaml failed:",
                (err as Error).message
            );
        }
        return [];
    }
    var predefinedKeyboards: object[] = initPredefined();
    /** 加載預置鍵盤檔案 */
    function loadPredefined(index: number): void {
        if (layout) {
            var initName = layout.name;
            layout.fromObject(predefinedKeyboards[index]);
            layout.name = initName;
        }
    }

    const nameEmpty = "空的";
    /** LocalStorage 自定義鍵檔案鍵名 */
    function customKeyboardKey(index: number): string {
        return `customKeyboard${index}`;
    }
    /** 自定義鍵盤存儲位 */
    var customKeyboards: object[] = new Array(15).fill(0).map((_, index) => {
        if (!browser) {
            // server 端渲染, 没有 localStorage 接口
            return { name: nameEmpty };
        }

        var keyboardData = localStorage.getItem(customKeyboardKey(index));
        if (keyboardData) {
            try {
                var obj = YAML.parse(keyboardData);
                return obj;
            } catch (err) {
                console.error(
                    "parse custom keyboard failed:",
                    (err as Error).message
                );
            }
        }
        return { name: nameEmpty };
    });
    /** 加載自定義鍵盤檔案 */
    function loadCustom(index: number): void {
        if (layout && customKeyboards[index]) {
            var initName = layout.name;
            layout.fromObject(customKeyboards[index]);
            layout.name = initName;
        }
    }
    /** 删除自定義鍵盤檔案 */
    function removeCustom(index: number): void {
        localStorage.removeItem(customKeyboardKey(index));
        customKeyboards[index] = { name: nameEmpty };
    }
    /** 覆蓋自定義鍵盤檔案 */
    function overrideCustom(index: number): void {
        if (layout) {
            var obj = layout.toObject();
            var keyboardData = YAML.stringify(obj);
            try {
                localStorage.setItem(customKeyboardKey(index), keyboardData);
                customKeyboards[index] = obj;
            } catch (err) {
                console.error(
                    "save to local storage failed:",
                    (err as Error).message
                );
            }
        }
    }

    function onRowCountChange(event: Event) {
        const count = Number((event.currentTarget as HTMLInputElement).value);
        if (count < layout.rows.length) {
            layout.rows = layout.rows.slice(0, count);
        } else if (count > layout.rows.length) {
            layout.rows = [
                ...layout.rows,
                ...Array(count - layout.rows.length)
                    .fill(0)
                    .map(() => new Row()),
            ];
        }
    }
    function onRowKeysChange(event: Event, indexRow: number) {
        const count = Number((event.currentTarget as HTMLInputElement).value);
        const length = layout.rows[indexRow].keys.length;
        if (length > count) {
            layout.rows[indexRow].keys = layout.rows[indexRow].keys.slice(
                0,
                count
            );
        } else if (length < count) {
            layout.rows[indexRow].keys = [
                ...layout.rows[indexRow].keys,
                ...Array(count - length)
                    .fill(0)
                    .map(() => new Key()),
            ];
        }
    }
</script>

<div class="w-full p-1 gap-1 flex flex-col rounded-md variant-soft">
    <!-- 佈局名稱 -->
    <div
        class="w-full max-w-[400px] px-4 py-2 gap-2 mx-auto flex items-center rounded-md hover:variant-ghost"
    >
        <Icon icon="mdi:rename-box" />
        <span class="grow shrink"> 佈局名稱 </span>
        <input
            title="鍵盤名稱"
            type="text"
            bind:value={layout.name}
            placeholder="天行鍵"
            class="w-[50%] p-2 bg-transparent rounded-md hover:variant-ghost"
        />
    </div>

    <!-- 按鍵編輯器 -->
    <div
        class="p-2 w-full max-w-[400px] mx-auto rounded-md hover:variant-ghost"
    >
        <KeyEdit
            bind:key={selectedKey}
            on:delkey={delButton}
            on:moveleft={moveBtnLeft}
            on:moveright={moveBtnRight}
            on:copykey={copyKey}
            on:pastekey={pasteKey}
        />
    </div>

    <!-- 編輯按鍵分佈 -->
    <details
        class="p-2 w-full max-w-[400px] mx-auto rounded-md hover:variant-ghost"
    >
        <summary class="p-2">編輯按鍵分佈</summary>
        <IconRange
            icon="mdi:table-cog"
            title="按鍵行数"
            value={layout.rows.length}
            on:change={onRowCountChange}
            min="0"
            max="7"
            class="p-2 gap-1 flex items-center rounded-md hover:variant-ghost"
        />
        {#each layout.rows as row, index (row.id)}
            <IconRange
                icon="mdi:table-cog"
                title="按鍵數量"
                value={row.keys.length}
                on:change={(event) => {
                    onRowKeysChange(event, index);
                }}
                min="0"
                max="15"
                class="p-2 gap-1 flex items-center rounded-md hover:variant-ghost"
            >
                <span class="grow shrink">{`第 ${index + 1} 行`}</span>
                <IconButton
                    icon="mdi:arrow-up"
                    title="整行按鍵上移"
                    on:click={() => {
                        moveRowUp(index);
                    }}
                    class="p-2 rounded-md hover:variant-ghost"
                />
                <IconButton
                    icon="mdi:arrow-down"
                    title="整行按鍵下移"
                    on:click={() => {
                        moveRowDown(index);
                    }}
                    class="p-2 rounded-md hover:variant-ghost"
                />
                <input
                    title="行高, 默認56"
                    placeholder="行高"
                    type="number"
                    bind:value={row.rowHeight}
                    class="w-12 p-1 rounded-md bg-transparent hover:variant-ghost"
                    min="0"
                    max="128"
                />
            </IconRange>
        {/each}
    </details>

    <!-- 全局劃動修改 -->
    <details
        class="p-2 w-full max-w-[400px] mx-auto rounded-md hover:variant-ghost"
    >
        <summary class="p-2">劃動顯示/隱藏</summary>
        <IconButton
            icon="mdi:eye"
            on:click={() => {
                allSwipeUp(true);
            }}
            class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
        >
            <span>顯示所有上劃字符</span>
        </IconButton>
        <IconButton
            icon="mdi:eye"
            on:click={() => {
                allSwipeUp(false);
            }}
            class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
        >
            <span>隱藏所有上劃字符</span>
        </IconButton>
        <IconButton
            icon="mdi:eye"
            on:click={() => {
                allSwipeDown(true);
            }}
            class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
        >
            <span>顯示所有下劃字符</span>
        </IconButton>
        <IconButton
            icon="mdi:eye"
            on:click={() => {
                allSwipeDown(false);
            }}
            class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
        >
            <span>隱藏所有下劃字符</span>
        </IconButton>
    </details>

    <!-- 内距編輯器 -->
    <details
        class="p-2 w-full max-w-[400px] mx-auto rounded-md hover:variant-ghost"
    >
        <summary class="p-2">編輯内距</summary>
        <IconButton
            icon={layout.buttonInsets.expr
                ? "mdi:checkbox-blank-outline"
                : "mdi:checkbox-marked-outline"}
            height="20"
            on:click={() => {
                layout.buttonInsets.expr = !layout.buttonInsets.expr;
            }}
            class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
        >
            <span class="grow text-left">使用統一内距</span>
        </IconButton>

        <ButtonInsets bind:buttonInsets={layout.buttonInsets} />
    </details>

    <!-- 預置模板 -->
    <details
        class="p-2 w-full max-w-[400px] mx-auto rounded-md hover:variant-ghost"
    >
        <summary class="p-2">預置模板</summary>
        <div class="gap-2 grid grid-cols-2">
            {#each predefinedKeyboards as keyboard, index}
                <KeyboardLoad
                    on:load={() => loadPredefined(index)}
                    {keyboard}
                />
            {/each}
        </div>
    </details>

    <!-- 自定義檔案 -->
    <details
        class="p-2 w-full max-w-[400px] mx-auto rounded-md hover:variant-ghost"
    >
        <summary class="p-2">自定義檔案</summary>
        <div class="gap-2 grid grid-cols-2">
            {#each customKeyboards as keyboard, index}
                <KeyboardLoad
                    on:load={() => loadCustom(index)}
                    on:remove={() => removeCustom(index)}
                    on:override={() => overrideCustom(index)}
                    remove
                    override
                    {keyboard}
                />
            {/each}
        </div>
    </details>
</div>
