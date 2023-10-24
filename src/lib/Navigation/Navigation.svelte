<script lang="ts">
    import { browser } from "$app/environment";
    import { createEventDispatcher } from "svelte";
    import { localStorageStore } from "@skeletonlabs/skeleton";
    import Icon from "@iconify/svelte";

    /** 導航列表 */
    export let navigations: [string, string][] = [];

    /** 主題列表及其顯示名稱 */
    const themes: { [key: string]: string } = {
        skeleton: "Skeleton",
        wintry: "Wintry",
        modern: "Modern",
        rocket: "Rocket",
        seafoam: "Seaform",
        vintage: "Vintage",
        sahara: "Sahara",
        hamlindigo: "Hamlindigo",
        "gold-nouveau": "Gold Nouveau",
        crimson: "Crimson",
    };

    var serializer = {
        parse: (text: string) => text,
        stringify: (text: string) => text,
    };
    /** 主題選擇控件綁定值 */
    var theme = localStorageStore("theme", "skeleton", { serializer });
    // 設置頁面主題
    $: if (browser) {
        let attr = document.body.attributes.getNamedItem("data-theme");
        if (attr && themes[$theme]) {
            attr.value = $theme;
        }
    }

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
    <select bind:value={$theme} class="select rounded-full">
        {#each Object.keys(themes) as theme}
            <option value={theme}>
                主題: {themes[theme]}
            </option>
        {/each}
    </select>
</nav>
