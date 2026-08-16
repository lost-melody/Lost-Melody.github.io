<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        /** 導航列表 */
        navigations?: [string, string][];
        /** 主題列表 */
        themes?: { [key: string]: string };
        /** 目前主題 */
        theme?: string;
    }
    let { navigations = [], themes = {}, theme = $bindable() }: Props = $props();
</script>

<div class="h-full space-y-2 px-2 py-16">
    <nav class="m-2 flex flex-col gap-2">
        <span class="col-span-2 mx-auto inline-flex items-center gap-2">
            <Icon icon="mdi:map-marker-radius" />
            导航
        </span>
        <!-- 導航列表 -->
        {#each navigations as navigation}
            <a class="preset-tonal rounded-md p-2" href={navigation[1]}>
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
                class="preset-tonal btn"
                data-theme={t}
                onclick={() => {
                    theme = t;
                }}
            >
                {themes[t]}
            </button>
        {/each}
    </div>
</div>
