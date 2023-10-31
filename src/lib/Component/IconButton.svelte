<script lang="ts">
    import { scale } from "svelte/transition";
    import Icon from "@iconify/svelte";

    export var icon: string;
    export var height: string | number = "";
    export var color: string = "";
</script>

<button transition:scale on:click {...$$restProps}>
    <Icon {icon} {height} {color} />
    <slot />
</button>
