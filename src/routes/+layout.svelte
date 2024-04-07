<script lang="ts">
    import type { LayoutData } from "./$types";
    import { browser } from "$app/environment";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import { localStorageStore } from "@skeletonlabs/skeleton";
    import "../app.postcss";
    import { page } from "$app/stores";
    import { fade, fly } from "svelte/transition";
    import { LightSwitch } from "@skeletonlabs/skeleton";
    import Icon from "@iconify/svelte";
    import Navigation from "$lib/Navigation/Navigation.svelte";

    export var data: LayoutData;

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

    var serializer = {
        parse: (text: string) => text,
        stringify: (text: string) => text,
    };
    /** 主題選擇控件綁定值 */
    var theme = localStorageStore("theme", "skeleton", { serializer });
    /** 暗色模式監聽值 */
    var darkMode = setContext("darkMode", writable(false));
    // 設置頁面主題
    $: if (browser) {
        let attr = document.body.attributes.getNamedItem("data-theme");
        if (attr && themes[$theme]) {
            attr.value = $theme;
        }
    }

    var showNavigator = false;
    var navigatorBackground: HTMLDivElement;
    const switchNavigator = () => {
        showNavigator = !showNavigator;
    };
    const closeNavigator = () => {
        if (showNavigator) {
            showNavigator = false;
        }
    };
    const onClickWindow = (event: Event) => {
        if (event.target === navigatorBackground) {
            closeNavigator();
        }
    };
    const onKeyUp = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            closeNavigator();
        }
    };
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
            break;
        }
    }
</script>

<svelte:head>
    <!-- 頁面標題: "内容標題 - 站點標題" -->
    <title>{$page.data.title} · Lost Melody</title>
</svelte:head>

<!-- 按 Esc 或點擊背景時, 關閉導航欄 -->
<svelte:document on:keyup={onKeyUp} on:click={onClickWindow} />

<!-- 彈出導航欄 -->
{#if showNavigator}
    <!-- 背景 -->
    <div
        bind:this={navigatorBackground}
        transition:fade={{ duration: 250 }}
        class="z-20 fixed w-full h-full top-0 left-0 backdrop-blur"
    >
        <!-- 導航區域 -->
        <div
            transition:fly={{ duration: 250, y: -32 }}
            class="fixed top-14 left-2 p-4 rounded-md variant-ghost backdrop-blur"
        >
            <Navigation bind:theme={$theme} {navigations} {themes} on:navigate={closeNavigator} />
        </div>
    </div>
{/if}

<div class="flex flex-col min-h-[100vh]">
    <!-- 頂部標題欄 -->
    <div class="h-12 flex p-2 gap-2 variant-soft backdrop-blur z-30">
        <!-- 左側動作按鈕 -->
        <div class="flex gap-1 justify-center items-center">
            <button class="btn-icon btn-icon-sm variant-ghost" on:click={switchNavigator}>
                <Icon icon="mdi:menu" />
            </button>
            <a href="/" class="btn-icon btn-icon-sm variant-ghost">
                <Icon icon="mdi:home" />
            </a>
        </div>

        <!-- 頁面標題 -->
        <div class="flex items-center">
            <strong class="text-lg">{$page.data.title}</strong>
        </div>

        <div class="grow" />

        <!-- 右側動作按鈕 -->
        <div class="flex gap-1 justify-center items-center">
            <LightSwitch on:click={updateDarkMode} width="w-14" height="h-7" class="variant-ghost" />
            <a
                class="btn-icon btn-icon-sm variant-ghost"
                target="_blank"
                href="https://github.com/lost-melody/Lost-Melody.github.io"
            >
                <Icon icon="mdi:github" />
            </a>
        </div>
    </div>

    <!-- 頁面内容插槽 -->
    <slot />

    <div class="grow" />

    <div>
        <!-- 底部鏈接欄 -->
        <div class="py-2 gap-2 flex flex-col justify-center items-center">
            <p>Powered by</p>
            <div class="w-full max-w-md btn-group rounded-md variant-soft">
                {#each credits as credit}
                    <a target="_blank" href={credit[1]} class="grow shrink">
                        {credit[0]}
                    </a>
                {/each}
            </div>
        </div>
    </div>
</div>
