<script lang="ts">
    import Icon from "@iconify/svelte";

    export var icon: string;
    export var height: string | number = "";
    export var color: string = "";
    export var title: string;
    export var value: number;
    var classNames: string = "";
    export { classNames as class };
</script>

<div class={classNames}>
    <Icon {icon} {height} {color} />
    <slot>
        <span class="grow shrink">{title}</span>
    </slot>
    <input
        on:change
        {title}
        type="range"
        bind:value
        {...$$restProps}
        class="w-[30%]"
    />
    <span class="w-6">{value}</span>
</div>
