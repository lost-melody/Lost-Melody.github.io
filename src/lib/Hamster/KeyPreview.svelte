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
    export var coordinate: { row: number; col: number };
    export var previewWidth: number;

    const [holdNone, holdBubble, holdCallout] = [0, 1, 2];
    var holdState = holdNone;
    $: if (!selected) {
        holdState = holdNone;
    }

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

    $: bgColor = (keyStyle && keyStyle.buttonBackgroundColor.rgba()) || schema.button_back_color.rgba();
    $: pressedBgColor =
        (keyStyle && keyStyle.pressedButtonBackgroundColor.rgba()) || schema.button_pressed_back_color.rgba();
    $: frontColor = (keyStyle && keyStyle.buttonForegroundColor.rgba()) || schema.button_front_color.rgba();
    $: pressedFrontColor = keyStyle
        ? keyStyle.pressedButtonForegroundColor.rgba()
        : schema.button_pressed_front_color.rgba();
    $: swipeColor = (keyStyle && keyStyle.swipeForegroundColor.rgba()) || schema.button_swipe_front_color.rgba();
    $: pressedSwipeColor = keyStyle
        ? keyStyle.pressedSwipeForegroundColor.rgba()
        : schema.button_swipe_pressed_front_color.rgba();
    $: cornerRadius = keyStyle && keyStyle.cornerRadius >= 0 ? keyStyle.cornerRadius : schema.corner_radius;
    $: borderWidth = keyStyle && keyStyle.borderSize >= 0 ? keyStyle.borderSize : schema.border_size;
    $: borderColor = (keyStyle && keyStyle.borderColor.rgba()) || schema.border_color.rgba();
    $: bottomColor = (keyStyle && keyStyle.lowerEdgeColor.rgba()) || schema.lower_edge_color.rgba();
    $: shadowSize = keyStyle && keyStyle.shadowSize >= 0 ? keyStyle.shadowSize * 2 : schema.shadow_size * 2;
    $: shadowColor = (keyStyle && keyStyle.shadowColor.clone()) || schema.shadow_color.clone();
    $: shadowColor.alpha = shadowColor.alpha / shadowSize;
    $: swipeFont = keyStyle ? keyStyle.swipeFontSize : schema.swipe_font_size;
    $: fontSize = keyStyle ? keyStyle.fontSize : schema.font_size;
    $: bubbleColor =
        (keyStyle && keyStyle.buttonBubbleBackgroundColor.rgba()) || schema.button_bubble_back_color.rgba();
    $: calloutColor =
        (keyStyle && keyStyle.actionCalloutBackgroundColor.rgba()) || schema.action_callout_back_color.rgba();
    $: calloutSelected = keyStyle
        ? keyStyle.actionCalloutSelectedBackgroundColor.rgba()
        : schema.hilited_callout_back_color.rgba();
    $: calloutSelectedFg = keyStyle
        ? keyStyle.actionCalloutSelectedForegroundColor.rgba()
        : schema.hilited_callout_foreground_color.rgba();

    $: bgBtnDisplay = ![ActionType.none, ActionType.characterMargin].includes(key.action.type);
    const dispatch = createEventDispatcher();
    const onClick = () => {
        if (selected) {
            // 当前按键已选中时, 再次点击切换长按预览
            switch (holdState) {
                case holdNone:
                    holdState = holdBubble;
                    break;
                case holdBubble:
                    if (key.callout.length) {
                        holdState = holdCallout;
                        break;
                    }
                case holdCallout:
                    holdState = holdNone;
                    break;
            }
        } else {
            // 当前按键未被选中, 点击时发送事件
            dispatch("clicked");
        }
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
        class="w-full h-full relative"
    >
        {#if holdState === holdBubble}
            <div
                class="h-10 px-1 min-w-10 flex items-center justify-center rounded-md absolute -top-11"
                class:left-0={coordinate.col < row.keys.length / 2}
                class:right-0={coordinate.col >= row.keys.length / 2}
                style:background-color={bubbleColor}
            >
                <div class="px-1 rounded-md" style:color={pressedFrontColor}>
                    {key.label ? key.label : key.action.display()}
                </div>
            </div>
        {:else if holdState === holdCallout}
            <div
                class="h-10 px-1 min-w-10 text-nowrap flex items-center rounded-md absolute -top-11 overflow-x-auto"
                class:flex-row-reverse={coordinate.col >= row.keys.length / 2}
                class:left-0={coordinate.col < row.keys.length / 2}
                class:right-0={coordinate.col >= row.keys.length / 2}
                style:max-width={`${previewWidth >> 1}px`}
                style:background-color={calloutColor}
            >
                {#each key.callout as callout, index}
                    <div
                        class="px-1 rounded-md"
                        style:background-color={index === 0 ? calloutSelected : undefined}
                        style:color={index === 0 ? calloutSelectedFg : schema.candidate_text_color.rgba()}
                    >
                        {callout.label ? callout.label : callout.action.display()}
                    </div>
                {/each}
            </div>
        {/if}
        <button
            style:background-color={bgBtnDisplay ? (selected ? pressedBgColor : bgColor) : undefined}
            style:border-radius={`${cornerRadius}px`}
            style:border-color={borderColor}
            style:border-width={bgBtnDisplay ? `${borderWidth}px` : undefined}
            style:box-shadow={bgBtnDisplay ? `0 ${shadowSize}px ${shadowSize}px ${shadowColor.rgba()}` : undefined}
            class="w-full h-full rounded-md absolute"
            on:click={onClick}
        >
            <!-- swipe up and down -->
            <div
                style:color={selected ? pressedSwipeColor : swipeColor}
                style:font-size={`${swipeFont || 8}px`}
                style:line-height={`${(swipeFont || 8) + 2}px`}
                class="w-full absolute top-0 flex justify-around"
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
                style:line-height={`${(swipeFont || 16) + 2}px`}
                class="w-full h-full absolute top-0 flex items-center justify-center"
            >
                <span> {key.label ? key.label : key.action.display()} </span>
            </div>
        </button>
    </div>
</div>
