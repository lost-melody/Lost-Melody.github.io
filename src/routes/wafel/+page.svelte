<script lang="ts">
    import Icon from "@iconify/svelte";
    import Keyboard from "./components/Keyboard.svelte";
    import into_mappings from "$lib/assets/wafel/into_map.txt?raw";
</script>

<div class="flex flex-col gap-2 p-2">
    <span class="preset-tonal m-auto rounded-md p-1"> 一張字根圖 </span>
    <div class="flex overflow-auto">
        <Keyboard mappings={into_mappings} />
    </div>

    <span class="preset-tonal m-auto rounded-md p-1"> 一個下載頁 </span>
    <div class="preset-tonal btn-group m-auto">
        <a target="_blank" href="https://github.com/lost-melody/rime-smyh" class="gap-1">
            <Icon icon="mdi:github" />
            訪問倉庫
        </a>
        <a target="_blank" href="https://github.com/lost-melody/rime-smyh/releases" class="gap-1">
            <Icon icon="mdi:download" />
            下載方案包
        </a>
    </div>

    <span class="preset-tonal m-auto rounded-md p-1">
        <del> 餘下的, 需要時間來慢慢長大... </del> 長不大了, 作者都去用
        <a target="_blank" href="https://shurufa.app/docs/ling.html">靈明</a> 了.
    </span>

    <span class="preset-tonal m-auto rounded-md p-1">
        殘存的方案, 文檔, 詞庫等, 還有堆成山的代碼遺骸, 都静静地躺在倉庫中.
    </span>
</div>
