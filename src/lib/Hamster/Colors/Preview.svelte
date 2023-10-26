<script lang="ts">
    import type { ColorSchema } from "./HamsterColors";
    import Key from "./Key.svelte";

    export var schema: ColorSchema;
    export var upper: boolean = false;
</script>

<div
    style={`background-color: ${schema.back_color.rgba()};`}
    class="w-full max-w-[400px] mx-auto rounded-md backdrop-blur"
>
    <!-- 一排預編輯欄 -->
    <div class="w-full px-2">
        <span style={`color: ${schema.text_color.rgba()};`} class="text-xs">
            shouxuan
        </span>
    </div>
    <!-- 一排候選欄 -->
    <div class="w-full px-2 gap-2 flex items-center">
        <!-- 首選 -->
        <span
            style={`color: ${schema.hilited_candidate_text_color.rgba()};` +
                `background-color: ${schema.hilited_candidate_back_color.rgba()};`}
            class="px-1 rounded-md text-lg"
        >
            首選
            <span
                style={`color: ${schema.hilited_comment_text_color.rgba()};`}
                class="text-xs"
            >
                uzxr
            </span>
        </span>
        <!-- 次選 -->
        {#each ["次選", "三選"] as cand, index}
            <span
                style={`color: ${schema.candidate_text_color.rgba()};`}
                class="px-1 rounded-md text-lg"
            >
                {cand}
                <span
                    style={`color: ${schema.comment_text_color.rgba()};`}
                    class="text-xs"
                >
                    {["cixr", "sjxr"][index]}
                </span>
            </span>
        {/each}
    </div>
    <!-- 四排按鍵 -->
    <div class="flex justify-center">
        {#each "qwertyuiop" as key, index}
            <Key {key} {schema} {upper} swipe={"1234567890"[index]} />
        {/each}
    </div>
    <div class="flex justify-center">
        {#each "asdfghjkl" as key, index}
            <Key {key} {schema} {upper} swipe={"!@#$%^&*("[index]} />
        {/each}
    </div>
    <div class="flex justify-center">
        {#each "zxcvbnm⌫" as key, index}
            <Key {key} {schema} {upper} swipe={"`([{/\\;'"[index]} />
        {/each}
    </div>
    <div class="flex justify-center">
        {#each "#,␣.↵" as key, index}
            <Key
                {key}
                {schema}
                {upper}
                swipe={"英< >⌘"[index]}
                width={index === 2 ? 40 : index === 0 || index === 4 ? 20 : 10}
            />
        {/each}
    </div>
</div>
