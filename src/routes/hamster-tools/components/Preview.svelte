<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import Icon from "@iconify/svelte";
    import type { ColorSchema, KeyStyle } from "../model/colorSchema.svelte.ts";
    import type { Keyboard } from "../model/keyboardLayout.svelte.ts";
    import KeyPreview from "./KeyPreview.svelte";

    interface Props {
        sticky?: boolean;
        landscape?: boolean;
        schema: ColorSchema;
        keyboard: Keyboard;
        keyStyleMap?: { [name: string]: KeyStyle };
        selected: { row: number; col: number };
        onclicked?: (detail: { row: number; col: number }) => void;
        onsticky?: () => void;
    }
    let {
        sticky = true,
        landscape = $bindable(),
        schema,
        keyboard,
        keyStyleMap = {},
        selected,
        onclicked,
        onsticky,
    }: Props = $props();

    let darkMode: Writable<boolean> = getContext("darkMode");
    let previewWidth = $state(0);

    const onClick = (row: number, col: number) => {
        onclicked?.({ row, col });
    };
    const onStickyClick = () => {
        onsticky?.();
    };
</script>

<div
    bind:clientWidth={previewWidth}
    style:background-color={schema.back_color.rgba()}
    class="w-full rounded-md backdrop-blur"
>
    <!-- preedit -->
    <div class="w-full px-2">
        <span style:color={schema.text_color.rgba()} class="px-1 text-xs"> lleiu </span>
    </div>
    <!-- candidates -->
    <div class="flex w-full items-center gap-1 px-2 text-sm">
        {#each ["卢老师", "罗老师", "罗利市"] as cand, index}
            <span
                style:color={index === 0
                    ? schema.hilited_candidate_text_color.rgba()
                    : schema.candidate_text_color.rgba()}
                style:background-color={index === 0 ? schema.hilited_candidate_back_color.rgba() : undefined}
                class="text-md rounded-md px-1 text-nowrap"
            >
                <span
                    style:color={index == 0 ? schema.hilited_candidate_label_color.rgba() : schema.label_color.rgba()}
                >
                    {index + 1}.
                </span>
                {cand}
                <span
                    style:color={index === 0
                        ? schema.hilited_comment_text_color.rgba()
                        : schema.comment_text_color.rgba()}
                    class="text-xs"
                >
                    {["lleiu", "lleiui", "lleiuo"][index]}
                </span>
            </span>
        {/each}
        <span class="grow"></span>
        <button
            title={(landscape ? "預覽: 横屏" : "預覽: 竪屏") + "\n注: 行高和鍵寛的配置值在横竪屏模式下是各自獨立的"}
            onclick={() => {
                landscape = !landscape;
            }}
            style:color={schema.comment_text_color.rgba()}
        >
            <Icon height="20" icon={landscape ? "mdi:crop-landscape" : "mdi:crop-portrait"} />
        </button>
        <button
            title={sticky ? "取消置頂" : "置頂預覽"}
            onclick={onStickyClick}
            style:color={schema.comment_text_color.rgba()}
        >
            <Icon height="20" icon={sticky ? "mdi:pin" : "mdi:pin-off"} />
        </button>
    </div>
    <!-- keyboard layout -->
    {#each keyboard.rows as row, indexRow (row.id)}
        <div style:height={`${landscape ? row.landscapeHeight || 56 : row.rowHeight || 56}px`} class="flex w-full">
            {#each row.keys as key, indexKey (key.id)}
                <KeyPreview
                    {landscape}
                    {schema}
                    {row}
                    {key}
                    keyStyle={keyStyleMap[$darkMode ? key.darkStyle : key.lightStyle]}
                    insets={keyboard.buttonInsets}
                    selected={selected.row === indexRow && selected.col === indexKey}
                    coordinate={selected}
                    {previewWidth}
                    onclicked={() => {
                        onClick(indexRow, indexKey);
                    }}
                />
            {/each}
        </div>
    {/each}
</div>
