<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ColorSchema } from "./model/colorSchema";
    import { ActionType, ButtonInsets, Key, Row } from "./model/keyboardLayout";

    export var landscape: boolean;
    export var schema: ColorSchema;
    export var row: Row;
    export var key: Key;
    export var insets: ButtonInsets;
    export var selected: boolean;

    // 按鍵内距样式
    var pl: number, pb: number, pt: number, pr: number;
    $: if (insets.expr) {
        [pl, pb, pt, pr] = insets.insets;
    } else {
        let p = insets.value;
        [pl, pb, pt, pr] = [p, p, p, p];
    }

    const bgBtnDisplay = (actionType: ActionType): boolean => {
        return ![ActionType.none, ActionType.characterMargin].includes(
            actionType,
        );
    };
    const dispatch = createEventDispatcher();
    const onClick = () => {
        dispatch("clicked");
    };
</script>

<!-- key outer border -->
<div
    style:padding={`${pt}px ${pr}px ${pb}px ${pl}px`}
    style:width={`${
        landscape
            ? key.autoLandscape
                ? 10
                : key.landscape
            : key.autoWidth
              ? 10
              : key.width
    }%`}
    style:height={`${
        landscape ? row.landscapeHeight || 56 : row.rowHeight || 56
    }px`}
    style:border-color={`${schema.border_color.rgba()}`}
    class:grow={landscape ? key.autoLandscape : key.autoWidth}
    class:shrink={landscape ? key.autoLandscape : key.autoWidth}
    class:shrink-0={landscape ? !key.autoLandscape : !key.autoWidth}
>
    <!-- key -->
    <button
        style:background-color={bgBtnDisplay(key.action.type)
            ? selected
                ? schema.button_pressed_back_color.rgba()
                : schema.button_back_color.rgba()
            : undefined}
        style:border-radius={`${schema.corner_radius}px`}
        style:border-color={`${schema.border_color.rgba()}`}
        class:border={bgBtnDisplay(key.action.type)}
        class="w-full h-full rounded-md relative"
        on:click={onClick}
    >
        <!-- swipe up and down -->
        <div
            style:color={schema.button_swipe_front_color.rgba()}
            style:font-size={`${schema.swipe_font_size || 8}px`}
            class="w-full h-[20%] absolute -top-2 flex justify-around"
        >
            {#each [key.swipe[2], key.swipe[1]] as swipe}
                {#if swipe.action.type !== ActionType.none && swipe.display}
                    <span>
                        {swipe.label ? swipe.label : swipe.action.display()}
                    </span>
                {/if}
            {/each}
        </div>
        <!-- key action -->
        <div
            style:color={selected
                ? schema.button_pressed_front_color.rgba()
                : schema.button_front_color.rgba()}
            style:font-size={`${schema.font_size || 16}px`}
            class="w-full h-[80%] absolute top-[20%] text-center"
        >
            {key.label ? key.label : key.action.display()}
        </div>
    </button>
</div>
