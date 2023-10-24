<script lang="ts">
    import type { LayoutData } from "./$types";
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
        transition:fade
        class="z-20 fixed w-full h-full top-0 left-0 backdrop-blur"
    >
        <!-- 導航區域 -->
        <div
            transition:fly={{ y: -32 }}
            class="fixed top-14 left-2 p-4 rounded-md variant-ghost backdrop-blur"
        >
            <Navigation {navigations} on:navigate={closeNavigator} />
        </div>
    </div>
{/if}

<div class="flex flex-col min-h-[100vh]">
    <!-- 頂部標題欄 -->
    <div
        class="h-12 flex p-2 gap-2 variant-soft backdrop-blur sticky top-0 z-30"
    >
        <!-- 左側動作按鈕 -->
        <div class="flex gap-1 justify-center items-center">
            <button
                class="btn-icon btn-icon-sm variant-ghost"
                on:click={switchNavigator}
            >
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
            <LightSwitch width="w-14" height="h-7" class="variant-ghost" />
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
        <div class="flex flex-col justify-center items-center">
            <p>Powered by</p>
            <div class="btn-group variant-ringed">
                {#each credits as credit}
                    <a target="_blank" href={credit[1]}>{credit[0]}</a>
                {/each}
            </div>
        </div>
    </div>
</div>
