<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";
    import type { Row } from "./Hamster";

    export var selected: number | null;
    export var row: Row;

    var dispatch = createEventDispatcher();
    /** 發送按鍵選定事件 */
    function select(index: number): void {
        dispatch("select", { index });
    }
    /** 發送新增按鍵事件 */
    function newButton(): void {
        dispatch("newbtn");
    }
</script>

<div class="flex p-2 variant-ringed rounded-lg">
    {#each row.keys as key, index (key.id)}
        <button
            class:variant-ghost={index === selected}
            class="w-8"
            on:click={() => select(index)}
        >
            {key.action.display()}
        </button>
    {/each}
    <button on:click={newButton} class="btn-icon variant-ringed">
        <Icon icon="mdi:plus" />
    </button>
</div>
