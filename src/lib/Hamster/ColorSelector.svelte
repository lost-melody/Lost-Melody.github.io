<script lang="ts">
    import { getContext } from "svelte";
    import { type Writable } from "svelte/store";
    import type { Color } from "./model/colorSchema";

    export var color: Color;
    export var title: string = "顔色";
    export var allowEmpty: boolean = false;

    const [min, max, step] = [0, 0xff, 0x05];
    const preferAbgr: Writable<boolean> = getContext("prefer-abgr");

    const reverse = (c: string) => {
        const r = /^#?(\w{2})(\w{2})(\w{2})$/;
        var s = c.match(r)?.slice(1, 4).reverse().join("");
        return s || "";
    };
    var abgr: string = reverse(color.color); // 使用 abgr 格式而不是 rgba 格式

    var typing = false;
    var before = "";
    const onTyping = () => {
        typing = true;
        before = color.color;
        abgr = reverse(color.color);
    };
    const postTyping = () => {
        typing = false;
        if ($preferAbgr) {
            color.color = "#" + reverse(abgr);
        } else {
            abgr = reverse(color.color);
        }
        if (allowEmpty && !color.color) {
            return;
        }
        if (!/^#[0-9a-fA-F]{6}$/.test(color.color)) {
            color.color = before;
        }
    };
</script>

<div class="w-full gap-2 flex items-center">
    <span class="px-2 py-1 flex items-center">
        <input type="color" bind:value={color.color} class="input !w-6 !h-6 !rounded-sm" />
    </span>
    {#if typing}
        <!-- svelte-ignore a11y-autofocus -->
        {#if $preferAbgr}
            <input type="text" bind:value={abgr} autofocus on:blur={postTyping} class="w-16 code" />
        {:else}
            <input type="text" bind:value={color.color} autofocus on:blur={postTyping} class="w-16 code" />
        {/if}
    {:else}
        <button on:click={onTyping} class="w-12 code">
            {($preferAbgr ? abgr : color.color).replace(/^#/, "").toUpperCase() || "-"}
        </button>
    {/if}
    <span class="grow shrink"> {title} </span>
    <input type="range" {min} {max} {step} bind:value={color.alpha} class="w-[30%]" />
    <span class="w-6 code"> {color.alpha.toString(16).toUpperCase()} </span>
</div>
