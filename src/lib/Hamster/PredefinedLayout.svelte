<script lang="ts">
    import type { Keyboard } from "./model/keyboardLayout";
    import KeyboardLoad from "./KeyboardLoad.svelte";

    export var layout: Keyboard;
    /** 預設鍵盤模板 */
    export var predefinedKeyboards: object[];

    /** 加載預置鍵盤檔案 */
    function loadPredefined(index: number): void {
        if (layout) {
            var initName = layout.name;
            layout.fromObject(predefinedKeyboards[index]);
            layout.name = initName;
        }
    }
</script>

<div class="gap-1 grid grid-cols-2">
    {#each predefinedKeyboards as keyboard, index}
        <KeyboardLoad on:load={() => loadPredefined(index)} {keyboard} />
    {/each}
</div>
