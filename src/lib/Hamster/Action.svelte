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
    const cmdTypeWarnings: Record<string, string> = {
        [ShortCmd.selectAll]: "指令已移除, 請使用 selectText",
        [ShortCmd.clearAll]: "指令已移除, 請使用 deleteText",
        [ShortCmd.selectText]: "此指令存在諸多問題, 係 iOS 系統限制, 請勿反饋",
        [ShortCmd.deleteText]: "此指令存在諸多問題, 係 iOS 系統限制, 請勿反饋",
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

    <!-- 提示: 快捷命令警告 -->
    {#if cmdTypeWarnings[action.cmd]}
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
                class:rounded-b-md={action.cmd !== ShortCmd.sendkeys}
            >
                {#each shortCmdTypes as typ}
                    <option value={typ}>
                        {typ}
                    </option>
                {/each}
            </select>
        </div>
    {/if}

    <!-- 輸入: 快捷命令·快捷键 -->
    {#if action.type === ActionType.shortCommand && action.cmd === ShortCmd.sendkeys}
        <div class="flex w-full h-10 items-center">
            <input
                bind:value={action.text}
                class="grow h-full px-2 rounded-none rounded-b-md variant-ringed hover:variant-ghost"
                placeholder="快捷鍵内容"
            />
        </div>
    {/if}
</div>
