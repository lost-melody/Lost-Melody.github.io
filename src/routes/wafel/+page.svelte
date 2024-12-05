<script lang="ts">
    import Icon from "@iconify/svelte";
    import Keyboard from "$lib/Wafel/Keyboard.svelte";
    import into_mappings from "$lib/assets/wafel/into_map.txt?raw";
</script>

<div class="flex flex-col gap-2 p-2">
    <span class="variant-soft m-auto rounded-md p-1"> 一張字根圖 </span>
    <div class="flex overflow-auto">
        <Keyboard mappings={into_mappings} />
    </div>

    <span class="variant-soft m-auto rounded-md p-1"> 一個下載頁 </span>
    <div class="variant-ghost btn-group m-auto">
        <a target="_blank" href="https://github.com/lost-melody/rime-smyh" class="gap-1">
            <Icon icon="mdi:github" />
            訪問倉庫
        </a>
        <a target="_blank" href="https://github.com/lost-melody/rime-smyh/releases" class="gap-1">
            <Icon icon="mdi:download" />
            下載方案包
        </a>
    </div>

    <span class="variant-soft m-auto rounded-md p-1"> 餘下的, 需要時間來慢慢長大... </span>
</div>
