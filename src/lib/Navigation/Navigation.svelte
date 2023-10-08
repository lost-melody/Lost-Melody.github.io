<script lang="ts">
    import { getDrawerStore } from "@skeletonlabs/skeleton";

    export let navigations: [string, string][] = [];

    const drawerStore = getDrawerStore();
    function drawerClose(): void {
        drawerStore.close();
    }
</script>

<nav class="flex flex-col list-nav p-2 gap-2">
    {#each navigations as navigation}
        <a class="variant-ghost" on:click={drawerClose} href={navigation[1]}>
            {navigation[0]}
        </a>
    {/each}
</nav>
