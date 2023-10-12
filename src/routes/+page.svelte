<script lang="ts">
    import type { PageData } from "./$types";
    import AvatarCard from "$lib/Card/AvatarCard.svelte";

    export var data: PageData;
</script>

<div class="flex flex-wrap p-4 gap-4 justify-center">
    {#each data.profiles as profile}
        <AvatarCard {profile} />
    {/each}
</div>
