- 功能區
  - 頂部操作欄: 用於執行導入導出, 存取檔案, 批量操作等
    - 導入導出: 將配色或佈局導出爲文件, 以供倉APP使用; 或從先前導出的文件中加載配色或佈局配置
    - 模板列表: 網站預配置的一些佈局, 點擊後會覆蓋當前選定的鍵盤佈局
    - 存檔列表: 用於臨時存放已配置的佈局檔案. 功能可能會做調整, 長期保存請使用導出功能
    - 操作列表: 對當前鍵盤佈局執行批量操作
  - 配置列表: 預覽當前已添加的配色或佈局方案, 點擊切換要編輯的項目
  - 預覽區: 顯示當前配置下的預覽效果, 僅供配置參考, 不完全代表實際效果
  - 編輯區: 對當前選定的配色或佈局進行調整
    - 配色方案: 修改選定的全局配色方案名稱 (不可重复), 作者, 顔色等
    - 鍵盤佈局: 調整當前鍵盤的名稱 (不可重复), 按鍵行數, 每行的按鍵數
    - 按鍵功能: 調整按鍵按下, 劃動, 長按等動作觸發的功能, 以及應用按鍵級别的樣式
    - 按鍵内距: 調整當前佈局的按鍵内距, 卽按鍵邊框和其所在方格區域邊界間的空白寛度
    - 按鍵樣式: 添加和修改按鍵樣式, 這些樣式隨後可在 _按鍵_ 中應用
- 導入與導出
  - 導入配色方案或鍵盤佈局
    - 從 _yaml_ 文件的 `colorSchemas` 節點導入配色方案
    - 從 _yaml_ 文件的 `keyboards` 節點導入鍵盤佈局
    - 從 _yaml_ 文件的 `keyStyle` 節點導入按鍵樣式
  - 導出配置: 將配色, 佈局和樣式一同導出爲文件, 隨後可在倉APP中手動引用或導入
- 應用到倉APP
  - 通過内置導入功能導入
    - 將從此頁面導出的完整配置文件移動到 `iPhone/Hamster/` 下
    - 在倉輸入法「自定義鍵盤」右上角加號菜單中選擇「導入配色與佈局」, 並選擇剛才準備的文件
  - 通過文件手動導入
    - 將從此頁面導出的完整配置文件存儲爲 `Rime/custom_configs.yaml`
    - 新建文件 `Rime/hamster.custom.yaml`, 並填入以下内容:
    - ```yaml
      patch:
        # 倸用此方法導入配置, 請確認已經在倉APP中「重置界面設置」
        # 如果使用過倉内置編輯器的編輯或導入功能, 則此處配置會被覆盖
        keyboard/colorSchemas:
          # 導入配色方案
          __include: custom_configs:/keyboard/colorSchemas
        keyboards:
          # 導入鍵盤佈局
          __include: custom_configs:/keyboards
      ```
