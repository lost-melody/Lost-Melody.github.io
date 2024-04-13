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

<div class="w-full p-2 gap-2 flex flex-col rounded-md variant-soft">
    <!-- 佈局名稱 -->
    <div class="w-full p-[0.5px] rounded-md variant-ringed">
        <div class="w-full flex items-center">
            <div class="h-10 px-2 flex items-center rounded-tl-md variant-ringed">
                <Icon icon="mdi:rename-box" />
            </div>
            <span class="h-10 px-2 flex items-center grow shrink variant-ringed"> 佈局名稱 </span>
            <input
                title="鍵盤名稱"
                type="text"
                bind:value={layout.name}
                placeholder="天行鍵"
                class="w-[50%] h-10 px-2 rounded-none rounded-tr-md variant-ringed hover:variant-ghost"
            />
        </div>
        <div class="w-full flex items-center">
            <div class="h-10 px-2 flex items-center rounded-bl-md variant-ringed">
                <Icon icon={layout.primary ? "mdi:checkbox-marked-outline" : "mdi:checkbox-blank-outline"} />
            </div>
            <button
                class="h-10 p-2 flex grow shrink items-center rounded-br-md variant-ringed hover:variant-ghost active:scale-95"
                on:click={() => {
                    layout.primary = !layout.primary;
                }}
            >
                點擊切換: {layout.primary ? "主鍵盤" : "非主鍵盤"}
            </button>
        </div>
    </div>

    <!-- 編輯按鍵行數 -->
    <div class="w-full p-[0.5px] rounded-md variant-ringed">
        <IconRange
            icon="mdi:table-cog"
            title="按鍵行数"
            value={layout.rows.length}
            on:change={onRowCountChange}
            min="0"
            max="8"
            class="h-10 px-2 flex items-center rounded-md variant-ringed hover:variant-ghost"
        />
    </div>

    <!-- 編輯每行按鍵數量 -->
    <div class="w-full p-[0.5px] rounded-md variant-ringed">
        <div class="p-[0.5px] rounded-md variant-ringed">
            {#each layout.rows as row, index (row.id)}
                <IconRange
                    icon="mdi:table-cog"
                    title="按鍵數量"
                    value={row.keys.length}
                    on:change={(event) => {
                        onRowKeysChange(event, index);
                    }}
                    min="0"
                    max="16"
                    r_tl={index === 0}
                    r_tr={index === 0}
                    r_bl={index === layout.rows.length - 1}
                    r_br={index === layout.rows.length - 1}
                    class="h-10 px-2 flex items-center variant-ringed hover:variant-ghost"
                >
                    <span class="h-10 px-2 grow shrink flex border-surface-500 border-r items-center">
                        {`第 ${index + 1} 行`}
                    </span>
                    <IconButton
                        icon="mdi:arrow-up"
                        title="整行按鍵上移"
                        on:click={() => {
                            moveRowUp(index);
                        }}
                        class="h-10 px-2 border-surface-500 border-r hover:variant-ghost active:scale-95 active:border-l"
                    />
                    <IconButton
                        icon="mdi:arrow-down"
                        title="整行按鍵下移"
                        on:click={() => {
                            moveRowDown(index);
                        }}
                        class="h-10 px-2 border-surface-500 border-r hover:variant-ghost active:scale-95 active:border-l"
                    />
                    {#if landscape}
                        <input
                            title="行高"
                            placeholder="行高"
                            type="number"
                            bind:value={row.landscapeHeight}
                            class="w-16 h-10 p-2 rounded-none bg-transparent border-surface-500 border-r hover:variant-ghost"
                            min="0"
                            max="128"
                        />
                    {:else}
                        <input
                            title="行高"
                            placeholder="行高"
                            type="number"
                            bind:value={row.rowHeight}
                            class="w-16 h-10 p-2 rounded-none bg-transparent border-surface-500 border-r hover:variant-ghost"
                            min="0"
                            max="128"
                        />
                    {/if}
                </IconRange>
            {/each}
        </div>
    </div>
</div>
