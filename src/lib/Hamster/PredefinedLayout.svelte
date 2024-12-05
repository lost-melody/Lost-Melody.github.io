<script lang="ts">
    import { getToastStore } from "@skeletonlabs/skeleton";
    import YAML from "yaml";
    import type { Keyboard } from "./model/keyboardLayout";
    import KeyboardLoad from "./KeyboardLoad.svelte";
    import keyboardsYaml from "$lib/assets/hamster-tools/keyboards.yaml?raw";
    import { toastError } from "$lib/utils/error";

    export var layout: Keyboard;
    /** 預設鍵盤模板 */
    export var predefinedKeyboards: object[];

    if (!predefinedKeyboards || predefinedKeyboards.length === 0) {
        predefinedKeyboards = initPredefined();
    }

    const toastStore = getToastStore();
    function initPredefined() {
        try {
            var keyboardsObj = YAML.parse(keyboardsYaml);
            return keyboardsObj.keyboards as object[];
        } catch (err) {
            toastError(toastStore, `parse keyboards.yaml failed: ${(err as Error).message}`);
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

<div class="grid grid-cols-3 gap-1">
    {#each predefinedKeyboards as keyboard, index}
        <KeyboardLoad on:load={() => loadPredefined(index)} {keyboard} />
    {/each}
</div>
