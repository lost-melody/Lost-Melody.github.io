<script lang="ts">
    import { getToastStore } from "@skeletonlabs/skeleton";
    import { browser } from "$app/environment";
    import YAML from "yaml";
    import KeyboardLoad from "./KeyboardLoad.svelte";
    import type { Keyboard } from "./model/keyboardLayout";
    import { toastError } from "$lib/utils/error";

    const toastStore = getToastStore();
    const nameEmpty = "空的";

    export var layout: Keyboard;
    /** 自定義鍵盤存儲位 */
    export var customKeyboards: object[];

    if (!customKeyboards || customKeyboards.length === 0) {
        customKeyboards = new Array(10).fill(0).map((_, index) => {
            var keyboardData = browser && localStorage.getItem(`customKeyboard${index}`);
            if (keyboardData) {
                try {
                    var obj = YAML.parse(keyboardData);
                    return obj;
                } catch (err) {
                    toastError(toastStore, `parse custom keyboard failed: ${(err as Error).message}`);
                }
            }
            return { name: nameEmpty };
        });
    }

    /** LocalStorage 自定義鍵檔案鍵名 */
    function customKeyboardKey(index: number): string {
        return `customKeyboard${index}`;
    }
    /** 加載自定義鍵盤檔案 */
    function loadCustom(index: number): void {
        if (layout && customKeyboards[index]) {
            var initName = layout.name;
            layout.fromObject(customKeyboards[index]);
            layout.name = initName;
        }
    }
    /** 删除自定義鍵盤檔案 */
    function removeCustom(index: number): void {
        localStorage.removeItem(customKeyboardKey(index));
        customKeyboards[index] = { name: nameEmpty };
    }
    /** 覆蓋自定義鍵盤檔案 */
    function overrideCustom(index: number): void {
        if (layout) {
            var obj = layout.toObject();
            var keyboardData = YAML.stringify(obj);
            try {
                localStorage.setItem(customKeyboardKey(index), keyboardData);
                customKeyboards[index] = obj;
            } catch (err) {
                toastError(toastStore, `save to local storage failed: ${(err as Error).message}`);
            }
        }
    }
</script>

<div class="grid grid-cols-2 gap-2">
    {#each customKeyboards as keyboard, index}
        <KeyboardLoad
            on:load={() => loadCustom(index)}
            on:remove={() => removeCustom(index)}
            on:override={() => overrideCustom(index)}
            remove
            override
            {keyboard}
        />
    {/each}
</div>
