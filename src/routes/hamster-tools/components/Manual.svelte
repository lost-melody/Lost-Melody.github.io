<script lang="ts">
    import Markdown from "$lib/components/Markdown.svelte";
    import manual from "$lib/assets/hamster-tools/manual.md?raw";
</script>

<div class="preset-tonal rounded-md p-2">
    <Markdown source={manual} />
</div>
