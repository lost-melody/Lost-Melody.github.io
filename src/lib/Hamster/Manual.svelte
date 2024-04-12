<script lang="ts">
    import Markdown from "$lib/Component/Markdown.svelte";
    import manual from "$lib/assets/hamster-tools/manual.md?raw";
</script>

<div class="p-2 rounded-md variant-soft">
    <Markdown source={manual} />
</div>
