<script lang="ts">
    import Icon from "@iconify/svelte";
    import Keyboard from "$lib/Wafel/Keyboard.svelte";
    import wafel_mappings from "$lib/assets/wafel/wafel_map.txt?raw";
    import into_mappings from "$lib/assets/wafel/into_map.txt?raw";

    const mappingsList: [string, string][] = [
        ["標凖版·Wafel", wafel_mappings],
        ["半音托版·Into", into_mappings],
    ];
    var selected: number = 0;
</script>

<div class="flex flex-col gap-2 p-2">
    <span class="p-1 m-auto rounded-md variant-soft"> 一張字根圖 </span>
    <div class="btn-group m-auto variant-ghost">
        {#each mappingsList as [name, _], index}
            <button
                disabled={selected === index}
                on:click={() => {
                    selected = index;
                }}
                class:variant-soft={selected === index}
            >
                {name}
            </button>
        {/each}
    </div>
    <div class="flex overflow-auto">
        <Keyboard mappings={mappingsList[selected][1]} />
    </div>

    <span class="p-1 m-auto rounded-md variant-soft"> 一個下載頁 </span>
    <div class="btn-group variant-ghost m-auto">
        <a
            target="_blank"
            href="https://github.com/lost-melody/rime-smyh"
            class="gap-1"
        >
            <Icon icon="mdi:github" />
            倉庫
        </a>
        <a
            target="_blank"
            href="https://lost-melody.github.io/rime-smyh"
            class="gap-1"
        >
            <Icon icon="mdi:download" />
            雞蛋餅
        </a>
    </div>

    <span class="p-1 m-auto rounded-md variant-soft">
        餘下的, 需要時間來慢慢長大...
    </span>
</div>
