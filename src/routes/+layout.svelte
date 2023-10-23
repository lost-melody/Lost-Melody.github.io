<script lang="ts">
    import type { LayoutData } from "./$types";
    import "../app.postcss";
    import { page } from "$app/stores";
    import { fly } from "svelte/transition";
    import { LightSwitch } from "@skeletonlabs/skeleton";
    import Icon from "@iconify/svelte";
    import Navigation from "$lib/Navigation/Navigation.svelte";

    export var data: LayoutData;

    // 導航列表
    var navigations: [string, string][] = data.navigations;
    // 鳴謝列表
    var credits: [string, string][] = data.credits;

    var showNavigator = false;
    const switchNavigator = () => {
        showNavigator = !showNavigator;
    };
</script>

<svelte:head>
    <!-- 頁面標題: "内容標題 - 站點標題" -->
    <title>{$page.data.title} · Lost Melody</title>
</svelte:head>

<div class="flex flex-col min-h-[100vh]">
    <!-- 頂部標題欄 -->
    <div class="h-12 flex p-2 gap-2 variant-soft backdrop-blur sticky top-0">
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

    <!-- 彈出導航欄 -->
    {#if showNavigator}
        <div
            transition:fly={{ y: -32 }}
            class="fixed top-14 left-2 p-2 rounded-md variant-ghost backdrop-blur"
        >
            <Navigation {navigations} on:navigate={switchNavigator} />
        </div>
    {/if}

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
