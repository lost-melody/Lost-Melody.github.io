<script lang="ts">
    import type { PageData } from "./$types";
    import AvatarCard from "./components/AvatarCard.svelte";

    interface Props {
        data: PageData;
    }
    let { data }: Props = $props();
</script>

<div class="mx-auto flex max-w-screen-xl flex-wrap justify-center gap-4 p-4">
    {#each data.profiles as profile}
        <AvatarCard {profile} />
    {/each}
</div>
