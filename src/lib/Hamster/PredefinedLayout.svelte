<script lang="ts">
    import YAML from "yaml";
    import type { Keyboard } from "./model/keyboardLayout";
    import KeyboardLoad from "./KeyboardLoad.svelte";
    import keyboardsYaml from "$lib/assets/hamster-tools/keyboards.yaml?raw";

    export var layout: Keyboard;

    function initPredefined() {
        try {
            var keyboardsObj = YAML.parse(keyboardsYaml);
            return keyboardsObj.keyboards as object[];
        } catch (err) {
            console.error(
                "parse keyboards.yaml failed:",
                (err as Error).message
            );
        }
        return [];
    }
    var predefinedKeyboards: object[] = initPredefined();
    /** 加載預置鍵盤檔案 */
    function loadPredefined(index: number): void {
        if (layout) {
            var initName = layout.name;
            layout.fromObject(predefinedKeyboards[index]);
            layout.name = initName;
        }
    }
</script>

<div class="gap-2 grid grid-cols-2">
    {#each predefinedKeyboards as keyboard, index}
        <KeyboardLoad on:load={() => loadPredefined(index)} {keyboard} />
    {/each}
</div>
