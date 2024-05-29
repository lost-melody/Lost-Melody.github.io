<script lang="ts">
    export var key: string;
    /** `{ "c": ["了"], "g": ["上", "丄"], ... }` */
    export var comps: { [key: string]: string[] };
</script>

<!-- 一個按鍵上的所有字根 -->
<div class="w-36 shrink-0 flex flex-col rounded-lg variant-ghost">
    <!-- 這是鍵名欄, 顯示爲「K」 -->
    <div class="w-full flex text-sm/[100%] justify-around rounded-t-lg variant-ghost">
        <span class="px-1 py-1 w-6 code text-center rounded-md variant-ghost">
            {key || "-"}
        </span>
    </div>
    <!-- 這是内容欄, 展示所有該鍵上的字根 -->
    <div class="w-full h-full px-0.5 py-1 flex flex-wrap gap-0.5 justify-center content-start">
        {#each Object.keys(comps).sort() as secondary}
            <!-- 顯示每個小碼對應的一個或多個字根 -->
            <span class="px-1 py-0.5 text-xs/[100%] rounded-md variant-ghost">
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
