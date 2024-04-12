<script lang="ts">
    export var text: string;
    export var level: number;
    // export var raw: string;
</script>

{#if level === 1}
    <h1 class="h1">{text}</h1>
{:else if level === 2}
    <h2 class="h2">{text}</h2>
{:else if level === 3}
    <h3 class="h3">{text}</h3>
{:else if level === 4}
    <h4 class="h4">{text}</h4>
{:else if level === 5}
    <h5 class="h5">{text}</h5>
{:else if level === 6}
    <h6 class="h6">{text}</h6>
{:else}
    <span>{text}</span>
{/if}
