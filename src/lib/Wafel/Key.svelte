<script lang="ts">
    export var key: string;
    /** `{ "c": ["了"], "g": ["上", "丄"], ... }` */
    export var comps: { [key: string]: string[] };
</script>

<!-- 一個按鍵上的所有字根 -->
<div class="variant-ghost flex w-36 shrink-0 flex-col rounded-lg">
    <!-- 這是鍵名欄, 顯示爲「K」 -->
    <div class="variant-ghost flex w-full justify-around rounded-t-lg text-sm/[100%]">
        <span class="code variant-ghost w-6 rounded-md px-1 py-1 text-center">
            {key || "-"}
        </span>
    </div>
    <!-- 這是内容欄, 展示所有該鍵上的字根 -->
    <div class="flex h-full w-full flex-wrap content-start justify-center gap-0.5 px-0.5 py-1">
        {#each Object.keys(comps).sort() as secondary}
            <!-- 顯示每個小碼對應的一個或多個字根 -->
            <span class="variant-ghost rounded-md px-1 py-0.5 text-xs/[100%]">
                <!-- 單個小碼展示爲「上 丄 g」 -->
                <span class="font-comp">
                    {comps[secondary].join(" ")}
                </span>
                <span class="font-mono text-error-700 dark:text-error-300">
                    {secondary}
                </span>
            </span>
        {/each}
    </div>
</div>

<style>
    /* 字根专用字体 */
    .font-comp {
        font-family: "等线", sans-serif;
    }
</style>
