<script lang="ts">
    import type { PageData } from "./$types";
    import AvatarCard from "$lib/Card/AvatarCard.svelte";

    export var data: PageData;
</script>

<div class="mx-auto flex max-w-screen-xl flex-wrap justify-center gap-4 p-4">
    {#each data.profiles as profile}
        <AvatarCard {profile} />
    {/each}
</div>
