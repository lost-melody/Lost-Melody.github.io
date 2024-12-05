<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { ButtonInsets } from "./model/keyboardLayout";

    /** 按鍵内距綁定值 */
    export var buttonInsets: ButtonInsets;

    const icons: [string, string, string, string] = [
        "mdi:arrow-collapse-left",
        "mdi:arrow-collapse-down",
        "mdi:arrow-collapse-up",
        "mdi:arrow-collapse-right",
    ];
    const labels: [string, string, string, string] = ["左内距", "下内距", "上内距", "右内距"];
    const [min, max] = [0x0, 0xf];
</script>

<div>
    {#if buttonInsets.expr}
        <!-- 表達式内距 -->
        {#each [2, 1, 0, 3] as index, i}
            <div
                class="variant-ringed flex h-10 items-center gap-1 px-2 hover:variant-ghost"
                class:rounded-t-md={i === 0}
                class:rounded-b-md={i === 3}
            >
                <Icon height="20" icon={icons[index]} />
                <span class="flex h-full grow items-center border-l border-r border-surface-500 px-2"
                    >{labels[index]}</span
                >
                <input type="range" bind:value={buttonInsets.insets[index]} class="w-[50%] px-2 py-1" {min} {max} />
                <span class="w-4">{buttonInsets.insets[index]}</span>
            </div>
        {/each}
    {:else}
        <!-- 數值内距 -->
        <div class="variant-ringed flex h-10 items-center gap-1 rounded-md px-2 hover:variant-ghost">
            <Icon height="20" icon="mdi:arrow-collapse" />
            <span class="flex h-full grow items-center border-l border-r border-surface-500 px-2">内距</span>
            <input type="range" bind:value={buttonInsets.value} class="w-[50%] px-2 py-1" {min} {max} />
            <span class="w-4">{buttonInsets.value}</span>
        </div>
    {/if}
</div>
