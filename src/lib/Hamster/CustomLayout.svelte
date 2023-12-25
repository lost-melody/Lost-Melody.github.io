<script lang="ts">
    import { browser } from "$app/environment";
    import YAML from "yaml";
    import KeyboardLoad from "./KeyboardLoad.svelte";
    import type { Keyboard } from "./model/keyboardLayout";

    export var layout: Keyboard;

    const nameEmpty = "空的";
    /** LocalStorage 自定義鍵檔案鍵名 */
    function customKeyboardKey(index: number): string {
        return `customKeyboard${index}`;
    }
    /** 自定義鍵盤存儲位 */
    var customKeyboards: object[] = new Array(10).fill(0).map((_, index) => {
        if (!browser) {
            // server 端渲染, 没有 localStorage 接口
            return { name: nameEmpty };
        }

        var keyboardData = localStorage.getItem(customKeyboardKey(index));
        if (keyboardData) {
            try {
                var obj = YAML.parse(keyboardData);
                return obj;
            } catch (err) {
                console.error("parse custom keyboard failed:", (err as Error).message);
            }
        }
        return { name: nameEmpty };
    });
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
            var obj = layout.toObjectV2();
            var keyboardData = YAML.stringify(obj);
            try {
                localStorage.setItem(customKeyboardKey(index), keyboardData);
                customKeyboards[index] = obj;
            } catch (err) {
                console.error("save to local storage failed:", (err as Error).message);
            }
        }
    }
</script>

<div class="gap-2 grid grid-cols-2">
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
