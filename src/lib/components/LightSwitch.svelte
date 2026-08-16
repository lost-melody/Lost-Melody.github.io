<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        checked?: boolean;
        onchange?: () => void;
    }
    let { checked = false, onchange }: Props = $props();
</script>

<button class="preset-tonal btn-icon" onclick={onchange} type="button" aria-label="切換暗色模式">
    {#if checked}
        <Icon icon="mdi:weather-sunny" />
    {:else}
        <Icon icon="mdi:weather-night" />
    {/if}
</button>
