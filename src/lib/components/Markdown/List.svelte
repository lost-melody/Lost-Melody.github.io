<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        ordered: boolean;
        start: number;
        children?: Snippet;
    }
    let { ordered, start, children }: Props = $props();
</script>

{#if ordered}
    <ol class="ml-4" {start}>
        {@render children?.()}
    </ol>
{:else}
    <ul class="ml-4 list-disc">
        {@render children?.()}
    </ul>
{/if}
