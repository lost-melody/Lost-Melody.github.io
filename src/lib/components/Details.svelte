<script lang="ts">
    import type { Snippet } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";

    interface Props {
        snip_default?: Snippet;
        snip_summary?: Snippet;
        open?: boolean;
        summary?: string;
    }
    let { snip_default, snip_summary, open = false, summary = "" }: Props = $props();

    var height = tweened(0, {
        easing: cubicOut,
    });
</script>

<div style={`height: ${$height}px`} class="preset-outlined w-full overflow-y-hidden rounded-md p-[0.5px]">
    <details bind:clientHeight={$height} bind:open>
        <summary
            class="preset-outlined hover:preset-tonal flex items-center rounded-t-md pl-2"
            class:rounded-b-md={!open}
            class:preset-tonal={open}
        >
            {#if snip_summary}
                {@render snip_summary()}
            {:else}
                <span class="flex h-10 items-center pr-2"> {summary} </span>
            {/if}
        </summary>
        {@render snip_default?.()}
    </details>
</div>
