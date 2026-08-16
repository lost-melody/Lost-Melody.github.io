<script lang="ts">
    interface Props {
        text: string;
    }
    let { text }: Props = $props();
</script>

<code class="code">{text}</code>
