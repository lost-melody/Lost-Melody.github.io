<script lang="ts">
    import YAML from "yaml";
    import type { Keyboard } from "../model/keyboardLayout.svelte.ts";
    import KeyboardLoad from "./KeyboardLoad.svelte";
    import keyboardsYaml from "$lib/assets/hamster-tools/keyboards.yaml?raw";
    import { toastError } from "$lib/utils/error";

    interface Props {
        layout: Keyboard;
        /** 預設鍵盤模板 */
        predefinedKeyboards: object[];
    }
    let { layout = $bindable(), predefinedKeyboards = $bindable() }: Props = $props();

    if (!predefinedKeyboards || predefinedKeyboards.length === 0) {
        predefinedKeyboards = initPredefined();
    }

    function initPredefined() {
        try {
            var keyboardsObj = YAML.parse(keyboardsYaml);
            return keyboardsObj.keyboards as object[];
        } catch (err) {
            toastError(`parse keyboards.yaml failed: ${(err as Error).message}`);
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
        <KeyboardLoad onload={() => loadPredefined(index)} {keyboard} />
    {/each}
</div>
