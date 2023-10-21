<script lang="ts">
    import type { Color } from "$lib/Hamster/Colors/HamsterColors";

    export var color: Color;
    export var title: string = "顔色";

    const [min, max, step] = [0, 1, 0.05];
</script>

<div class="w-full gap-2 flex items-center">
    <input type="color" bind:value={color.color} class="input" />
    <span class="grow shrink"> {title} </span>
    <input
        type="range"
        {min}
        {max}
        {step}
        bind:value={color.alpha}
        class="w-[30%]"
    />
    <span class="w-8"> {color.alpha} </span>
</div>
