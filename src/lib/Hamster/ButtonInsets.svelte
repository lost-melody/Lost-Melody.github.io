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
                class="flex h-10 px-2 gap-1 items-center variant-ringed hover:variant-ghost"
                class:rounded-t-md={i === 0}
                class:rounded-b-md={i === 3}
            >
                <Icon height="20" icon={icons[index]} />
                <span class="h-full px-2 items-center flex grow border-surface-500 border-l border-r"
                    >{labels[index]}</span
                >
                <input type="range" bind:value={buttonInsets.insets[index]} class="px-2 py-1 w-[50%]" {min} {max} />
                <span class="w-4">{buttonInsets.insets[index]}</span>
            </div>
        {/each}
    {:else}
        <!-- 數值内距 -->
        <div class="flex h-10 px-2 gap-1 items-center rounded-md variant-ringed hover:variant-ghost">
            <Icon height="20" icon="mdi:arrow-collapse" />
            <span class="h-full px-2 items-center flex grow border-surface-500 border-l border-r">内距</span>
            <input type="range" bind:value={buttonInsets.value} class="px-2 py-1 w-[50%]" {min} {max} />
            <span class="w-4">{buttonInsets.value}</span>
        </div>
    {/if}
</div>
