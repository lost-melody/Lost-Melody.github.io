<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";

    /** 選定的鍵盤序號 */
    export var index: number;
    /** 選定的鍵盤數據 */
    export var selected: number;
    /** 統一超時計時器 */
    export var timeout: NodeJS.Timeout;
    /** 當前鍵盤名 */
    export var keyboardName: string;
    /** 當前操作: 重命名, 删除 */
    export var opMode: number;

    const delay = 2000;
    // 當前操作類型: 重命名, 删除
    const [modeRename, modeDelete] = [1, 2];

    /** 準備删除鍵盤 */
    function tryDelKbd(): void {
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
    /** 點擊標籤按鈕時, 切換焦點到該標籤頁, 或編輯本頁鍵盤名 */
    function clickTab(): void {
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

    var dispatch = createEventDispatcher();
    /** 發送鍵盤删除事件 */
    function onDelKeyboard(): void {
        dispatch("delkbd", { index });
    }
</script>

<div
    class:variant-ghost={index === selected}
    class:border-b-2={index === selected}
    class="shrink-0 rounded-t-lg variant-ringed hover:variant-ghost flex px-1 justify-center items-center"
>
    <!-- 圖標: 删除 or 取消 -->
    <button
        title={index === selected && opMode === modeDelete
            ? "取消"
            : "删除鍵盤"}
        on:click={tryDelKbd}
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
            bind:value={keyboardName}
            placeholder="天行鍵"
            use:autoFocus
            on:blur={() => (opMode = 0)}
            class="bg-transparent h-10 p-1"
        />
    {:else}
        <!-- 鍵盤名導航鍵 -->
        <button title="點擊重命名" on:click={clickTab} class="h-10 p-1">
            {keyboardName}
        </button>
    {/if}

    <!-- 圖標: 鍵盤 or 删除 -->
    {#if index === selected && opMode === modeDelete}
        <button
            title="删除"
            on:click={onDelKeyboard}
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
