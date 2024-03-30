<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ColorSchema, KeyStyle } from "./model/colorSchema";
    import { ActionType, ButtonInsets, Key, Row } from "./model/keyboardLayout";

    export var landscape: boolean;
    export var schema: ColorSchema;
    export var row: Row;
    export var key: Key;
    export var insets: ButtonInsets;
    export var selected: boolean;
    export var keyStyle: KeyStyle | undefined = undefined;

    // 按鍵内距样式
    var pl: number, pb: number, pt: number, pr: number;
    $: if (insets.expr) {
        [pl, pb, pt, pr] = insets.insets;
    } else {
        let p = insets.value;
        [pl, pb, pt, pr] = [p, p, p, p];
    }
    $: width = landscape ? (!key.autoLandscape && key.landscape) || 10 : (!key.autoWidth && key.width) || 10;
    $: height = landscape ? row.landscapeHeight || 56 : row.rowHeight || 56;
    $: grow = landscape ? key.autoLandscape : key.autoWidth;

    $: bgColor = keyStyle ? keyStyle.buttonBackgroundColor.rgba() : schema.button_back_color.rgba();
    $: pressedBgColor = keyStyle
        ? keyStyle.pressedButtonBackgroundColor.rgba()
        : schema.button_pressed_back_color.rgba();
    $: frontColor = keyStyle ? keyStyle.buttonForegroundColor.rgba() : schema.button_front_color.rgba();
    $: pressedFrontColor = keyStyle
        ? keyStyle.pressedButtonForegroundColor.rgba()
        : schema.button_pressed_front_color.rgba();
    $: swipeColor = keyStyle ? keyStyle.swipeForegroundColor.rgba() : schema.button_swipe_front_color.rgba();
    $: pressedSwipeColor = keyStyle
        ? keyStyle.pressedSwipeForegroundColor.rgba()
        : schema.button_swipe_pressed_front_color.rgba();
    $: cornerRadius = keyStyle ? keyStyle.cornerRadius : schema.corner_radius;
    $: borderWidth = keyStyle ? keyStyle.borderSize : 1;
    $: borderColor = keyStyle ? keyStyle.borderColor.rgba() : schema.border_color.rgba();
    $: bottomColor = keyStyle ? keyStyle.lowerEdgeColor.rgba() : schema.lower_edge_color.rgba();
    $: shadowSize = keyStyle ? keyStyle.shadowSize * 2 : schema.shadow_size * 2;
    $: shadowColor = keyStyle ? keyStyle.shadowColor.clone() : schema.shadow_color.clone();
    $: shadowColor.alpha = shadowColor.alpha / (shadowSize || 2);
    $: swipeFont = keyStyle ? keyStyle.swipeFontSize : schema.swipe_font_size;
    $: fontSize = keyStyle ? keyStyle.fontSize : schema.font_size;

    $: bgBtnDisplay = ![ActionType.none, ActionType.characterMargin].includes(key.action.type);
    const dispatch = createEventDispatcher();
    const onClick = () => {
        dispatch("clicked");
    };
</script>

<!-- key outer border -->
<div
    style:padding={`${pt}px ${pr}px ${pb}px ${pl}px`}
    style:width={`${width}%`}
    style:height={`${height}px`}
    class:grow
    class:shrink={grow}
    class:shrink-0={!grow}
>
    <!-- key -->
    <div
        style:border-radius={`${cornerRadius}px`}
        style:border-bottom-color={bottomColor}
        style:border-bottom-style="solid"
        style:border-bottom-width={bgBtnDisplay ? "1px" : undefined}
        class="w-full h-full"
    >
        <button
            style:background-color={bgBtnDisplay ? (selected ? pressedBgColor : bgColor) : undefined}
            style:border-radius={`${cornerRadius}px`}
            style:border-color={borderColor}
            style:border-width={bgBtnDisplay ? `${borderWidth}px` : undefined}
            style:box-shadow={bgBtnDisplay ? `0 ${shadowSize}px ${shadowSize}px ${shadowColor.rgba()}` : undefined}
            class="w-full h-full rounded-md relative"
            on:click={onClick}
        >
            <!-- swipe up and down -->
            <div
                style:color={selected ? pressedSwipeColor : swipeColor}
                style:font-size={`${swipeFont || 6}px`}
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
                style:color={selected ? pressedFrontColor : frontColor}
                style:font-size={`${fontSize || 16}px`}
                class="w-full h-[80%] absolute top-[20%] text-center"
            >
                {key.label ? key.label : key.action.display()}
            </div>
        </button>
    </div>
</div>
