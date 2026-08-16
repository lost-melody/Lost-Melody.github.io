<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { Snippet } from "svelte";

    interface Props {
        icon: string;
        height?: string | number;
        color?: string;
        r_tl?: boolean;
        r_tr?: boolean;
        r_bl?: boolean;
        r_br?: boolean;
        onclick?: (event: MouseEvent) => void;
        children?: Snippet;
        [key: string]: any;
    }
    let {
        icon,
        height = "",
        color = "",
        r_tl = false,
        r_tr = false,
        r_bl = false,
        r_br = false,
        onclick,
        children,
        ...restProps
    }: Props = $props();
</script>

<button
    {onclick}
    {...restProps}
    class:rounded-tl-md={r_tl}
    class:rounded-tr-md={r_tr}
    class:rounded-bl-md={r_bl}
    class:rounded-br-md={r_br}
>
    <Icon {icon} {height} {color} />
    {@render children?.()}
</button>
