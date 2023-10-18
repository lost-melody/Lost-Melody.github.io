<script lang="ts">
    export var key: string;
    /** `[ ["了", "kc"], ["上", "kg"], ... ]` */
    export var comps: [string, string][];

    /** `[ "了c", "上丄g" ]` */
    var compList: string[];
    $: {
        let keyMap: { [key: string]: string[] } = {};
        for (let pair of comps) {
            let [comp, code] = pair;
            code = code.slice(1).toLowerCase();
            if (!keyMap[code]) {
                keyMap[code] = [];
            }
            keyMap[code].push(comp);
        }
        compList = [];
        for (let code of Object.keys(keyMap)) {
            // "上丄g"
            compList.push(`${keyMap[code].join("")}${code}`);
        }
    }
</script>

<div class="w-32 h-32 flex flex-col rounded-lg variant-ghost">
    <div
        class="w-full flex text-sm/[100%] justify-around rounded-t-lg variant-ghost"
    >
        <span class="px-1 py-1 w-6 code text-center rounded-md variant-ghost">
            {key || "-"}
        </span>
    </div>
    <div
        class="w-full h-full px-0.5 py-1 flex flex-wrap gap-0.5 justify-center content-start"
    >
        {#each compList as comp}
            <span
                class="px-1 py-0.5 font-mono text-[10px]/[100%] rounded-md variant-ghost"
            >
                {comp}
            </span>
        {/each}
    </div>
</div>
