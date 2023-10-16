<script lang="ts">
    import { browser } from "$app/environment";
    import type { PageData } from "./$types";
    import Icon from "@iconify/svelte";
    import YAML from "yaml";
    import { Keyboard } from "$lib/Hamster/Hamster";
    import KbdEdit from "$lib/Hamster/Keyboard.svelte";
    import KbdLoad from "$lib/Hamster/KeyboardLoad.svelte";

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

    // 當前操作類型: 重命名, 删除
    const [modeRename, modeDelete] = [1, 2];

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
    /** 準備删除鍵盤 */
    function tryDelKbd(index: number): void {
        if (index !== selected) {
            selected = index;
        }
        if (opMode) {
            opMode = 0;
        } else {
            opMode = modeDelete;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (opMode === modeDelete) {
                    opMode = 0;
                }
            }, delay);
        }
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
    /** 點擊標籤按鈕時, 切換焦點到該標籤頁, 或編輯本頁鍵盤名 */
    function clickTab(index: number): void {
        if (index === selected) {
            // 點擊本頁標籤按鈕, 編輯模式
            opMode = modeRename;
        } else {
            // 點擊其他頁標籤按鈕, 切換到該頁面
            selected = index;
            opMode = 0;
        }
    }
    /** 重命名自動聚焦 */
    function autoFocus(input: HTMLInputElement): void {
        input.focus();
    }
</script>

<div class="h-full flex flex-col p-2 g-2">
    <div class="flex justify-center">
        <!-- 標籤欄 -->
        {#each keyboards as keyboard, index (keyboard.id)}
            <!-- 單個標籤 -->
            <div
                class:variant-ghost={index === selected}
                class:border-b-2={index === selected}
                class="rounded-t-lg variant-ringed hover:variant-ghost flex px-1 justify-center items-center"
            >
                <!-- 圖標: 删除 or 取消 -->
                <button
                    on:click={() => tryDelKbd(index)}
                    class="p-1 rounded-full hover:variant-ringed"
                >
                    <Icon
                        height="20"
                        icon={index === selected && opMode === modeDelete
                            ? "mdi:cancel"
                            : "mdi:close"}
                    />
                </button>

                <!-- 鍵盤名 -->
                {#if index === selected && opMode === modeRename}
                    <!-- 編輯鍵盤名 -->
                    <input
                        bind:value={keyboard.name}
                        placeholder="天行鍵"
                        use:autoFocus
                        on:blur={() => (opMode = 0)}
                        class="bg-transparent h-10 p-1"
                    />
                {:else}
                    <!-- 鍵盤名導航鍵 -->
                    <button on:click={() => clickTab(index)} class="h-10 p-1">
                        {keyboard.name}
                    </button>
                {/if}

                <!-- 圖標: 鍵盤 or 删除 -->
                {#if index === selected && opMode === modeDelete}
                    <button
                        on:click={() => delKeyboard(index)}
                        class="p-1 rounded-full hover:variant-ringed"
                    >
                        <Icon color="red" height="20" icon="mdi:delete" />
                    </button>
                {:else}
                    <div class="p-1">
                        <Icon height="20" icon="mdi:keyboard" />
                    </div>
                {/if}
            </div>
        {/each}

        <!-- 「新增」按鈕 -->
        <button
            on:click={newKeyboard}
            class="rounded-t-lg p-2 variant-ringed hover:variant-ghost"
        >
            <Icon height="24" icon="mdi:plus" />
        </button>

        <!-- 「導出」按鈕 -->
        <button
            on:click={exportYaml}
            class:border-b-2={selected === -1}
            class="rounded-t-lg p-2 variant-ringed hover:variant-ghost"
        >
            <Icon height="24" icon="mdi:export-variant" />
        </button>
    </div>

    <hr class="!border-t-2" />

    <!-- 標籤頁内容 -->
    <div class="p-4 gap-2 flex flex-wrap">
        {#if selected === -1}
            <!-- 複製和導出代碼 -->
            <div class="mx-auto overflow-auto btn-group variant-ghost">
                <button
                    disabled={copiedState}
                    on:click={copyYaml}
                    class="flex items-center gap-1"
                >
                    <Icon icon={copiedState ? "mdi:check" : "mdi:clipboard"} />
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
                <button disabled class="flex items-center gap-1">
                    <Icon icon="mdi:import" />
                    導入文件
                    <input
                        type="file"
                        accept=".yaml,.yml"
                        on:change={onImportYaml}
                        class="rounded-full hover:variant-soft"
                    />
                </button>
            </div>
            <pre class="pre mx-auto variant-ghost">{exportData}</pre>
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

    <div class="text-xs p-2 rounded-md mx-auto variant-ghost">
        <p class="text-center">不太詳細的使用説明</p>
        <ol class="list-inside list-decimal">
            <li>
                如果要對現有佈局進行調整, 建議在手機 <i>Safari</i> 上打開此頁面;
                若要從零開始構建全新的佈局, 建議使用 <i>PC</i> 操作
            </li>
            <li>
                從文件導入佈局
                <ol class="indent-4 list-inside list-decimal">
                    <li>在最右側「導出」標籤頁内點擊導入文件按鈕</li>
                    <li>
                        在文件導入彈窗中, 選擇主配置文件 <code class="code">
                            Hamster/Rime/hamster.yaml
                        </code> 或其他鍵盤配置文件
                    </li>
                </ol>
            </li>
            <li>
                將佈局導出到文件
                <ol class="indent-4 list-inside list-decimal">
                    <li>
                        編輯完成後, 在最右側「導出」標籤頁内點擊導出文件按鈕
                    </li>
                    <li>
                        文件一般會下載到 <code class="code">
                            iPhone/下載/
                        </code> 目録下
                    </li>
                    <li>
                        在 <i>iOS</i> 系統的 <i>文件 App</i>
                        中將導出的文件移動到
                        <code class="code"> Hamster/Rime/hamster.yaml </code> 目録下
                    </li>
                    <li>
                        打開 <i>倉輸入法 App</i>, 在「鍵盤佈局」中選擇導入此文件
                    </li>
                </ol>
            </li>
            <li>
                佈局編輯指南
                <ol class="indent-4 list-inside list-decimal">
                    <li>
                        内距一般無須修改, 保持默認 <code class="code">
                            L(3),B(4),T(8),R(3)
                        </code> 卽可
                    </li>
                    <li>
                        點擊標籤頁標題一次, 切換到該鍵盤頁; 再次點擊可編輯鍵盤名
                    </li>
                    <li>
                        點擊標籤欄「+」圖標新增一個鍵盤;
                        點擊標籤頁左側的「X」標記, 再次點擊删除圖標可删除鍵盤;
                        點擊取消或無操作三秒後取消本次删除
                    </li>
                    <li>
                        點擊鍵盤區域中的按鍵後, 聚焦該鍵盤,
                        此時可在上方的按鍵編輯區更改此按鍵的配置
                    </li>
                    <li>
                        劃動動作編輯欄中顯示 <i>眼睛</i> 圖標,
                        表明此時該劃動動作會顯示在鍵盤上; 顯示爲 <i>斜線</i> 時表明不展示
                    </li>
                    <li>
                        劃動動作編輯欄中顯示 <i>地球</i> 圖標,
                        表明此時該劃動動作會經由 <i>Rime</i> 引擎處理; 顯示爲
                        <i>斜線</i>
                        時表明不經 <i>Rime</i> 處理
                    </li>
                    <li>
                        檔案導入導出是鍵盤級别的操作,
                        卽只會對當前鍵盤標籤頁生效;
                        文件導入導出則是對當前編輯的所有鍵盤的操作
                    </li>
                    <li>
                        檔案導入和導出按鈕提供三秒延遲確認,
                        存入/讀取/清空均可在三秒内再次點擊以取消操作
                    </li>
                </ol>
            </li>
        </ol>
    </div>

    <div class="grow" />

    <!-- WIP 提示 -->
    <div class="p-4 flex flex-col items-center">
        <span class="text-center text-xs">
            倉輸入法佈局生成器當前功能尚不完善, 歡迎 PR!
        </span>
    </div>
</div>
