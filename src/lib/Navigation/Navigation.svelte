<script lang="ts">
    import { browser } from "$app/environment";
    import { getDrawerStore } from "@skeletonlabs/skeleton";
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

    /** 設置頁面主題 */
    function setTheme(theme: string): void {
        var attr = document.body.attributes.getNamedItem("data-theme");
        if (attr && themes[theme]) {
            attr.value = theme;
            localStorage.setItem("theme", theme);
        }
    }

    /** 主題選擇控件綁定值 */
    var theme: string = "skeleton";
    // 初始化主題並應用
    if (browser) {
        theme = localStorage.getItem("theme") || theme;
        if (themes[theme]) {
            setTheme(theme);
        }
    }

    const drawerStore = getDrawerStore();
    function drawerClose(): void {
        drawerStore.close();
    }

    /** 主題切換 */
    function onThemeChange(
        event: Event & { currentTarget: EventTarget & HTMLSelectElement }
    ): void {
        setTheme(event.currentTarget.value);
    }
</script>

<nav class="flex flex-col list-nav h-full p-2 gap-2">
    <!-- 導航列表 -->
    {#each navigations as navigation}
        <a class="variant-ghost" on:click={drawerClose} href={navigation[1]}>
            <Icon height="20" icon="mdi:menu-right" />
            {navigation[0]}
        </a>
    {/each}
    <div class="grow" />
    <!-- 主題切換 -->
    <select
        bind:value={theme}
        on:change={onThemeChange}
        class="select p-2 rounded-full"
    >
        {#each Object.keys(themes) as theme}
            <option value={theme}>
                主題: {themes[theme]}
            </option>
        {/each}
    </select>
</nav>
