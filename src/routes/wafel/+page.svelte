<script lang="ts">
    import Icon from "@iconify/svelte";
    import Keyboard from "$lib/Wafel/Keyboard.svelte";
    import into_mappings from "$lib/assets/wafel/into_map.txt?raw";
</script>

<div class="flex flex-col gap-2 p-2">
    <span class="p-1 m-auto rounded-md variant-soft"> 一張字根圖 </span>
    <div class="flex overflow-auto">
        <Keyboard mappings={into_mappings} />
    </div>

    <span class="p-1 m-auto rounded-md variant-soft"> 一個下載頁 </span>
    <div class="btn-group variant-ghost m-auto">
        <a target="_blank" href="https://github.com/lost-melody/rime-smyh" class="gap-1">
            <Icon icon="mdi:github" />
            倉庫
        </a>
        <a target="_blank" href="https://lost-melody.github.io/rime-smyh" class="gap-1">
            <Icon icon="mdi:download" />
            雞蛋餅
        </a>
    </div>

    <span class="p-1 m-auto rounded-md variant-soft"> 餘下的, 需要時間來慢慢長大... </span>
</div>
