<script lang="ts">
    import { tweened, type TweenOptions } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import type { Snippet } from "svelte";

    interface Props {
        outerClass?: string;
        width?: boolean;
        height?: boolean;
        children?: Snippet;
        [key: string]: any;
    }
    let { outerClass = "", width = false, height = false, children, ...restProps }: Props = $props();

    const opts: TweenOptions<number> = {
        easing: cubicOut,
    };
    const w = tweened(0, opts);
    const h = tweened(0, opts);

    let sw = $derived(width ? `width: ${$w}px;` : "");
    let sh = $derived(height ? `height: ${$h}px;` : "");
</script>

<div class={outerClass} style={sw + sh} class:overflow-x-hidden={width} class:overflow-y-hidden={height}>
    <div {...restProps} bind:clientWidth={$w} bind:clientHeight={$h}>
        {@render children?.()}
    </div>
</div>
