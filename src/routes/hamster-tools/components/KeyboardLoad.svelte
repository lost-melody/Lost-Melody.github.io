<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        keyboard: any;
        remove?: boolean;
        override?: boolean;
        onremove?: () => void;
        onload?: () => void;
        onoverride?: () => void;
    }
    let { keyboard, remove = false, override = false, onremove, onload, onoverride }: Props = $props();

    const [modeRemove, modeOverride, modeLoad] = [1, 2, 3];
    let opMode = $state(0);
    let timeout = $state<ReturnType<typeof setTimeout> | undefined>();
    let name = $derived(typeof keyboard.name === "string" ? keyboard.name : "鍵盤");

    let display = $derived(
        !opMode ? name : `${opMode === modeRemove ? "删除" : opMode === modeOverride ? "覆蓋" : "加載"}中, 點擊取消`,
    );

    /** 延遲作業 */
    function delay(f: () => void) {
        clearTimeout(timeout);
        timeout = setTimeout(f, 2000);
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

    /** 準備删除 */
    function tryRemove(): void {
        if (setMode(modeRemove)) {
            delay(() => {
                if (opMode === modeRemove) {
                    opMode = 0;
                    onremove?.();
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
                    onload?.();
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
                    onoverride?.();
                }
            });
        }
    }
</script>

<div class="preset-outlined hover:preset-tonal flex h-8 items-center gap-1 rounded-md px-2 py-1">
    <!-- 删除檔案 -->
    {#if remove}
        <button
            title="删除此檔案數據"
            onclick={tryRemove}
            class="hover:preset-outlined flex items-center rounded-full p-1"
        >
            <Icon icon={opMode === modeRemove ? "mdi:cancel" : "mdi:close"} />
        </button>
    {/if}
    <!-- 加載檔案 -->
    <button
        title="點擊以此檔案數據覆蓋當前編輯配置"
        onclick={tryLoad}
        class="flex w-full items-center justify-center rounded-md p-1 text-nowrap"
        class:text-xs={opMode}
    >
        {display}
    </button>
    <!-- 覆蓋檔案 -->
    {#if override}
        <button
            title="將當前編輯配置覆蓋到此存檔上"
            onclick={tryOverride}
            class="hover:preset-outlined flex items-center rounded-full p-1"
        >
            <Icon icon={opMode === modeOverride ? "mdi:cancel" : "mdi:content-save"} />
        </button>
    {/if}
</div>
