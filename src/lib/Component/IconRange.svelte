<script lang="ts">
    import Icon from "@iconify/svelte";

    export var icon: string;
    export var height: string | number = "";
    export var color: string = "";
    export var title: string;
    export var value: number;

    export var r_tl: boolean = false;
    export var r_tr: boolean = false;
    export var r_bl: boolean = false;
    export var r_br: boolean = false;

    var classNames: string = "";
    export { classNames as class };
</script>

<div
    class={classNames}
    class:rounded-tl-md={r_tl}
    class:rounded-tr-md={r_tr}
    class:rounded-bl-md={r_bl}
    class:rounded-br-md={r_br}
>
    <Icon {icon} {height} {color} />
    <slot>
        <span class="grow shrink">{title}</span>
    </slot>
    <input on:change {title} type="range" bind:value {...$$restProps} class="w-[30%]" />
    <span class="w-6">{value}</span>
</div>
