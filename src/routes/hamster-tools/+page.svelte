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
    var renaming: boolean = false;
    /** 導出的 yaml 數據 */
    var exportData = "";

    /** 導出爲 yaml 文檔 */
    function exportYaml(): void {
        exportData = YAML.stringify({
            keyboards: keyboards.map((keyboard) => keyboard.toObject()),
        });
        selected = -1;
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
            renaming = true;
        } else {
            // 點擊其他頁標簽按鈕, 切換到該頁面
            selected = index;
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
                <!-- 「x」圖標 -->
                <button
                    on:click={() => delKeyboard(index)}
                    class="p-1 rounded-full hover:variant-ringed"
                >
                    <Icon height="20" icon="mdi:close" />
                </button>
                <!-- 鍵盤名 -->
                {#if index === selected && renaming}
                    <!-- 編輯鍵盤名 -->
                    <input
                        bind:value={keyboard.name}
                        placeholder="天行鍵"
                        use:autoFocus
                        on:blur={() => (renaming = false)}
                        class="bg-transparent w-16 h-10 p-1"
                    />
                {:else}
                    <!-- 鍵盤名導航鍵 -->
                    <button
                        on:click={() => clickTab(index)}
                        class="w-16 h-10 p-1"
                    >
                        {keyboard.name}
                    </button>
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
    <div class="p-4 flex flex-col items-center">
        {#if selected === -1}
            <!-- 導出代碼 -->
            <pre class="pre variant-soft">{exportData}</pre>
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
