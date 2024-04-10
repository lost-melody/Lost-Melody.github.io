<script lang="ts">
    import type { KeyStyle } from "./model/colorSchema";

    export var pressed: boolean = false;
    export var keyStyle: KeyStyle;

    $: shadowSize = keyStyle.shadowSize * 2;
    $: shadowColor = keyStyle.shadowColor.clone();
    $: shadowColor.alpha = shadowColor.alpha / (shadowSize || 2);
</script>

<div class="w-[32px] h-[48px] pt-[8px] pb-[4px] pl-[3px] pr-[3px] variant-ringed">
    <!-- key -->
    <div
        style:border-radius={`${keyStyle.cornerRadius}px`}
        style:border-bottom-color={`${keyStyle.lowerEdgeColor.rgba()}`}
        style:border-bottom-style="solid"
        style:border-bottom-width="1px"
        class="w-full h-full relative"
    >
        <div
            style:background-color={pressed
                ? keyStyle.pressedButtonBackgroundColor.rgba()
                : keyStyle.buttonBackgroundColor.rgba()}
            style:border-radius={`${keyStyle.cornerRadius}px`}
            style:border-color={keyStyle.borderColor.rgba()}
            style:border-width={`${keyStyle.borderSize}px`}
            style:box-shadow={`0 ${shadowSize}px ${shadowSize}px ${shadowColor.rgba()}`}
            class="w-full h-full rounded-md absolute"
        >
            <!-- swipe up and down -->
            <div
                style:color={pressed
                    ? keyStyle.pressedSwipeForegroundColor.rgba()
                    : keyStyle.swipeForegroundColor.rgba()}
                style:font-size={`${keyStyle.swipeFontSize || 8}px`}
                style:line-height={`${(keyStyle.swipeFontSize || 8) + 2}px`}
                class="w-full absolute top-0 flex justify-around"
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
                    ? keyStyle.pressedButtonForegroundColor.rgba()
                    : keyStyle.buttonForegroundColor.rgba()}
                style:font-size={`${keyStyle.fontSize || 16}px`}
                style:line-height={`${(keyStyle.fontSize || 16) + 2}px`}
                class="w-full h-full absolute top-0 flex items-center justify-center"
            >
                c
            </div>
        </div>
    </div>
</div>
