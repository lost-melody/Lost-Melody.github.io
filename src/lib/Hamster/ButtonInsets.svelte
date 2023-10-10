<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { ButtonInsets } from "./Hamster";

    /** 按鍵内距綁定值 */
    export var buttonInsets: ButtonInsets;

    const icons: [string, string, string, string] = [
        "mdi:arrow-collapse-left",
        "mdi:arrow-collapse-down",
        "mdi:arrow-collapse-up",
        "mdi:arrow-collapse-right",
    ];
    const [min, max, step] = [0x0, 0xf, 0x1];
</script>

{#if buttonInsets.expr}
    <!-- 表達式内距 -->
    <div class="grid grid-cols-2 gap-1">
        {#each [0, 3, 2, 1] as index}
            <div class="input-group flex px-2 justify-center items-center">
                <Icon height="20" icon={icons[index]} />
                <input
                    type="number"
                    bind:value={buttonInsets.insets[index]}
                    class="w-16 px-2 py-1"
                    {min}
                    {max}
                    {step}
                />
            </div>
        {/each}
    </div>
{:else}
    <!-- 數值内距 -->
    <div class="input-group flex justify-center items-center">
        <Icon height="24" icon="mdi:arrow-collapse" />
        <input
            type="number"
            bind:value={buttonInsets.value}
            class="w-32 px-2 py-1"
            placeholder="0"
            {min}
            {max}
            {step}
        />
    </div>
{/if}
