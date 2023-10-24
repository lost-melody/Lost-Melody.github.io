<script lang="ts">
    import type { Color } from "$lib/Hamster/Colors/HamsterColors";

    export var color: Color;
    export var title: string = "顔色";

    const [min, max, step] = [0, 0xff, 0x05];

    var typing = false;
    var before = "";
    const onTyping = () => {
        typing = true;
        before = color.color;
    };
    const postTyping = () => {
        typing = false;
        if (!/^#[0-9a-fA-F]{6}$/.test(color.color)) {
            color.color = before;
        }
    };
</script>

<div class="w-full gap-2 flex items-center">
    <input type="color" bind:value={color.color} class="w-10 h-10 input" />
    {#if typing}
        <!-- svelte-ignore a11y-autofocus -->
        <input
            type="text"
            bind:value={color.color}
            autofocus
            on:blur={postTyping}
            class="w-16 code"
        />
    {:else}
        <button on:click={onTyping} class="w-12 code">
            {color.color.slice(1).toUpperCase()}
        </button>
    {/if}
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
