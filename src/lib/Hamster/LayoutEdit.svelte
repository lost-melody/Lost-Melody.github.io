<script lang="ts">
    import Icon from "@iconify/svelte";

    import { Key, Keyboard, Row } from "./model/keyboardLayout";
    import IconButton from "$lib/Component/IconButton.svelte";
    import IconRange from "$lib/Component/IconRange.svelte";

    export var landscape: boolean = false;
    export var layout: Keyboard;

    /** 上移按鍵行 */
    function moveRowUp(index: number): void {
        if (index > 0) {
            [layout.rows[index], layout.rows[index - 1]] = [layout.rows[index - 1], layout.rows[index]];
        }
    }
    /** 下移按鍵行 */
    function moveRowDown(index: number): void {
        if (index + 1 < layout.rows.length) {
            [layout.rows[index], layout.rows[index + 1]] = [layout.rows[index + 1], layout.rows[index]];
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
            layout.rows[indexRow].keys = layout.rows[indexRow].keys.slice(0, count);
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

<div class="w-full p-2 flex flex-col rounded-md variant-soft">
    <!-- 佈局名稱 -->
    <div class="w-full p-2 rounded-md hover:variant-ghost">
        <div class="w-full p-2 gap-2 flex items-center rounded-md hover:variant-ghost">
            <Icon icon="mdi:rename-box" />
            <span class="grow shrink"> 佈局名稱 </span>
            <input
                title="鍵盤名稱"
                type="text"
                bind:value={layout.name}
                placeholder="天行鍵"
                class="w-[50%] px-2 bg-transparent rounded-md hover:variant-ghost"
            />
        </div>
        <IconButton
            icon={layout.primary ? "mdi:checkbox-marked-outline" : "mdi:checkbox-blank-outline"}
            on:click={() => {
                layout.primary = !layout.primary;
            }}
            class="w-full p-2 gap-2 flex items-center rounded-md hover:variant-ghost active:scale-95"
            >{layout.primary ? "主鍵盤" : "非主鍵盤"}</IconButton
        >
    </div>

    <!-- 編輯按鍵分佈 -->
    <details open class="p-2 w-full rounded-md hover:variant-ghost">
        <summary class="p-2">編輯按鍵分佈</summary>
        <IconRange
            icon="mdi:table-cog"
            title="按鍵行数"
            value={layout.rows.length}
            on:change={onRowCountChange}
            min="0"
            max="8"
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
                max="24"
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
                {#if landscape}
                    <input
                        title="行高, 默認56"
                        placeholder="行高"
                        type="number"
                        bind:value={row.landscapeHeight}
                        class="w-12 p-1 rounded-md bg-transparent hover:variant-ghost"
                        min="0"
                        max="128"
                    />
                {:else}
                    <input
                        title="行高, 默認56"
                        placeholder="行高"
                        type="number"
                        bind:value={row.rowHeight}
                        class="w-12 p-1 rounded-md bg-transparent hover:variant-ghost"
                        min="0"
                        max="128"
                    />
                {/if}
            </IconRange>
        {/each}
    </details>
</div>
