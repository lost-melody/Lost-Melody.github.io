<script lang="ts">
    import { page } from "$app/stores";
    import Icon from "@iconify/svelte";
</script>

<h1 class="h1">{$page.status}</h1>
<h2 class="h2">{$page.error && $page.error.message}</h2>

<a href="/" class="btn variant-ghost">
    <Icon icon="mdi:home" />
    返回首頁
</a>
