<script lang="ts">
    import Key from "./Key.svelte";
    import mappings from "$lib/assets/wafel/smyh_map.txt?raw";

    var compMap: { [key: string]: [string, string][] } = {};
    for (let line of mappings.split("\n")) {
        if (line && !line.startsWith("#")) {
            let [code, comp] = line.split("\t");
            let key = code.slice(0, 1).toUpperCase();
            if (!compMap[key]) {
                compMap[key] = [];
            }
            compMap[key].push([comp, code]);
        }
    }
</script>

<div class="gap-1 p-2 flex flex-col w-full overflow-auto">
    <div class="flex m-auto gap-1">
        {#each "QWERTYUIOP" as key}
            <Key {key} comps={compMap[key] || []} />
        {/each}
    </div>
    <div class="flex m-auto gap-1">
        <div class="w-16" />
        {#each "ASDFGHJKL" as key}
            <Key {key} comps={compMap[key] || []} />
        {/each}
        <div class="w-16" />
    </div>
    <div class="flex m-auto gap-1">
        <div class="w-32" />
        {#each "ZXCVBNM," as key}
            <Key {key} comps={compMap[key] || []} />
        {/each}
        <div class="w-32" />
    </div>
</div>
