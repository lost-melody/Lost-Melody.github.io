<script lang="ts">
    import type { ColorSchema, KeyStyle } from "../model/colorSchema.svelte.ts";
    import { ActionType, ButtonInsets, Key, Row } from "../model/keyboardLayout.svelte.ts";

    interface Props {
        landscape?: boolean;
        schema: ColorSchema;
        row: Row;
        key: Key;
        insets: ButtonInsets;
        selected: boolean;
        keyStyle?: KeyStyle;
        coordinate: { row: number; col: number };
        previewWidth: number;
        onclicked?: () => void;
    }
    let {
        landscape = false,
        schema,
        row,
        key,
        insets,
        selected,
        keyStyle = undefined,
        coordinate,
        previewWidth,
        onclicked,
    }: Props = $props();

    const [holdNone, holdBubble, holdCallout] = [0, 1, 2];
    let holdState = $state(holdNone);
    let calloutSelectedIndex = $state(0);

    // 選擇狀態變更時, 重置長按預覽
    $effect(() => {
        if (!selected) {
            holdState = holdNone;
        }
    });

    // 按鍵内距样式
    let [pl, pb, pt, pr] = $derived(
        insets.expr ? insets.insets : [insets.value, insets.value, insets.value, insets.value],
    );
    let width = $derived(landscape ? (!key.autoLandscape && key.landscape) || 10 : (!key.autoWidth && key.width) || 10);
    let height = $derived(landscape ? row.landscapeHeight || 56 : row.rowHeight || 56);
    let grow = $derived(landscape ? key.autoLandscape : key.autoWidth);

    let bgColor = $derived((keyStyle && keyStyle.buttonBackgroundColor.rgba()) || schema.button_back_color.rgba());
    let pressedBgColor = $derived(
        (keyStyle && keyStyle.pressedButtonBackgroundColor.rgba()) || schema.button_pressed_back_color.rgba(),
    );
    let frontColor = $derived((keyStyle && keyStyle.buttonForegroundColor.rgba()) || schema.button_front_color.rgba());
    let pressedFrontColor = $derived(
        keyStyle ? keyStyle.pressedButtonForegroundColor.rgba() : schema.button_pressed_front_color.rgba(),
    );
    let swipeColor = $derived(
        (keyStyle && keyStyle.swipeForegroundColor.rgba()) || schema.button_swipe_front_color.rgba(),
    );
    let pressedSwipeColor = $derived(
        keyStyle ? keyStyle.pressedSwipeForegroundColor.rgba() : schema.button_swipe_pressed_front_color.rgba(),
    );
    let cornerRadius = $derived(keyStyle && keyStyle.cornerRadius >= 0 ? keyStyle.cornerRadius : schema.corner_radius);
    let borderWidth = $derived(keyStyle && keyStyle.borderSize >= 0 ? keyStyle.borderSize : schema.border_size);
    let borderColor = $derived((keyStyle && keyStyle.borderColor.rgba()) || schema.border_color.rgba());
    let bottomColor = $derived((keyStyle && keyStyle.lowerEdgeColor.rgba()) || schema.lower_edge_color.rgba());
    let shadowSize = $derived(keyStyle && keyStyle.shadowSize >= 0 ? keyStyle.shadowSize * 2 : schema.shadow_size * 2);
    let shadowColor = $derived.by(() => {
        const color = (keyStyle && keyStyle.shadowColor.clone()) || schema.shadow_color.clone();
        color.alpha = color.alpha / shadowSize;
        return color;
    });
    let swipeFont = $derived(keyStyle ? keyStyle.swipeFontSize : schema.swipe_font_size);
    let fontSize = $derived(keyStyle ? keyStyle.fontSize : schema.font_size);
    let bubbleColor = $derived(
        (keyStyle && keyStyle.buttonBubbleBackgroundColor.rgba()) || schema.button_bubble_back_color.rgba(),
    );
    let calloutColor = $derived(
        (keyStyle && keyStyle.actionCalloutBackgroundColor.rgba()) || schema.action_callout_back_color.rgba(),
    );
    let calloutSelected = $derived(
        keyStyle ? keyStyle.actionCalloutSelectedBackgroundColor.rgba() : schema.hilited_callout_back_color.rgba(),
    );
    let calloutSelectedFg = $derived(
        keyStyle
            ? keyStyle.actionCalloutSelectedForegroundColor.rgba()
            : schema.hilited_callout_foreground_color.rgba(),
    );

    let bgBtnDisplay = $derived(![ActionType.none, ActionType.characterMargin].includes(key.action.type));
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
                        calloutSelectedIndex = 0;
                        break;
                    }
                case holdCallout:
                    holdState = holdNone;
                    break;
            }
        } else {
            // 当前按键未被选中, 点击时发送事件
            onclicked?.();
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
        class="relative h-full w-full"
    >
        {#if holdState === holdBubble}
            <div
                class="absolute -top-11 flex h-10 min-w-10 items-center justify-center rounded-md px-2"
                class:left-0={coordinate.col < row.keys.length / 2}
                class:right-0={coordinate.col >= row.keys.length / 2}
                style:background-color={bubbleColor}
            >
                <div class="rounded-md px-2" style:color={pressedFrontColor}>
                    {key.label.text ? key.label.text : key.action.display()}
                </div>
            </div>
        {:else if holdState === holdCallout}
            <div
                class="absolute -top-11 flex h-10 min-w-10 items-center overflow-x-auto rounded-md px-2 text-nowrap"
                class:flex-row-reverse={coordinate.col >= row.keys.length / 2}
                class:left-0={coordinate.col < row.keys.length / 2}
                class:right-0={coordinate.col >= row.keys.length / 2}
                style:max-width={`${previewWidth >> 1}px`}
                style:background-color={calloutColor}
            >
                {#each key.callout as callout, index}
                    <button
                        class="rounded-md px-2"
                        style:background-color={index === calloutSelectedIndex ? calloutSelected : undefined}
                        style:color={index === calloutSelectedIndex
                            ? calloutSelectedFg
                            : schema.candidate_text_color.rgba()}
                        onclick={() => {
                            calloutSelectedIndex = index;
                        }}
                    >
                        {callout.label.text ? callout.label.text : callout.action.display()}
                    </button>
                {/each}
            </div>
        {/if}
        <button
            style:background-color={bgBtnDisplay ? (selected ? pressedBgColor : bgColor) : undefined}
            style:border-radius={`${cornerRadius}px`}
            style:border-color={borderColor}
            style:border-width={bgBtnDisplay ? `${borderWidth}px` : undefined}
            style:box-shadow={bgBtnDisplay ? `0 ${shadowSize}px ${shadowSize}px ${shadowColor.rgba()}` : undefined}
            class="absolute h-full w-full rounded-md"
            onclick={onClick}
        >
            <!-- swipe up and down -->
            <div
                style:color={selected ? pressedSwipeColor : swipeColor}
                style:font-size={`${swipeFont || 8}px`}
                style:line-height={`${(swipeFont || 8) + 2}px`}
                class="absolute top-0 flex w-full justify-around"
            >
                {#each [key.swipe[2], key.swipe[1]] as swipe}
                    {#if swipe.action.type !== ActionType.none && swipe.display}
                        <span>
                            {swipe.label.text ? swipe.label.text : swipe.action.display()}
                        </span>
                    {/if}
                {/each}
            </div>
            <!-- key action -->
            <div
                style:color={selected ? pressedFrontColor : frontColor}
                style:font-size={`${fontSize || 16}px`}
                style:line-height={`${(swipeFont || 16) + 2}px`}
                class="absolute top-0 flex h-full w-full items-center justify-center"
            >
                <span> {key.label.text ? key.label.text : key.action.display()} </span>
            </div>
        </button>
    </div>
</div>
