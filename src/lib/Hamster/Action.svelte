<script lang="ts">
    import { Action, ActionNames, ActionType, KeyboardNames, KeyboardType, ShortCmd } from "./model/keyboardLayout";
    import Icon from "@iconify/svelte";

    /** 綁定的按鍵動作對象 */
    export var action: Action;
    export var clipAction: Action;

    /** 動作類型列表 */
    var actionTypes = Object.values(ActionType);
    var keyboardTypes = Object.values(KeyboardType);
    var shortCmdTypes = Object.values(ShortCmd);
    $: funcKeys = [
        ActionType.backspace,
        ActionType.enter,
        ActionType.shift,
        ActionType.tab,
        ActionType.space,
        ActionType.nextKeyboard,
        ActionType.none,
    ].includes(action.type);

    // 包含内容文本的動作類型
    const text: ActionType[] = [ActionType.character, ActionType.characterMargin, ActionType.symbol];
    const cmdTypeInfos: Record<string, string> = {
        [ShortCmd.clear]: "清空預編輯串, 卽尚未上屏的文本",
        [ShortCmd.trad]: "請先在 Rime 配置頁面填寫切換鍵值",
        [ShortCmd.return]: "向輸入框發送換行, 不經由 Rime 處理",
        [ShortCmd.switcher]: "Rime 方案選單",
        [ShortCmd.left]: "輸入框光標左移",
        [ShortCmd.right]: "輸入框光標右移",
        [ShortCmd.selectText]: "全選",
        [ShortCmd.deleteText]: "清空輸入框",
        [ShortCmd.sendkeys]: "向 Rime 發送連續按鍵或組合鍵",
        [ShortCmd.enter]: "直接向文本框發送回車指令",
        [ShortCmd.showPhrase]: "打開短語視圖",
        [ShortCmd.showPasteboard]: "打開粘貼板視圖",
        [ShortCmd.showScript]: "顯示脚本視圖",
        [ShortCmd.hideScript]: "關閉脚本視圖",
        [ShortCmd.toggleScript]: "開啓或關閉脚本視圖",
        [ShortCmd.openUrl]: "打開指定 URL, 或打開剪貼板 URL",
    };
    const cmdTypeWarnings: Record<string, string> = {
        [ShortCmd.selectAll]: "指令已移除, 請使用 selectText",
        [ShortCmd.clearAll]: "指令已移除, 請使用 deleteText",
        [ShortCmd.selectText]: "此指令存在諸多問題, 係 iOS 系統限制, 請勿反饋",
        [ShortCmd.deleteText]: "此指令存在諸多問題, 係 iOS 系統限制, 請勿反饋",
        [ShortCmd.showScript]: "指令已移除, 請使用 toggleScript",
        [ShortCmd.hideScript]: "指令已移除, 請使用 toggleScript",
    };

    function copyAction(): void {
        clipAction = action.clone();
    }
    function pasteAction(): void {
        action = clipAction.clone();
    }
</script>

<div class="flex flex-col w-full items-center">
    <div class="flex w-full items-center">
        <!-- 單選: 動作類型 -->
        <select
            bind:value={action.type}
            class="appearance-none w-full h-10 px-2 variant-ringed hover:variant-ghost"
            class:rounded-bl-md={funcKeys}
        >
            {#each actionTypes as typ}
                <option value={typ}>
                    {ActionNames[typ] ? ActionNames[typ] : typ} ({typ})
                </option>
            {/each}
        </select>
        <button
            title="複製動作配置"
            on:click={copyAction}
            class="h-10 px-2 flex items-center variant-ringed hover:variant-ghost active:scale-95"
        >
            <Icon height="20" icon="mdi:content-copy" />
        </button>
        <button
            title="粘貼動作配置"
            on:click={pasteAction}
            class="h-10 px-2 flex items-center variant-ringed hover:variant-ghost active:scale-95"
            class:rounded-br-md={funcKeys}
        >
            <Icon height="20" icon="mdi:content-paste" />
        </button>
    </div>

    <!-- 輸入: 動作内容文本 -->
    {#if text.includes(action.type)}
        <div class="flex w-full h-10 items-center">
            <input
                bind:value={action.text}
                class="w-full h-full px-2 grow rounded-none rounded-b-md variant-ringed hover:variant-ghost"
                placeholder="按鍵字符内容"
            />
        </div>
    {/if}

    <!-- 單選: 切換鍵盤類型 -->
    {#if action.type === ActionType.keyboardType}
        <div class="flex w-full h-10 items-center">
            <select
                bind:value={action.kbd}
                class="appearance-none grow h-full px-2 variant-ringed hover:variant-ghost"
                class:rounded-b-md={action.kbd !== KeyboardType.custom}
            >
                {#each keyboardTypes as typ}
                    <option value={typ}>
                        {KeyboardNames[typ] ? KeyboardNames[typ] : typ} ({typ})
                    </option>
                {/each}
            </select>
        </div>
    {/if}

    <!-- 輸入: 自定義鍵盤名稱 -->
    {#if action.type === ActionType.keyboardType && action.kbd === KeyboardType.custom}
        <div class="flex w-full h-10 items-center">
            <input
                bind:value={action.text}
                class="grow h-full px-2 rounded-none rounded-b-md variant-ringed hover:variant-ghost"
                placeholder="自定義鍵盤名"
            />
        </div>
    {/if}

    <!-- 提示: 快捷命令簡介 -->
    {#if action.type === ActionType.shortCommand && cmdTypeInfos[action.cmd]}
        <div class="flex h-8 items-center text-sm gap-1">
            <Icon icon="mdi:information-box" />
            {cmdTypeInfos[action.cmd]}
        </div>
        <hr class="w-64 !border-t-2" />
    {/if}

    <!-- 提示: 快捷命令警告 -->
    {#if action.type === ActionType.shortCommand && cmdTypeWarnings[action.cmd]}
        <div class="flex h-8 items-center text-warning-500 text-sm gap-1">
            <Icon icon="mdi:warning-box" />
            {cmdTypeWarnings[action.cmd]}
        </div>
    {/if}

    <!-- 單選: 快捷命令類型 -->
    {#if action.type === ActionType.shortCommand}
        <div class="flex w-full h-10 items-center">
            <select
                bind:value={action.cmd}
                class="appearance-none grow h-full px-2 variant-ringed hover:variant-ghost"
                class:rounded-b-md={action.cmd !== ShortCmd.sendkeys && action.cmd !== ShortCmd.openUrl}
            >
                {#each shortCmdTypes as typ}
                    <option value={typ}>
                        {typ}
                    </option>
                {/each}
            </select>
        </div>
    {/if}

    <!-- 輸入: 快捷命令·快捷鍵 -->
    {#if action.type === ActionType.shortCommand && action.cmd === ShortCmd.sendkeys}
        <div class="flex w-full h-10 items-center">
            <input
                bind:value={action.text}
                class="grow h-full px-2 rounded-none rounded-b-md variant-ringed hover:variant-ghost"
                placeholder="nihao | Control_L+a"
            />
        </div>
    {/if}

    <!-- 輸入: 快捷命令·打開 URL -->
    {#if action.type === ActionType.shortCommand && action.cmd === ShortCmd.openUrl}
        <div class="flex w-full h-10 items-center">
            <input
                bind:value={action.text}
                class="grow h-full px-2 rounded-none rounded-b-md variant-ringed hover:variant-ghost"
                placeholder="#pasteboardContent | weixin://xxx"
            />
        </div>
    {/if}
</div>
