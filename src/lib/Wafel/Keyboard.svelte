<script lang="ts">
    import Key from "./Key.svelte";

    export var mappings: string;

    /** `{ "K": { "a": [ "上", "丄", ... ], ... }, ... }` */
    var compMap: {
        [key: string]: {
            [key: string]: string[];
        };
    };
    // 讀取字根鍵位映射文件
    $: {
        compMap = {};
        for (let line of mappings.split("\n")) {
            if (line && !line.startsWith("#")) {
                // ["Ka", "上"]
                let [code, comp] = line.split("\t");
                /** 大碼 */
                let primary = code.slice(0, 1).toUpperCase();
                /** 小碼 */
                let secondary = code.slice(1, 2).toLowerCase();
                if (!compMap[primary]) {
                    compMap[primary] = {};
                }
                if (!compMap[primary][secondary]) {
                    compMap[primary][secondary] = [];
                }
                // 注入當前讀取的字根
                compMap[primary][secondary].push(comp);
            }
        }
    }
</script>

<div class="gap-1 p-2 m-auto flex flex-col">
    {#each ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM,"] as line}
        <!-- 逐行繪製字根圖 -->
        <div class="flex gap-1">
            <div class="grow" />
            {#each line as key}
                <Key {key} comps={compMap[key] || {}} />
            {/each}
            <div class="grow" />
        </div>
    {/each}
</div>
