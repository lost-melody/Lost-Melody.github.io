<script lang="ts">
    import type { KeyStyle } from "./model/colorSchema";

    export var pressed: boolean = false;
    export var keyStyle: KeyStyle;
</script>

<div style:padding="8px 3px 4px 3px" style:width="32px" style:height="48px">
    <!-- key -->
    <div
        style:background-color={pressed
            ? keyStyle.pressedButtonBackgroundColor.rgba()
            : keyStyle.buttonBackgroundColor.rgba()}
        style:border-radius={`${keyStyle.cornerRadius || 5}px`}
        style:border-color={keyStyle.borderColor.rgba()}
        style:border-width={`${keyStyle.borderSize}px`}
        style:box-shadow={`0 3px 3px -3px ${keyStyle.lowerEdgeColor.rgba()}`}
        class="w-full h-full border rounded-md relative"
    >
        <!-- swipe up and down -->
        <div
            style:color={pressed ? keyStyle.pressedSwipeForegroundColor.rgba() : keyStyle.swipeForegroundColor.rgba()}
            style:font-size={`${keyStyle.swipeFontSize || 8}px`}
            class="w-full h-[20%] absolute -top-2 flex justify-around"
        >
            {#each ["up", "dn"] as swipe}
                <span>
                    {swipe}
                </span>
            {/each}
        </div>
        <!-- key action -->
        <div
            style:color={pressed ? keyStyle.pressedButtonForegroundColor.rgba() : keyStyle.buttonForegroundColor.rgba()}
            style:font-size={`${keyStyle.fontSize || 16}px`}
            class="w-full h-[80%] absolute top-[20%] text-center"
        >
            c
        </div>
    </div>
</div>
