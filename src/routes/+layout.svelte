<script lang="ts">
    import type { LayoutProps } from "./$types";
    import { onNavigate } from "$app/navigation";
    import { browser } from "$app/environment";
    import { onMount, setContext } from "svelte";
    import { writable } from "svelte/store";
    import "./layout.css";
    import { page } from "$app/state";
    import { AppBar, Dialog, Portal, Toast } from "@skeletonlabs/skeleton-svelte";
    import { toaster } from "$lib/utils/toaster";
    import Icon from "@iconify/svelte";
    import Navigation from "./components/Navigation.svelte";
    import LightSwitch from "$lib/components/LightSwitch.svelte";
    import { persisted } from "$lib/utils/persisted";

    let { data, children }: LayoutProps = $props();

    // 導航列表
    let navigations = $derived(data.navigations);
    // 鳴謝列表
    let credits = $derived(data.credits);

    /** 主題列表及其顯示名稱 */
    const themes: { [key: string]: string } = {
        catppuccin: "Catppuccin",
        cerberus: "Cerberus",
        dracula: "Dracula",
        legacy: "Legacy",
        modern: "Modern",
        nouveau: "Nouveau",
    };

    /** 主題選擇控件綁定值 */
    let theme = setContext("data-theme", persisted("data-theme", "cerberus"));
    /** 暗色模式監聽值 */
    let darkMode = setContext("darkMode", writable(false));
    /** 暗色模式開關狀態 */
    let dark = $state(false);

    // 設置頁面主題
    $effect(() => {
        if (!browser) return;
        document.documentElement.dataset.theme = $theme;
    });

    const updateDarkMode = () => {
        $darkMode = document.documentElement.classList.contains("dark");
    };

    const toggleDarkMode = () => {
        dark = !dark;
        document.documentElement.classList.toggle("dark", dark);
        localStorage.setItem("darkMode", String(dark));
        updateDarkMode();
    };

    onMount(() => {
        // 暗色模式初始化
        dark = localStorage.getItem("darkMode") === "true";
        document.documentElement.classList.toggle("dark", dark);
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
    });

    // 側邊欄抽屜開關狀態
    let drawerOpen = $state(false);
    const openNavigator = () => {
        drawerOpen = true;
    };

    onNavigate(() => {
        drawerOpen = false;
    });

    // 抽屜滑入動畫
    const drawerAnimation =
        "transition transition-discrete opacity-0 -translate-x-full starting:data-[state=open]:opacity-0 starting:data-[state=open]:-translate-x-full data-[state=open]:opacity-100 data-[state=open]:translate-x-0";
</script>

<svelte:head>
    <!-- 頁面標題: "内容標題 - 站點標題" -->
    <title>{page.data.title} · Lost Melody</title>
</svelte:head>

<div class="flex min-h-lvh flex-col">
    <!-- 頂部標題欄 -->
    <AppBar class="sticky top-0 z-50">
        <AppBar.Toolbar class="grid-cols-3">
            <AppBar.Lead class="flex items-center gap-2">
                <button class="preset-tonal btn-icon" onclick={openNavigator} type="button" aria-label="開啟導航">
                    <Icon icon="mdi:menu" />
                </button>
                <a href="/" class="preset-tonal btn-icon" aria-label="首頁">
                    <Icon icon="mdi:home" />
                </a>
            </AppBar.Lead>

            <!-- 頁面標題 -->
            <AppBar.Headline class="place-self-center">
                <h2 class="h2 text-nowrap" data-toc-ignore="">{page.data.title}</h2>
            </AppBar.Headline>

            <!-- 右側動作按鈕 -->
            <AppBar.Trail class="justify-self-end">
                <div class="flex items-center gap-2">
                    <LightSwitch checked={dark} onchange={toggleDarkMode} />
                    <a
                        title="倉庫"
                        class="preset-tonal btn-icon"
                        target="_blank"
                        href="https://github.com/lost-melody/Lost-Melody.github.io"
                    >
                        <Icon class="" icon="mdi:github" />
                    </a>
                </div>
            </AppBar.Trail>
        </AppBar.Toolbar>
    </AppBar>

    <!-- 導航側邊欄 -->
    <Dialog open={drawerOpen} onOpenChange={(d) => (drawerOpen = d.open)}>
        <Portal>
            <Dialog.Backdrop class="bg-surface-50-950/50 fixed inset-0 z-50" />
            <Dialog.Positioner class="fixed inset-0 z-50 flex justify-start">
                <Dialog.Content class="bg-surface-100-900 card h-screen w-sm shadow-xl {drawerAnimation}">
                    <Navigation bind:theme={$theme} {navigations} {themes} />
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    </Dialog>

    <!-- 全域 Toast -->
    <Toast.Group {toaster}>
        {#snippet children(toast)}
            <Toast {toast}>
                <Toast.Message>
                    <Toast.Title>{toast.title}</Toast.Title>
                    {#if toast.description}
                        <Toast.Description>{toast.description}</Toast.Description>
                    {/if}
                </Toast.Message>
                <Toast.CloseTrigger />
            </Toast>
        {/snippet}
    </Toast.Group>

    <!-- 頁面内容插槽 -->
    {@render children?.()}

    <div class="sticky top-full flex justify-center">
        <!-- 底部鏈接欄 -->
        <div class="preset-tonal btn-group w-full max-w-md rounded-md">
            {#each credits as credit}
                <a target="_blank" href={credit[1]} class="btn mx-auto">
                    {credit[0]}
                </a>
            {/each}
        </div>
    </div>
</div>
