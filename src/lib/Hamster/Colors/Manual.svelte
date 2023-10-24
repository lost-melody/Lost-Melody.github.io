<script lang="ts">
    import { fade } from "svelte/transition";
</script>

<div transition:fade class="text-xs p-2 rounded-md mx-auto variant-ghost">
    <p class="text-center">不太詳細的使用説明</p>
    <ol class="list-inside list-decimal">
        <li>點擊顔色選取按鈕, 調用系統色盤選取顔色</li>
        <li>
            點擊顔色值顯示框, 直接修改顔色值, 範圍在 <code class="code">
                #000000-#ffffff
            </code> 之間
        </li>
        <li>
            滑動滑條, 更改顔色透明度, 範圍在 <code class="code"> 00-ff </code> 之間
        </li>
        <li>點擊鍵盤預覽區下方的「删除」按鈕, 從配色列表中移除本配色</li>
        <li>
            點擊預覽區下方的「複製」「粘貼」按鈕, 將當前配色複製到另一配色中
        </li>
        <li>
            導入與導出
            <ol class="indent-4 list-inside list-decimal">
                <li>點擊「複製」按鈕複製所有配色到剪貼板</li>
                <li>
                    點擊「導出」按鈕將所有配色導出爲文件, 格式同 <code
                        class="code"
                    >
                        hamster.yaml
                    </code>, 配置路徑爲
                    <code class="code"> Keyboard/colorSchemas </code>
                </li>
                <li>
                    點擊「導入」按鈕選取文件導入, 文件格式同 <code class="code">
                        hamster.yaml
                    </code>
                </li>
            </ol>
        </li>
        <li>
            操作建議
            <ol class="indent-4 list-inside list-decimal">
                <li>建議從 <i>iOS Safari</i> 打開此頁面</li>
                <li>
                    从 <code class="code"> hamster.yaml </code> 中導入當前倉中的所有配色
                </li>
                <li>在頁面中作出一些個人修改</li>
                <li>修改完成後, 點擊「複製」按鈕, 將代碼複製到系統剪貼板中</li>
                <li>
                    在「倉輸入法」中編輯 <code class="code">
                        hamster.yaml
                    </code>
                    文件, 將 <code class="code"> Keyboard/colorSchemas </code> 下的列表删除
                </li>
                <li>
                    將頁面上複製的代碼粘貼到 <code class="code">
                        colorSchemas:
                    </code> 下, 並確保删除多餘的字段
                </li>
            </ol>
        </li>
    </ol>
    <p><code class="code"> hamster.yaml </code> 中的配置應當形如:</p>
    <pre class="pre variant-ghost whitespace-pre text-xs">{"...\n" +
            "Keyboard:\n" +
            "  ...\n" +
            "  colorSchemas:\n" +
            '    - name: "鍵盤1"\n' +
            '      author: "餅乾"\n' +
            "      ...\n" +
            '    - name: "鍵盤2"\n' +
            '      author: "餅乾"\n' +
            "      ...\n" +
            "  ...\n" +
            "...\n"}</pre>
</div>
