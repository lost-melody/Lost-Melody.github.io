<script lang="ts">
    import Icon from "@iconify/svelte";
    import YAML from "yaml";
    import { Keyboard } from "$lib/Hamster/Hamster";
    import KbdEdit from "$lib/Hamster/Keyboard.svelte";

    /** 標簽組活動編號 */
    var selected: number = 0;
    /** 已添加的鍵盤列表 */
    var keyboards: Keyboard[] = [new Keyboard()];
    /** 當前正在編輯的鍵盤, 在標簽組焦點轉移或鍵盤增删時更新 */
    $: keyboard = keyboards[selected];
    /** 當前操作: 重命名, 删除 */
    var opMode: number = 0;
    /** 導出的 yaml 數據 */
    var exportData = "";

    // 已複製, 已下載 狀態記录
    var copiedState = false;
    var downloadedState = false;

    // 當前操作類型: 重命名, 删除
    const [modeRename, modeDelete] = [1, 2];

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
        setTimeout(() => (copiedState = false), 3000);
        navigator.clipboard.writeText(exportData);
    }
    /** 下載導出的 yaml 數據 */
    function downloadYaml(): void {
        downloadedState = true;
        setTimeout(() => (downloadedState = false), 3000);
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
        opMode = opMode ? 0 : modeDelete;
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
    /** 點擊標簽按鈕時, 切換焦點到該標簽頁, 或編輯本頁鍵盤名 */
    function clickTab(index: number): void {
        if (index === selected) {
            // 點擊本頁標簽按鈕, 編輯模式
            opMode = modeRename;
        } else {
            // 點擊其他頁標簽按鈕, 切換到該頁面
            selected = index;
            opMode = 0;
        }
    }
    /** 重命名自動聚焦 */
    function autoFocus(input: HTMLInputElement): void {
        input.focus();
    }
</script>

<div class="p-2 g-2">
    <div class="flex justify-center">
        <!-- 標簽欄 -->
        {#each keyboards as keyboard, index (keyboard.id)}
            <!-- 單個標簽 -->
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
                    {#if index === selected && opMode === modeDelete}
                        <Icon height="20" icon="mdi:cancel" />
                    {:else}
                        <Icon height="20" icon="mdi:close" />
                    {/if}
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

    <!-- 標簽頁内容 -->
    <div class="p-4 gap-2 flex flex-col items-center">
        {#if selected === -1}
            <!-- 複製和導出代碼 -->
            <div class="btn-group variant-ghost">
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
            </div>
            <pre class="pre variant-ghost">{exportData}</pre>
        {:else}
            <!-- 内容面板 -->
            {#if keyboard}
                <!-- 編輯當前鍵盤 -->
                <KbdEdit bind:keyboard />
            {/if}
        {/if}
    </div>

    <!-- WIP 提示 -->
    <div class="p-4 flex flex-col items-center">
        <span class="text-center text-xs">
            倉輸入法佈局生成器當前功能尚不完善, 歡迎 PR!
        </span>
    </div>
</div>
