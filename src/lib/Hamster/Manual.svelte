<script lang="ts">
    import patchCode from "$lib/assets/hamster-tools/hamster.custom.yaml?raw";
</script>

<div class="p-2 rounded-md variant-soft">
    <ul>
        <li>功能區</li>
        <ul>
            <li>頂部操作欄: 用於執行導入導出, 存取檔案, 批量操作等</li>
            <ul>
                <li>導入導出: 將配色或佈局導出爲文件, 以供倉APP使用; 或從先前導出的文件中加載配色或佈局配置</li>
                <li>模板列表: 網站預配置的一些佈局, 點擊後會覆蓋當前選定的鍵盤佈局</li>
                <li>存檔列表: 用於臨時存放已配置的佈局檔案. 功能可能會做調整, 長期保存請使用導出功能</li>
                <li>操作列表: 對當前鍵盤佈局執行批量操作</li>
            </ul>
            <li>配置列表: 預覽當前已添加的配色或佈局方案, 點擊切換要編輯的項目</li>
            <li>預覽區: 顯示當前配置下的預覽效果, 僅供配置參考, 不完全代表實際效果</li>
            <li>編輯區: 對當前選定的配色或佈局進行調整</li>
            <ul>
                <li>配色方案: 修改選定的全局配色方案名稱 (不可重复), 作者, 顔色等</li>
                <li>鍵盤佈局: 調整當前鍵盤的名稱 (不可重复), 按鍵行數, 每行的按鍵數</li>
                <li>按鍵功能: 調整按鍵按下, 劃動, 長按等動作觸發的功能, 以及應用按鍵級别的樣式</li>
                <li>按鍵内距: 調整當前佈局的按鍵内距, 卽按鍵邊框和其所在方格區域邊界間的空白寛度</li>
                <li>按鍵樣式: 添加和修改按鍵樣式, 這些樣式隨後可在 <i>按鍵</i> 中應用</li>
            </ul>
        </ul>

        <li>導入與導出</li>
        <ul>
            <li>導入配色方案或鍵盤佈局</li>
            <ul>
                <li>從 <i>yaml</i> 文件的 <code>keyboard/colorSchemas</code> 節點導入配色方案</li>
                <li>從 <i>yaml</i> 文件的 <code>keyboards</code> 節點導入鍵盤佈局</li>
                <li>從 <i>yaml</i> 文件的 <code>keyStyle</code> 節點導入按鍵樣式</li>
            </ul>
            <li>導出配置: 將配色, 佈局和樣式一同導出爲文件, 隨後可在倉APP中手動引用或導入</li>
        </ul>

        <li>應用到倉APP</li>
        <ul>
            <li>通過内置導入功能導入</li>
            <ul>
                <li>將從此頁面導出的完整配置文件移動到 <code>iPhone/Hamster/</code> 下</li>
                <li>在倉輸入法「自定義鍵盤」右上角加號菜單中選擇「導入配色與佈局」, 並選擇剛才準備的文件</li>
            </ul>
        </ul>
        <ul>
            <li>通過文件手動導入</li>
            <ul>
                <li>將從此頁面導出的完整配置文件存儲爲 <code>Rime/custom_configs.yaml</code></li>
                <li>新建文件 <code>Rime/hamster.custom.yaml</code>, 並填入以下内容:</li>
                <pre class="p-2 pre text-sm rounded-md variant-soft">{patchCode}</pre>
            </ul>
        </ul>
    </ul>
</div>

<style lang="postcss">
    ul {
        @apply ml-4 list-disc;
    }
    code {
        @apply code;
    }
</style>
