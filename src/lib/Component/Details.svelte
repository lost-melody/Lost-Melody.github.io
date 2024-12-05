<script lang="ts">
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";

    export var open: boolean = false;
    export var summary: string = "";

    var height = tweened(0, {
        easing: cubicOut,
    });
</script>

<div style={`height: ${$height}px`} class="variant-ringed w-full overflow-y-hidden rounded-md p-[0.5px]">
    <details bind:clientHeight={$height} bind:open {...$$restProps}>
        <summary
            class="variant-ringed flex items-center rounded-t-md pl-2 hover:variant-ghost"
            class:rounded-b-md={!open}
            class:variant-ghost={open}
        >
            <slot name="summary">
                <span class="flex h-10 items-center pr-2"> {summary} </span>
            </slot>
        </summary>
        <slot />
    </details>
</div>
