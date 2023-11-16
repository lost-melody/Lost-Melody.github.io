<script lang="ts">
    import Icon from "@iconify/svelte";

    export var icon: string;
    export var height: string | number = "";
    export var color: string = "";
</script>

<button on:click {...$$restProps}>
    <Icon {icon} {height} {color} />
    <slot />
</button>
