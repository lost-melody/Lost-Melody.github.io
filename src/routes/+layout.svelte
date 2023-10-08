<script lang="ts">
  import type { LayoutData } from "./$types";
  import "../app.postcss";
  import { page } from "$app/stores";
  import { initializeStores, getDrawerStore } from "@skeletonlabs/skeleton";
  import {
    AppBar,
    AppShell,
    Drawer,
    LightSwitch,
  } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import Navigation from "$lib/Navigation/Navigation.svelte";

  export var data: LayoutData;

  // 導航欄抽屜
  initializeStores();
  const drawerStore = getDrawerStore();
  function drawerOpen(): void {
    drawerStore.open();
  }

  // 導航列表
  var navigations: [string, string][] = data.navigations;
  // 鳴謝列表
  var credits: [string, string][] = data.credits;
</script>

<svelte:head>
  <!-- 頁面標題: "内容標題 - 站點標題" -->
  <title>{$page.data.title} · Lost Melody</title>
</svelte:head>

<Drawer width="w-64">
  <!-- 窄屏設备導航欄抽屜 -->
  <p class="text-lg p-4"><strong>{$page.data.title}</strong></p>
  <hr />
  <Navigation {navigations} />
</Drawer>

<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
  <!-- AppShell 佈局 -->

  <svelte:fragment slot="header">
    <!-- 頂部標題欄 -->
    <AppBar slotTrail="place-content-end">
      <svelte:fragment slot="lead">
        <!-- 左側動作按鈕 -->
        <div class="flex gap-1 justify-center items-center">
          <button class="lg:hidden btn-icon btn-icon-sm variant-ghost" on:click={drawerOpen}>
            <Icon icon="mdi:menu" />
          </button>
          <a href="/" class="btn-icon btn-icon-sm variant-ghost">
            <Icon icon="mdi:home" />
          </a>
        </div>
      </svelte:fragment>

      <svelte:fragment slot="default">
        <!-- 頁面標題 -->
        <div class="flex items-center">
          <strong class="text-lg">{$page.data.title}</strong>
        </div>
      </svelte:fragment>

      <svelte:fragment slot="trail">
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
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <svelte:fragment slot="sidebarLeft">
    <!-- 左側導航欄 -->
    <Navigation {navigations} />
  </svelte:fragment>

  <!-- 頁面内容插槽 -->
  <slot />

  <svelte:fragment slot="pageFooter">
    <!-- 底部鏈接欄 -->
    <div class="flex flex-col justify-center items-center">
      <p>Powered by</p>
      <div class="btn-group variant-ringed">
        {#each credits as credit}
          <a target="_blank" href={credit[1]}>{credit[0]}</a>
        {/each}
      </div>
    </div>
  </svelte:fragment>
</AppShell>
