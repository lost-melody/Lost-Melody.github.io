<script lang="ts">
    import type { ButtonInsets } from "./Hamster";

    export var buttonInsets: ButtonInsets;
    $: insets = buttonInsets.insets;

    const [min, max, step] = [0x0, 0xf, 0x1];
</script>

<!-- 内距值輸入框 -->
<div class="grid grid-cols-3 grid-rows-3 gap-1">
    <!-- 數值内距 -->
    <input
        type="number"
        bind:value={buttonInsets.value}
        disabled={buttonInsets.expr}
        class="input w-16 px-2 py-1 row-start-2 col-start-2"
        placeholder="0"
        {min}
        {max}
        {step}
    />

    <!-- 表達式内距: 左下上右 -->
    <input
        type="number"
        bind:value={insets.left}
        disabled={!buttonInsets.expr}
        class="input w-16 px-2 py-1 row-start-2 col-start-1"
        placeholder="L"
        {min}
        {max}
        {step}
    />
    <input
        type="number"
        bind:value={insets.bottom}
        disabled={!buttonInsets.expr}
        class="input w-16 px-2 py-1 row-start-3 col-start-2"
        placeholder="B"
        {min}
        {max}
        {step}
    />
    <input
        type="number"
        bind:value={insets.top}
        disabled={!buttonInsets.expr}
        class="input w-16 px-2 py-1 row-start-1 col-start-2"
        placeholder="T"
        {min}
        {max}
        {step}
    />
    <input
        type="number"
        bind:value={insets.right}
        disabled={!buttonInsets.expr}
        class="input w-16 px-2 py-1 row-start-2 col-start-3"
        placeholder="R"
        {min}
        {max}
        {step}
    />
</div>
