<script lang="ts">
    import Key from "./Key.svelte";

    interface Props {
        mappings: string;
    }
    let { mappings }: Props = $props();

    /** `{ "K": { "a": [ "上", "丄", ... ], ... }, ... }` */
    let compMap = $derived(parseMappings(mappings));

    // 讀取字根鍵位映射文件
    function parseMappings(mappings: string): { [key: string]: { [key: string]: string[] } } {
        let map: { [key: string]: { [key: string]: string[] } } = {};
        for (let line of mappings.split("\n")) {
            if (line && !line.startsWith("#")) {
                // ["Ka", "上"]
                let [code, comp] = line.split("\t");
                /** 大碼 */
                let primary = code.slice(0, 1).toUpperCase();
                /** 小碼 */
                let secondary = code.slice(1, 2).toLowerCase();
                if (!map[primary]) {
                    map[primary] = {};
                }
                if (!map[primary][secondary]) {
                    map[primary][secondary] = [];
                }
                // 注入當前讀取的字根
                map[primary][secondary].push(comp);
            }
        }
        return map;
    }
</script>

<div class="m-auto flex flex-col gap-1 p-2">
    {#each ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM,"] as line}
        <!-- 逐行繪製字根圖 -->
        <div class="flex gap-1">
            <div class="grow"></div>
            {#each line as key}
                <Key {key} comps={compMap[key] || {}} />
            {/each}
            <div class="grow"></div>
        </div>
    {/each}
</div>
