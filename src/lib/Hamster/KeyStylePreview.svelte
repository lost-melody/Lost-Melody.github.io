<script lang="ts">
    import type { ColorSchema, KeyStyle } from "./model/colorSchema";

    export var pressed: boolean = false;
    export var keyStyle: KeyStyle;
    export var colorSchema: ColorSchema;

    $: shadowSize = keyStyle.shadowSize >= 0 ? keyStyle.shadowSize * 2 : colorSchema.shadow_size * 2;
    $: shadowColor = (keyStyle.shadowColor.color && keyStyle.shadowColor.clone()) || colorSchema.shadow_color.clone();
    $: shadowColor.alpha = shadowColor.alpha / shadowSize;
</script>

<div class="variant-ringed h-[48px] w-[32px] pb-[4px] pl-[3px] pr-[3px] pt-[8px]">
    <!-- key -->
    <div
        style:border-radius={`${keyStyle.cornerRadius}px`}
        style:border-bottom-color={`${keyStyle.lowerEdgeColor.rgba() || colorSchema.lower_edge_color.rgba()}`}
        style:border-bottom-style="solid"
        style:border-bottom-width="1px"
        class="relative h-full w-full"
    >
        <div
            style:background-color={pressed
                ? keyStyle.pressedButtonBackgroundColor.rgba() || colorSchema.button_pressed_back_color.rgba()
                : keyStyle.buttonBackgroundColor.rgba() || colorSchema.button_back_color.rgba()}
            style:border-radius={`${keyStyle.cornerRadius >= 0 ? keyStyle.cornerRadius : colorSchema.corner_radius}px`}
            style:border-color={keyStyle.borderColor.rgba() || colorSchema.border_color.rgba()}
            style:border-width={`${keyStyle.borderSize >= 0 ? keyStyle.borderSize : colorSchema.border_size}px`}
            style:box-shadow={`0 ${shadowSize}px ${shadowSize}px ${shadowColor.rgba()}`}
            class="absolute h-full w-full rounded-md"
        >
            <!-- swipe up and down -->
            <div
                style:color={pressed
                    ? keyStyle.pressedSwipeForegroundColor.rgba() || colorSchema.button_swipe_pressed_front_color.rgba()
                    : keyStyle.swipeForegroundColor.rgba() || colorSchema.button_swipe_front_color.rgba()}
                style:font-size={`${keyStyle.swipeFontSize || 8}px`}
                style:line-height={`${(keyStyle.swipeFontSize || 8) + 2}px`}
                class="absolute top-0 flex w-full justify-around"
            >
                {#each ["up", "dn"] as swipe}
                    <span>
                        {swipe}
                    </span>
                {/each}
            </div>
            <!-- key action -->
            <div
                style:color={pressed
                    ? keyStyle.pressedButtonForegroundColor.rgba() || colorSchema.button_pressed_front_color.rgba()
                    : keyStyle.buttonForegroundColor.rgba() || colorSchema.button_front_color.rgba()}
                style:font-size={`${keyStyle.fontSize || 16}px`}
                style:line-height={`${(keyStyle.fontSize || 16) + 2}px`}
                class="absolute top-0 flex h-full w-full items-center justify-center"
            >
                c
            </div>
        </div>
    </div>
</div>
