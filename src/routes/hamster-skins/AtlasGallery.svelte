<script lang="ts">
    import { ImageAlbum } from "./models";

    interface Props {
        album: ImageAlbum;
    }
    let { album = $bindable() }: Props = $props();
</script>

<div class="variant-ghost flex gap-2 overflow-x-auto p-2">
    {#each album.atlases as atlas}
        <img class="variant-ghost h-32 w-32" src={atlas.source} alt={atlas.name} title={atlas.name} />
    {/each}
</div>
