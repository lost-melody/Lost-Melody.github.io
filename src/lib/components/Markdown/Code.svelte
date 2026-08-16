<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        text: string;
        lang: string;
        children?: Snippet;
    }
    let { text, lang, children }: Props = $props();
</script>

<pre title={lang} class="preset-tonal pre rounded-md p-2 text-sm">
    {#if text}{text}{:else}{@render children?.()}{/if}
</pre>
