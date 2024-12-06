<script lang="ts">
    import { ImageAlbum } from "./models";

    interface Props {
        album: ImageAlbum;
    }
    let { album = $bindable() }: Props = $props();
</script>

<div class="flex gap-2 overflow-x-auto p-2 variant-ghost">
    {#each album.atlases as atlas}
        {atlas.name}
        <img class="h-32 w-32 variant-ghost" src={atlas.source} alt={atlas.name} />
    {/each}
</div>
