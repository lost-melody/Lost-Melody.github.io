<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { ButtonInsets } from "./Hamster";

    export var buttonInsets: ButtonInsets;

    const icons: [string, string, string, string] = [
        "mdi:arrow-left",
        "mdi:arrow-down",
        "mdi:arrow-up",
        "mdi:arrow-right",
    ];
    const [min, max, step] = [0x0, 0xf, 0x1];
</script>

{#if buttonInsets.expr}
    <!-- 表達式内距 -->
    <div class="grid grid-cols-2 gap-1">
        {#each [0, 3, 2, 1] as index}
            <div class="input-group flex justify-center items-center">
                <Icon height="24" icon={icons[index]} />
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
        <Icon height="24" icon="mdi:arrow-left-right" />
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
