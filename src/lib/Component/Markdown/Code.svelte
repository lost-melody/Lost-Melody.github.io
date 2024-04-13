<script lang="ts">
    export var text: string;
    export const raw: string = "";
    export var lang: string;
</script>

<pre title={lang} class="p-2 pre text-sm rounded-md variant-soft">{#if text}{text}{:else}<slot />{/if}</pre>
