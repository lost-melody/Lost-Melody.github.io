<script lang="ts">
    // export var body: string;
    export var ordered: string;
    export var start: number;
</script>

{#if ordered}
    <ol class="ml-4" {start}>
        <slot />
    </ol>
{:else}
    <ul class="ml-4 list-disc">
        <slot />
    </ul>
{/if}
