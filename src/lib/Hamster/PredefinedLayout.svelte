<script lang="ts">
    import YAML from "yaml";
    import type { Keyboard } from "./model/keyboardLayout";
    import KeyboardLoad from "./KeyboardLoad.svelte";
    import keyboardsYaml from "$lib/assets/hamster-tools/keyboards.yaml?raw";

    export var layout: Keyboard;
    /** 預設鍵盤模板 */
    export var predefinedKeyboards: object[];

    if (!predefinedKeyboards || predefinedKeyboards.length === 0) {
        predefinedKeyboards = initPredefined();
    }

    function initPredefined() {
        try {
            var keyboardsObj = YAML.parse(keyboardsYaml);
            return keyboardsObj.keyboards as object[];
        } catch (err) {
            alert(`parse keyboards.yaml failed: ${(err as Error).message}`);
        }
        return [];
    }

    /** 加載預置鍵盤檔案 */
    function loadPredefined(index: number): void {
        if (layout) {
            var initName = layout.name;
            layout.fromObject(predefinedKeyboards[index]);
            layout.name = initName;
        }
    }
</script>

<div class="gap-1 grid grid-cols-3">
    {#each predefinedKeyboards as keyboard, index}
        <KeyboardLoad on:load={() => loadPredefined(index)} {keyboard} />
    {/each}
</div>
