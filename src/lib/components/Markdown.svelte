<script lang="ts">
    import SvelteMarkdown from "@humanspeak/svelte-markdown";

    import Code from "./Markdown/Code.svelte";
    import CodeSpan from "./Markdown/CodeSpan.svelte";
    import Em from "./Markdown/Em.svelte";
    import Heading from "./Markdown/Heading.svelte";
    import List from "./Markdown/List.svelte";
    import ListItem from "./Markdown/ListItem.svelte";
    import Strong from "./Markdown/Strong.svelte";

    interface Props {
        source: string;
    }
    let { source }: Props = $props();
</script>

<SvelteMarkdown
    {source}
    renderers={{
        code: Code,
        codespan: CodeSpan,
        em: Em,
        heading: Heading,
        list: List,
        listitem: ListItem,
        strong: Strong,
    }}
/>
