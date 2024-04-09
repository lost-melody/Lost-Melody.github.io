<script lang="ts">
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";

    export var open: boolean = false;
    export var summary: string = "";

    var height = tweened(0, {
        easing: cubicOut,
    });
</script>

<div style={`height: ${$height}px`} class="p-[0.5px] w-full rounded-md variant-ringed overflow-y-hidden">
    <details bind:clientHeight={$height} bind:open {...$$restProps}>
        <summary
            class="pl-2 flex items-center rounded-t-md variant-ringed hover:variant-ghost"
            class:rounded-b-md={!open}
            class:variant-ghost={open}
        >
            <slot name="summary">
                <span class="h-10 pr-2 flex items-center"> {summary} </span>
            </slot>
        </summary>
        <slot />
    </details>
</div>
