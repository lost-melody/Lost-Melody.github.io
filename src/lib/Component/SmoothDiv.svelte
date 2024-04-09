<script lang="ts">
    import { tweened, type TweenedOptions } from "svelte/motion";
    import { cubicOut } from "svelte/easing";

    /** 應用到外層容器的類名 */
    export var outerClass: string = "";
    /** 是否平滑寛度 */
    export var width: boolean = false;
    /** 是否平滑高度 */
    export var height: boolean = false;

    const opts: TweenedOptions<number> = {
        easing: cubicOut,
    };
    const w = tweened(0, opts);
    const h = tweened(0, opts);

    $: sw = width ? `width: ${$w}px;` : "";
    $: sh = height ? `height: ${$h}px;` : "";
</script>

<div class={outerClass} style={sw + sh} class:overflow-x-hidden={width} class:overflow-y-hidden={height}>
    <div {...$$restProps} bind:clientWidth={$w} bind:clientHeight={$h}>
        <slot />
    </div>
</div>
