<script lang="ts">
    export var text: string;
    export const raw: string = "";
    export var lang: string;
</script>

<pre title={lang} class="variant-soft pre rounded-md p-2 text-sm">{#if text}{text}{:else}<slot />{/if}</pre>
