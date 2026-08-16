<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { Snippet } from "svelte";

    interface Props {
        icon: string;
        height?: string | number;
        color?: string;
        title: string;
        value?: number;
        r_tl?: boolean;
        r_tr?: boolean;
        r_bl?: boolean;
        r_br?: boolean;
        class?: string;
        onchange?: (event: Event) => void;
        children?: Snippet;
        [key: string]: any;
    }
    let {
        icon,
        height = "",
        color = "",
        title,
        value = $bindable(),
        r_tl = false,
        r_tr = false,
        r_bl = false,
        r_br = false,
        class: classNames = "",
        onchange,
        children,
        ...restProps
    }: Props = $props();
</script>

<div
    class={classNames}
    class:rounded-tl-md={r_tl}
    class:rounded-tr-md={r_tr}
    class:rounded-bl-md={r_bl}
    class:rounded-br-md={r_br}
>
    <Icon {icon} {height} {color} />
    {#if children}
        {@render children()}
    {:else}
        <span class="shrink grow">{title}</span>
    {/if}
    <input {onchange} {title} type="range" bind:value {...restProps} class="w-[30%]" />
    <span class="w-6">{value}</span>
</div>
