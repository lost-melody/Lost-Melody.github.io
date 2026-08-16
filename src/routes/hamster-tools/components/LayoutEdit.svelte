<script lang="ts">
    import Icon from "@iconify/svelte";

    import { Key, Keyboard, Row } from "../model/keyboardLayout.svelte.ts";
    import IconButton from "$lib/components/IconButton.svelte";
    import IconRange from "$lib/components/IconRange.svelte";

    interface Props {
        landscape?: boolean;
        layout: Keyboard;
    }
    let { landscape = false, layout = $bindable() }: Props = $props();

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

<div class="preset-tonal flex w-full flex-col gap-2 rounded-md p-2">
    <!-- 佈局名稱 -->
    <div class="preset-outlined w-full rounded-md p-[0.5px]">
        <div class="flex w-full items-center">
            <div class="preset-outlined flex h-10 items-center rounded-tl-md px-2">
                <Icon icon="mdi:rename-box" />
            </div>
            <span class="preset-outlined flex h-10 shrink grow items-center px-2"> 佈局名稱 </span>
            <input
                title="鍵盤名稱"
                type="text"
                bind:value={layout.name}
                placeholder="天行鍵"
                class="preset-outlined hover:preset-tonal h-10 w-[50%] rounded-none rounded-tr-md px-2"
            />
        </div>
        <div class="flex w-full items-center">
            <div class="preset-outlined flex h-10 items-center rounded-bl-md px-2">
                <Icon icon={layout.primary ? "mdi:checkbox-marked-outline" : "mdi:checkbox-blank-outline"} />
            </div>
            <button
                class="preset-outlined hover:preset-tonal flex h-10 shrink grow items-center rounded-br-md p-2 active:scale-95"
                onclick={() => {
                    layout.primary = !layout.primary;
                }}
            >
                點擊切換: {layout.primary ? "主鍵盤" : "非主鍵盤"}
            </button>
        </div>
    </div>

    <!-- 編輯按鍵行數 -->
    <div class="preset-outlined w-full rounded-md p-[0.5px]">
        <IconRange
            icon="mdi:table-cog"
            title="按鍵行数"
            value={layout.rows.length}
            onchange={onRowCountChange}
            min="0"
            max="8"
            class="preset-outlined hover:preset-tonal flex h-10 items-center rounded-md px-2"
        />
    </div>

    <!-- 編輯每行按鍵數量 -->
    <div class="preset-outlined w-full rounded-md p-[0.5px]">
        <div class="preset-outlined rounded-md p-[0.5px]">
            {#each layout.rows as row, index (row.id)}
                <IconRange
                    icon="mdi:table-cog"
                    title="按鍵數量"
                    value={row.keys.length}
                    onchange={(event) => {
                        onRowKeysChange(event, index);
                    }}
                    min="0"
                    max="16"
                    r_tl={index === 0}
                    r_tr={index === 0}
                    r_bl={index === layout.rows.length - 1}
                    r_br={index === layout.rows.length - 1}
                    class="preset-outlined hover:preset-tonal flex h-10 items-center px-2"
                >
                    <span class="border-surface-500 flex h-10 shrink grow items-center border-r px-2">
                        {`第 ${index + 1} 行`}
                    </span>
                    <IconButton
                        icon="mdi:arrow-up"
                        title="整行按鍵上移"
                        onclick={() => {
                            moveRowUp(index);
                        }}
                        class="border-surface-500 hover:preset-tonal h-10 border-r px-2 active:scale-95 active:border-l"
                    />
                    <IconButton
                        icon="mdi:arrow-down"
                        title="整行按鍵下移"
                        onclick={() => {
                            moveRowDown(index);
                        }}
                        class="border-surface-500 hover:preset-tonal h-10 border-r px-2 active:scale-95 active:border-l"
                    />
                    {#if landscape}
                        <input
                            title="行高"
                            placeholder="行高"
                            type="number"
                            bind:value={row.landscapeHeight}
                            class="border-surface-500 hover:preset-tonal h-10 w-16 rounded-none border-r bg-transparent p-2"
                            min="0"
                            max="128"
                        />
                    {:else}
                        <input
                            title="行高"
                            placeholder="行高"
                            type="number"
                            bind:value={row.rowHeight}
                            class="border-surface-500 hover:preset-tonal h-10 w-16 rounded-none border-r bg-transparent p-2"
                            min="0"
                            max="128"
                        />
                    {/if}
                </IconRange>
            {/each}
        </div>
    </div>
</div>
