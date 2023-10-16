<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";

    export var keyboard: any;
    export var remove: boolean = false;
    export var override: boolean = false;

    const [modeRemove, modeOverride, modeLoad] = [1, 2, 3];
    var opMode = 0;
    var timeout: NodeJS.Timeout;
    $: name = typeof keyboard.name === "string" ? keyboard.name : "鍵盤";

    $: display = !opMode
        ? name
        : `${
              opMode === modeRemove
                  ? "删除"
                  : opMode === modeOverride
                  ? "覆蓋"
                  : "加載"
          }中, 點擊取消`;

    /** 延遲作業 */
    function delay(f: () => void) {
        clearTimeout(timeout);
        timeout = setTimeout(f, 2500);
    }
    /** 切換模式 */
    function setMode(mode: number): number {
        if (opMode === 0) {
            opMode = mode;
        } else {
            opMode = 0;
        }
        return opMode;
    }

    const dispatch = createEventDispatcher();
    /** 移除按鈕點擊事件 */
    function onRemove(): void {
        dispatch("remove");
    }
    /** 加載按鈕點擊事件 */
    function onLoad(): void {
        dispatch("load");
    }
    /** 覆蓋按鈕點擊事件 */
    function onOverride(): void {
        dispatch("override");
    }

    /** 準備删除 */
    function tryRemove(): void {
        if (setMode(modeRemove)) {
            delay(() => {
                if (opMode === modeRemove) {
                    opMode = 0;
                    onRemove();
                }
            });
        }
    }
    /** 準備加載 */
    function tryLoad(): void {
        if (setMode(modeLoad)) {
            delay(() => {
                if (opMode === modeLoad) {
                    opMode = 0;
                    onLoad();
                }
            });
        }
    }
    /** 準備覆蓋 */
    function tryOverride(): void {
        if (setMode(modeOverride)) {
            delay(() => {
                if (opMode === modeOverride) {
                    opMode = 0;
                    onOverride();
                }
            });
        }
    }
</script>

<div class="px-2 py-1 h-8 gap-1 rounded-full variant-ghost flex items-center">
    <!-- 删除檔案 -->
    {#if remove}
        <button
            title="删除此檔案數據"
            on:click={tryRemove}
            class="p-1 rounded-full hover:variant-ringed flex items-center"
        >
            <Icon icon={opMode === modeRemove ? "mdi:cancel" : "mdi:close"} />
        </button>
    {/if}
    <!-- 加載檔案 -->
    <button
        title="點擊以此檔案數據覆蓋當前編輯配置"
        on:click={tryLoad}
        class="p-1 w-full justify-center rounded-md hover:variant-soft flex items-center"
    >
        {display}
    </button>
    <!-- 覆蓋檔案 -->
    {#if override}
        <button
            title="將當前編輯配置覆蓋到此存檔上"
            on:click={tryOverride}
            class="p-1 rounded-full hover:variant-ringed flex items-center"
        >
            <Icon
                icon={opMode === modeOverride
                    ? "mdi:cancel"
                    : "mdi:content-save"}
            />
        </button>
    {/if}
</div>
