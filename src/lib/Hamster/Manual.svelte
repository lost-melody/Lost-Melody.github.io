<script lang="ts">
    import Markdown from "$lib/Component/Markdown.svelte";
    import manual from "$lib/assets/hamster-tools/manual.md?raw";
</script>

<div class="variant-soft rounded-md p-2">
    <Markdown source={manual} />
</div>
