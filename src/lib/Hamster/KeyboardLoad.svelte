<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";

    export var keyboard: any;
    export var remove: boolean = false;
    export var override: boolean = false;

    $: name = typeof keyboard.name === "string" ? keyboard.name : "鍵盤";

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
</script>

<div class="px-2 py-1 gap-1 rounded-full variant-ghost flex items-center">
    <!-- 删除檔案 -->
    {#if remove}
        <button on:click={onRemove} class="p-1 rounded-full hover:variant-ringed flex items-center">
            <Icon color="red" icon="mdi:content-save-minus" />
        </button>
    {/if}
    <!-- 加載檔案 -->
    <button on:click={onLoad} class="p-1 rounded-md hover:variant-soft flex items-center">
        <Icon icon="mdi:content-save-move" />
        {name}
    </button>
    <!-- 覆蓋檔案 -->
    {#if override}
        <button on:click={onOverride} class="p-1 rounded-full hover:variant-ringed flex items-center">
            <Icon color="green" icon="mdi:content-save-plus" />
        </button>
    {/if}
</div>
