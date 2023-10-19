<script lang="ts">
    import { browser } from "$app/environment";
    import type { PageData } from "./$types";
    import Icon from "@iconify/svelte";
    import YAML from "yaml";
    import { Keyboard } from "$lib/Hamster/Hamster";
    import Tab from "$lib/Hamster/Tab.svelte";
    import KbdEdit from "$lib/Hamster/Keyboard.svelte";
    import KbdLoad from "$lib/Hamster/KeyboardLoad.svelte";
    import Manual from "$lib/Hamster/Manual.svelte";

    export var data: PageData;

    /** 標籤組活動編號 */
    var selected: number = 0;
    /** 已添加的鍵盤列表 */
    var keyboards: Keyboard[] = [new Keyboard()];
    /** 當前正在編輯的鍵盤, 在標籤組焦點轉移或鍵盤增删時更新 */
    $: keyboard = keyboards[selected];
    /** 當前操作: 重命名, 删除 */
    var opMode: number = 0;
    /** 導出的 yaml 數據 */
    var exportData = "";

    const nameEmpty = "空的";
    const delay = 2000;
    // 已複製, 已下載 狀態記录
    var copiedState = false;
    var downloadedState = false;
    var timeout: NodeJS.Timeout;

    /** LocalStorage 自定義鍵檔案鍵名 */
    function customKeyboardKey(index: number): string {
        return `customKeyboard${index}`;
    }
    /** 自定義鍵盤存儲位 */
    var customKeyboards: object[] = new Array(15).fill(0).map((_, index) => {
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
                console.error(
                    "parse custom keyboard failed:",
                    (err as Error).message
                );
            }
        }
        return { name: nameEmpty };
    });

    /** 加載預置鍵盤檔案 */
    function loadPredefined(index: number): void {
        if (keyboard) {
            var initName = keyboard.name;
            keyboard.fromObject(data.keyboards[index]);
            keyboard.name = initName;
        }
    }
    /** 加載自定義鍵盤檔案 */
    function loadCustom(index: number): void {
        if (keyboard && customKeyboards[index]) {
            var initName = keyboard.name;
            keyboard.fromObject(customKeyboards[index]);
            keyboard.name = initName;
        }
    }
    /** 删除自定義鍵盤檔案 */
    function removeCustom(index: number): void {
        localStorage.removeItem(customKeyboardKey(index));
        customKeyboards[index] = { name: nameEmpty };
    }
    /** 覆蓋自定義鍵盤檔案 */
    function overrideCustom(index: number): void {
        if (keyboard) {
            var obj = keyboard.toObject();
            var keyboardData = YAML.stringify(obj);
            try {
                localStorage.setItem(customKeyboardKey(index), keyboardData);
                customKeyboards[index] = obj;
            } catch (err) {
                console.error(
                    "save to local storage failed:",
                    (err as Error).message
                );
            }
        }
    }
    /** 導出爲 yaml 文檔 */
    function exportYaml(): void {
        exportData = YAML.stringify({
            keyboards: keyboards.map((keyboard) => keyboard.toObject()),
        });
        selected = -1;
    }
    /** 複製内容到剪貼板 */
    function copyYaml(): void {
        copiedState = true;
        setTimeout(() => (copiedState = false), delay);
        navigator.clipboard.writeText(exportData);
    }
    /** 下載導出的 yaml 數據 */
    function downloadYaml(): void {
        downloadedState = true;
        setTimeout(() => (downloadedState = false), delay);
        var link = document.createElement("a");
        var blob = new Blob([exportData], {
            type: "application/yaml; charset=utf-8",
        });
        var url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = `keyboards-${Date.now()}.yaml`;
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
    /** 從 exportData 導入數據 */
    function importYaml(): void {
        try {
            let obj = YAML.parse(exportData);
            if (obj && obj.keyboards && obj.keyboards.length >= 0) {
                keyboards = (obj.keyboards as object[]).map((o) => {
                    var kbd = new Keyboard();
                    kbd.fromObject(o);
                    return kbd;
                });
            }
        } catch (err) {
            console.error("import file failed:", (err as Error).message);
        }
    }
    /** 選擇導入文件時 */
    function onImportYaml(
        event: Event & { currentTarget: EventTarget & HTMLInputElement }
    ): void {
        var input = event.currentTarget;
        if (input.files && input.files.length > 0) {
            for (let file of input.files) {
                let reader = new FileReader();
                reader.onload = (_) => {
                    exportData = reader.result as string;
                    importYaml();
                };
                reader.readAsText(file);
            }
        }
    }
    /** 新增鍵盤 */
    function newKeyboard(): void {
        // 在列表末位追加
        keyboards = [...keyboards, new Keyboard()];
        // 聚焦到新增的鍵盤
        selected = keyboards.length > 0 ? keyboards.length - 1 : 0;
    }
    /** 删除一個鍵盤 */
    function delKeyboard(index: number): void {
        opMode = 0;
        // 從列表中移除選定的鍵盤
        keyboards = keyboards
            .slice(0, index)
            .concat(keyboards.slice(index + 1));
        // 鍵盤列表爲空時補充一個
        if (keyboards.length === 0) {
            keyboards = [new Keyboard()];
        }
        // 更新聚焦的鍵盤
        if (selected >= keyboards.length) {
            selected = keyboards.length - 1;
        }
    }
</script>

<div class="h-full flex flex-col p-2 g-2">
    <div class="flex">
        <div class="grow shrink" />

        <div class="flex overflow-auto">
            <!-- 標籤欄 -->
            {#each keyboards as keyboard, index (keyboard.id)}
                <!-- 單個標籤 -->
                <Tab
                    {index}
                    bind:selected
                    bind:timeout
                    bind:keyboardName={keyboard.name}
                    bind:opMode
                    on:delkbd={() => delKeyboard(index)}
                />
            {/each}
        </div>

        <!-- 「新增」標籤按鈕 -->
        <button
            title="新增鍵盤"
            on:click={newKeyboard}
            class="rounded-t-lg p-2 variant-ringed hover:variant-ghost"
        >
            <Icon height="24" icon="mdi:plus" />
        </button>

        <!-- 「導出」標籤按鈕 -->
        <button
            title="導入或導出爲YAML文檔"
            on:click={exportYaml}
            class:border-b-2={selected === -1}
            class="rounded-t-lg p-2 variant-ringed hover:variant-ghost"
        >
            <Icon height="24" icon="mdi:export-variant" />
        </button>

        <div class="grow shrink" />
    </div>

    <hr class="!border-t-2" />

    <!-- 標籤頁内容 -->
    <div class="p-4 gap-2 flex flex-col">
        {#if selected === -1}
            <div class="flex flex-col gap-1">
                <!-- 複製和導出 -->
                <div class="mx-auto overflow-auto btn-group variant-ghost">
                    <button
                        disabled={copiedState}
                        on:click={copyYaml}
                        class="flex items-center gap-1"
                    >
                        <Icon
                            icon={copiedState ? "mdi:check" : "mdi:clipboard"}
                        />
                        複制代碼
                    </button>
                    <button
                        disabled={downloadedState}
                        on:click={downloadYaml}
                        class="flex items-center gap-1"
                    >
                        <Icon
                            icon={downloadedState
                                ? "mdi:check"
                                : "mdi:export-variant"}
                        />
                        導出文件
                    </button>
                </div>
                <!-- 導入 -->
                <div
                    class="mx-auto rounded-full p-1 variant-ghost flex justify-center items-center gap-1"
                >
                    <Icon icon="mdi:import" />
                    導入文件
                    <input
                        type="file"
                        accept=".yaml,.yml"
                        on:change={onImportYaml}
                        class="px-2 py-1 w-[60%] rounded-full variant-soft"
                    />
                </div>
            </div>
            <pre
                class="pre mx-auto variant-ghost whitespace-pre"> {exportData} </pre>
        {:else}
            <!-- 内容面板 -->
            {#if keyboard}
                <!-- 編輯當前鍵盤 -->
                <KbdEdit bind:keyboard />
            {/if}

            <!-- 預置鍵盤模板與自定義檔案 -->
            <div class="flex flex-wrap gap-2 w-full justify-center">
                <div
                    class="p-2 grid grid-flow-col grid-rows-6 gap-2 rounded-md variant-ghost"
                >
                    <span class="col-span-3 text-center"> 導入默認佈局 </span>
                    {#each data.keyboards as keyboard, index}
                        <KbdLoad
                            on:load={() => loadPredefined(index)}
                            {keyboard}
                        />
                    {/each}
                </div>
                <div
                    class="p-2 grid grid-flow-col grid-rows-6 gap-2 rounded-md variant-ghost"
                >
                    <span class="col-span-3 text-center"> 導入自定義檔案 </span>
                    {#each customKeyboards as keyboard, index}
                        <KbdLoad
                            on:load={() => loadCustom(index)}
                            on:remove={() => removeCustom(index)}
                            on:override={() => overrideCustom(index)}
                            remove
                            override
                            {keyboard}
                        />
                    {/each}
                </div>
            </div>
        {/if}
    </div>

    <!-- 使用説明 -->
    <Manual />

    <div class="grow" />

    <!-- WIP 提示 -->
    <div class="p-4 flex flex-col items-center">
        <span class="text-center text-xs">
            倉輸入法佈局生成器當前功能尚不完善, 歡迎 PR!
        </span>
    </div>
</div>
