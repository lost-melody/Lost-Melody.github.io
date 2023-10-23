<script lang="ts">
    import type { Color } from "$lib/Hamster/Colors/HamsterColors";

    export var color: Color;
    export var title: string = "顔色";

    const [min, max, step] = [0, 0xff, 0x05];
</script>

<div class="w-full gap-2 flex items-center">
    <input type="color" bind:value={color.color} class="w-10 h-10 input" />
    <span class="w-18 code"> {color.color.slice(1)} </span>
    <span class="grow shrink"> {title} </span>
    <input
        type="range"
        {min}
        {max}
        {step}
        bind:value={color.alpha}
        class="w-[30%]"
    />
    <span class="w-6 code"> {color.alpha.toString(16).toUpperCase()} </span>
</div>
