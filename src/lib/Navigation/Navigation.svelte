<script lang="ts">
    import Icon from "@iconify/svelte";

    /** 導航列表 */
    export let navigations: [string, string][] = [];
    export let themes: { [key: string]: string } = {};
    export let theme: string;
</script>

<div class="h-full space-y-2 px-2 py-16">
    <nav class="list-nav m-2 flex flex-col gap-2">
        <span class="col-span-2 mx-auto inline-flex items-center gap-2">
            <Icon icon="mdi:map-marker-radius" />
            导航
        </span>
        <!-- 導航列表 -->
        {#each navigations as navigation}
            <a class="variant-ghost" href={navigation[1]}>
                <Icon height="20" icon="mdi:menu-right" />
                {navigation[0]}
            </a>
        {/each}
    </nav>
    <!-- 主題切換 -->
    <div class="sticky top-full m-2 grid grid-cols-2 gap-2">
        <span class="col-span-2 mx-auto inline-flex items-center gap-2">
            <Icon icon="mdi:map-marker-radius" />
            主题
        </span>
        {#each Object.keys(themes) as t}
            <button
                class="variant-ghost btn"
                data-theme={t}
                on:click={() => {
                    theme = t;
                }}
            >
                {themes[t]}
            </button>
        {/each}
    </div>
</div>
