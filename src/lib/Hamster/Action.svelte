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

    // 包含内容文本的動作類型
    const text: ActionType[] = [ActionType.character, ActionType.characterMargin, ActionType.symbol];

    function copyAction(): void {
        clipAction = action.clone();
    }
    function pasteAction(): void {
        action = clipAction.clone();
    }
</script>

<div class="flex flex-col w-full px-1 gap-1 items-center">
    <div class="flex w-full p-1 gap-1 items-center">
        <!-- 單選: 動作類型 -->
        <select
            bind:value={action.type}
            class="w-full rounded-md p-1 bg-transparent variant-ringed hover:variant-ghost"
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
            class="gap-1 p-2 flex items-center rounded-md variant-ringed hover:variant-ghost active:scale-90"
        >
            <Icon height="20" icon="mdi:content-copy" />
        </button>
        <button
            title="粘貼動作配置"
            on:click={pasteAction}
            class="gap-1 p-2 flex items-center rounded-md variant-ringed hover:variant-ghost active:scale-90"
        >
            <Icon height="20" icon="mdi:content-paste" />
        </button>
    </div>

    <!-- 輸入: 動作内容文本 -->
    {#if text.includes(action.type)}
        <div class="flex w-full p-1 gap-1 items-center">
            <input
                bind:value={action.text}
                class="p-1 grow rounded-md bg-transparent variant-ringed hover:variant-ghost"
                placeholder="按鍵字符内容"
            />
        </div>
    {/if}

    <!-- 單選: 切換鍵盤類型 -->
    {#if action.type === ActionType.keyboardType}
        <div class="flex w-full p-1 gap-1 items-center">
            <select
                bind:value={action.kbd}
                class="grow rounded-md p-1 bg-transparent variant-ringed hover:variant-ghost"
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
        <div class="flex w-full p-1 gap-1 items-center">
            <input
                bind:value={action.text}
                class="grow rounded-md p-1 bg-transparent variant-ringed hover:variant-ghost"
                placeholder="自定義鍵盤名"
            />
        </div>
    {/if}

    <!-- 單選: 快捷命令類型 -->
    {#if action.type === ActionType.shortCommand}
        <div class="flex w-full p-1 gap-1 items-center">
            <select
                bind:value={action.cmd}
                class="grow rounded-md p-1 bg-transparent variant-ringed hover:variant-ghost"
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
        <div class="flex w-full p-1 gap-1 items-center">
            <input
                bind:value={action.text}
                class="grow rounded-md p-1 bg-transparent variant-ringed hover:variant-ghost"
                placeholder="快捷鍵内容"
            />
        </div>
    {/if}
</div>
