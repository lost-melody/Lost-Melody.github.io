<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        task: boolean;
        checked: boolean;
        children?: Snippet;
    }
    let { task, checked, children }: Props = $props();
</script>

<li>
    {#if task}
        <span>
            <input type="checkbox" disabled {checked} class="checkbox" />
            <span>
                {@render children?.()}
            </span>
        </span>
    {:else}
        {@render children?.()}
    {/if}
</li>
