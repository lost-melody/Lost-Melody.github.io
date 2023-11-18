<script lang="ts">
    import {
        Action,
        ActionNames,
        ActionType,
        KeyboardNames,
        KeyboardType,
        ShortCmd,
    } from "./model/keyboardLayout";

    /** 綁定的按鍵動作對象 */
    export var action: Action;

    /** 動作類型列表 */
    var actionTypes = Object.values(ActionType);
    var keyboardTypes = Object.values(KeyboardType);
    var shortCmdTypes = Object.values(ShortCmd);

    // 包含内容文本的動作類型
    const text: ActionType[] = [
        ActionType.character,
        ActionType.characterMargin,
        ActionType.symbol,
    ];
</script>

<div class="flex px-1 gap-1 items-center">
    <!-- 單選: 動作類型 -->
    <select
        bind:value={action.type}
        class="w-24 rounded-md px-1 bg-transparent hover:variant-soft"
    >
        {#each actionTypes as typ}
            <option value={typ}>
                {ActionNames[typ] ? ActionNames[typ] : typ} ({typ})
            </option>
        {/each}
    </select>

    <!-- 輸入: 動作内容文本 -->
    {#if text.includes(action.type)}
        <input
            bind:value={action.text}
            class="w-32 rounded-md px-1 bg-transparent hover:variant-soft"
        />
    {/if}

    <!-- 單選: 切換鍵盤類型 -->
    {#if action.type === ActionType.keyboardType}
        <select
            bind:value={action.kbd}
            class="w-32 rounded-md px-1 bg-transparent hover:variant-soft"
        >
            {#each keyboardTypes as typ}
                <option value={typ}>
                    {KeyboardNames[typ] ? KeyboardNames[typ] : typ} ({typ})
                </option>
            {/each}
        </select>
    {/if}

    <!-- 輸入: 自定義鍵盤名稱 -->
    {#if action.type === ActionType.keyboardType && action.kbd === KeyboardType.custom}
        <input
            bind:value={action.text}
            class="w-32 rounded-md px-1 bg-transparent hover:variant-soft"
        />
    {/if}

    <!-- 單選: 快捷命令類型 -->
    {#if action.type === ActionType.shortCommand}
        <select
            bind:value={action.cmd}
            class="w-32 rounded-md px-1 bg-transparent hover:variant-soft"
        >
            {#each shortCmdTypes as typ}
                <option value={typ}>
                    {typ}
                </option>
            {/each}
        </select>
    {/if}

    <!-- 輸入: 快捷命令·快捷键 -->
    {#if action.type === ActionType.shortCommand && action.cmd === ShortCmd.sendkeys}
        <input
            bind:value={action.text}
            class="w-32 rounded-md px-1 bg-transparent hover:variant-soft"
        />
    {/if}
</div>
