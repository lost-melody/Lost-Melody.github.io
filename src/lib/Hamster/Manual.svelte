<script lang="ts">
    const patchCode =
        "patch:\n" +
        "  # 下面兩行是導入自定義配色方案文件\n" +
        "  keyboard/colorSchemas:\n" +
        "    __include: custom_color_schemas:/keyboard/colorSchemas\n" +
        "  # 下面兩行是導入自定義鍵盤佈局文件, 如果使用倉UI導入則不需要這兩行\n" +
        "  keyboards:\n" +
        "    __include: custom_keyboards:/keyboards";
</script>

<div class="p-2 rounded-md variant-soft">
    <ul>
        <li>功能區</li>
        <ul>
            <li>頂部操作欄: 用於執行導入導出, 存取檔案, 批量操作等</li>
            <ul>
                <li>導入導出: 將配色或佈局導出爲文件, 以供倉APP便用; 或從先前導出的文件中加載配色或佈局配置</li>
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

        <li>導入導出</li>
        <ul>
            <li>導入配色方案或鍵盤佈局</li>
            <ul>
                <li>從 <i>yaml</i> 文件的 <code>keyboard/colorSchemas</code> 節點導入配色方案</li>
                <li>從 <i>yaml</i> 文件的 <code>keyboards</code> 節點導入鍵盤佈局</li>
            </ul>
            <li>導出配色方案: 將配色導出爲文件, 隨後可在倉APP中通過手動引用文件的方式應用</li>
            <li>導出鍵盤佈局: 將鍵盤佈局導出爲文件, 隨後在倉APP中手動引用文件或在佈局界面點擊加號導入</li>
            <ul>
                <li>索引按鍵樣式: 按鍵樣式使用索引方式存儲在文件中, 因而在倉APP中無法自動導入, 只能手動引用文件</li>
                <li>
                    内聯按鍵樣式: 按鍵樣式内聯到按鍵配置中, 可以直接在佈局界面導入到倉APP中, 但是
                    <b>無法導入回本工具</b>, 否則會丢失按鍵樣式數據
                </li>
            </ul>
        </ul>

        <li>應用到倉APP</li>
        <ul>
            <li>
                補丁文件: 在 <code>Hamster/Rime/</code> 下新建文件 <code>hamster.custom.yaml</code>, 並填入以下内容:
            </li>
            <pre class="p-2 pre text-sm rounded-md variant-soft">{patchCode}</pre>
            <li>
                配色方案: 將導出的配色方案文件移動到 <code>Hamster/Rime/</code> 並改名爲
                <code>custom_color_schemas.yaml</code>, 然後重新部署
            </li>
            <li>鍵盤佈局:</li>
            <ul>
                <li>
                    方法一: 將導出的 <b>内聯</b> 模式文件 <b>移動到 <code>Hamster/</code> 中</b>, 並在
                    <i>鍵盤設置-鍵盤佈局</i> 頁面選擇導入該文件
                </li>
                <li>
                    方法二: 將導出的 <b>索引</b> 模式文件移動到 <code>Hamster/Rime/</code> 並改名爲
                    <code>custom_keyboards.yaml</code>, 然後重新部署
                </li>
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
