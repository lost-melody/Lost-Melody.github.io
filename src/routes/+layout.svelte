<script lang="ts">
    import type { LayoutData } from "./$types";
    import { onNavigate } from "$app/navigation";
    import { browser } from "$app/environment";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import "../app.postcss";
    import { page } from "$app/stores";
    import { Drawer, Modal, Toast } from "@skeletonlabs/skeleton";
    import { AppBar, LightSwitch } from "@skeletonlabs/skeleton";
    import { getDrawerStore, getModalStore, initializeStores } from "@skeletonlabs/skeleton";
    import Icon from "@iconify/svelte";
    import Navigation from "$lib/Navigation/Navigation.svelte";
    import { persisted } from "$lib/utils/persisted";

    export var data: LayoutData;

    initializeStores();

    // 導航列表
    var navigations: [string, string][] = data.navigations;
    // 鳴謝列表
    var credits: [string, string][] = data.credits;

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

    /** 主題選擇控件綁定值 */
    var theme = persisted("data-theme", "skeleton");
    /** 暗色模式監聽值 */
    var darkMode = setContext("darkMode", writable(false));
    // 設置頁面主題
    $: if (browser) {
        let attr = document.body.attributes.getNamedItem("data-theme");
        if (attr && themes[$theme]) {
            attr.value = $theme;
        }
    }

    const updateDarkMode = () => {
        $darkMode = document.documentElement.classList.contains("dark");
    };

    if (browser) {
        // 暗色模式監聽值初始化
        updateDarkMode();

        // 判斷使用者的語言，繁體中文與簡體中文何者為先
        for (let lang of navigator.languages) {
            switch (lang.toLowerCase()) {
                case "zh":
                case "zh-cn":
                    // 簡體優先，則採用簡體字型
                    document.documentElement.lang = "cmn-Hans-CN";
                    break;

                case "zh-tw":
                case "zh-hk":
                case "zh-mo":
                    // 繁體優先，則採用繁體字型
                    document.documentElement.lang = "cmn-Hant-CN";
                    break;

                default:
                    continue;
            }
        }
    }

    const drawerStore = getDrawerStore();
    const modalStore = getModalStore();
    const openNavigator = () => {
        drawerStore.open({
            width: "w-96 max-w-[80lvw]",
        });
    };

    onNavigate(() => {
        $drawerStore.open && drawerStore.close();
        $modalStore?.length && modalStore.close();
    });
</script>

<svelte:head>
    <!-- 頁面標題: "内容標題 - 站點標題" -->
    <title>{$page.data.title} · Lost Melody</title>
</svelte:head>

<div class="flex flex-col min-h-lvh">
    <!-- 頂部標題欄 -->
    <AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
        <!-- 左側動作按鈕 -->
        <svelte:fragment slot="lead">
            <div class="flex items-center space-x-2">
                <button class="btn-icon btn-icon-sm variant-ghost" on:click={openNavigator}>
                    <Icon icon="mdi:menu" />
                </button>
                <a href="/" class="btn-icon btn-icon-sm variant-ghost">
                    <Icon icon="mdi:home" />
                </a>
            </div>
        </svelte:fragment>

        <!-- 頁面標題 -->
        <h2 class="h2 text-nowrap" data-toc-ignore="">{$page.data.title}</h2>

        <!-- 右側動作按鈕 -->
        <svelte:fragment slot="trail">
            <div class="flex items-center space-x-2">
                <LightSwitch on:click={updateDarkMode} class="variant-ghost" />
                <a
                    title="倉庫"
                    class="btn-icon btn-icon-sm variant-ghost"
                    target="_blank"
                    href="https://github.com/lost-melody/Lost-Melody.github.io"
                >
                    <Icon icon="mdi:github" />
                </a>
            </div>
        </svelte:fragment>
    </AppBar>

    <Drawer>
        <Navigation bind:theme={$theme} {navigations} {themes} />
    </Drawer>

    <Modal zIndex="z-[888]" />
    <Toast zIndex="z-[999]" position="t" />

    <!-- 頁面内容插槽 -->
    <slot />

    <div class="sticky top-full flex justify-center">
        <!-- 底部鏈接欄 -->
        <div class="w-full max-w-md btn-group rounded-md variant-soft">
            {#each credits as credit}
                <a target="_blank" href={credit[1]} class="grow shrink">
                    {credit[0]}
                </a>
            {/each}
        </div>
    </div>
</div>
