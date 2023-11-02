<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";
    import type { ColorSchema } from "./model/colorSchema";
    import type { Keyboard } from "./model/keyboardLayout";
    import KeyPreview from "./KeyPreview.svelte";

    export var sticky: boolean = true;
    export var landscape: boolean = false;
    export var schema: ColorSchema;
    export var keyboard: Keyboard;

    export var selected: { row: number; col: number };

    const dispatch = createEventDispatcher();
    const onClick = (row: number, col: number) => {
        dispatch("clicked", { row, col });
    };
</script>

<div
    style:background-color={schema.back_color.rgba()}
    class="w-full rounded-md backdrop-blur"
>
    <!-- preedit -->
    <div class="w-full px-2">
        <span style:color={schema.text_color.rgba()} class="text-xs">
            shouxuan
        </span>
    </div>
    <!-- candidates -->
    <div class="w-full px-2 gap-2 flex items-center">
        {#each ["首選", "次選", "三選"] as cand, index}
            <span
                style:color={index === 0
                    ? schema.hilited_candidate_text_color.rgba()
                    : schema.candidate_text_color.rgba()}
                style:background-color={index === 0
                    ? schema.hilited_candidate_back_color.rgba()
                    : undefined}
                class="px-1 rounded-md text-lg"
            >
                {cand}
                <span
                    style:color={index === 0
                        ? schema.hilited_comment_text_color.rgba()
                        : schema.comment_text_color.rgba()}
                    class="text-xs"
                >
                    {["uzxr", "cixr", "sjxr"][index]}
                </span>
            </span>
        {/each}
        <span class="grow" />
        <button
            title={(landscape ? "預覽: 横屏" : "預覽: 竪屏") +
                "\n注: 行高和鍵寛的配置值在横竪屏模式下是各自獨立的"}
            on:click={() => {
                landscape = !landscape;
            }}
            style:color={schema.comment_text_color.rgba()}
        >
            <Icon
                height="20"
                icon={landscape ? "mdi:crop-landscape" : "mdi:crop-portrait"}
            />
        </button>
        <button
            title={sticky ? "已置頂" : "未置頂"}
            on:click={() => {
                sticky = !sticky;
            }}
            style:color={schema.comment_text_color.rgba()}
        >
            <Icon height="20" icon={sticky ? "mdi:pin" : "mdi:pin-off"} />
        </button>
    </div>
    <!-- keyboard layout -->
    {#each keyboard.rows as row, indexRow (row.id)}
        <div
            style:height={`${
                landscape ? row.landscapeHeight || 56 : row.rowHeight || 56
            }px`}
            class="w-full flex"
        >
            {#each row.keys as key, indexKey (key.id)}
                <KeyPreview
                    {landscape}
                    {schema}
                    {row}
                    {key}
                    insets={keyboard.buttonInsets}
                    selected={selected.row === indexRow &&
                        selected.col === indexKey}
                    on:clicked={() => {
                        onClick(indexRow, indexKey);
                    }}
                />
            {/each}
        </div>
    {/each}
</div>
