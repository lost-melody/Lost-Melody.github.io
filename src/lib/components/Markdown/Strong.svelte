<script lang="ts">
    interface Props {
        text: string;
    }
    let { text }: Props = $props();
</script>

<strong class="font-bold">{text}</strong>
