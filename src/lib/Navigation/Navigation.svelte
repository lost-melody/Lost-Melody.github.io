<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";

    /** 導航列表 */
    export let navigations: [string, string][] = [];
    export let themes: { [key: string]: string } = {};
    export let theme: string;

    const dispatch = createEventDispatcher();
    function onNavigate(): void {
        dispatch("navigate");
    }
</script>

<nav class="flex flex-col list-nav grow gap-2">
    <!-- 導航列表 -->
    {#each navigations as navigation}
        <a class="variant-ghost" on:click={onNavigate} href={navigation[1]}>
            <Icon height="20" icon="mdi:menu-right" />
            {navigation[0]}
        </a>
    {/each}
    <!-- 主題切換 -->
    <select bind:value={theme} class="select rounded-full">
        {#each Object.keys(themes) as theme}
            <option value={theme}>
                主題: {themes[theme]}
            </option>
        {/each}
    </select>
</nav>
