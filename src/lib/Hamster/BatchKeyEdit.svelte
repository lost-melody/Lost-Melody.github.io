<script lang="ts">
    import type { Keyboard } from "./model/keyboardLayout";
    import IconButton from "$lib/Component/IconButton.svelte";

    export var layout: Keyboard;

    function allSwipeUp(show: boolean): void {
        var flagged = false;
        for (let row of layout.rows) {
            for (let key of row.keys) {
                if (key.swipe[2].display !== show) {
                    key.swipe[2].display = show;
                    flagged = true;
                }
            }
        }
        if (flagged) {
            layout.rows = layout.rows;
        }
    }
    function allSwipeDown(show: boolean): void {
        var flagged = false;
        for (let row of layout.rows) {
            for (let key of row.keys) {
                if (key.swipe[1].display !== show) {
                    key.swipe[1].display = show;
                    flagged = true;
                }
            }
        }
        if (flagged) {
            layout.rows = layout.rows;
        }
    }

    function allSwipeUpByRime(byRime: boolean): void {
        var flagged = false;
        layout.rows.forEach((row) => {
            row.keys.forEach((key) => {
                if (key.swipe[2].processByRIME != byRime) {
                    key.swipe[2].processByRIME = byRime;
                    flagged = true;
                }
            });
        });
        if (flagged) {
            layout.rows = layout.rows;
        }
    }
    function allSwipeDownByRime(byRime: boolean): void {
        var flagged = false;
        layout.rows.forEach((row) => {
            row.keys.forEach((key) => {
                if (key.swipe[1].processByRIME != byRime) {
                    key.swipe[1].processByRIME = byRime;
                    flagged = true;
                }
            });
        });
        if (flagged) {
            layout.rows = layout.rows;
        }
    }

    function allKeyByRime(byRime: boolean): void {
        var flagged = false;
        layout.rows.forEach((row) => {
            row.keys.forEach((key) => {
                if (key.processByRIME != byRime) {
                    key.processByRIME = byRime;
                    flagged = true;
                }
            });
        });
        if (flagged) {
            layout.rows = layout.rows;
        }
    }

    function syncPortraitKeyWidthToLandscape(): void {
        var flagged = false;
        for (let row of layout.rows) {
            for (let key of row.keys) {
                if (key.landscape !== key.width || key.autoLandscape !== key.autoWidth) {
                    key.landscape = key.width;
                    key.autoLandscape = key.autoWidth;
                    flagged = true;
                }
            }
        }
        if (flagged) {
            layout.rows = layout.rows;
        }
    }

    const classNames = "p-2 gap-2 h-8 w-full flex items-center rounded-md hover:variant-ghost";
</script>

<div class="flex flex-col gap-1">
    <IconButton
        icon="mdi:eye"
        on:click={() => {
            allSwipeUp(true);
        }}
        class={classNames}
    >
        <span>顯示所有上劃字符</span>
    </IconButton>
    <IconButton
        icon="mdi:eye-off"
        on:click={() => {
            allSwipeUp(false);
        }}
        class={classNames}
    >
        <span>隱藏所有上劃字符</span>
    </IconButton>
    <IconButton
        icon="mdi:eye"
        on:click={() => {
            allSwipeDown(true);
        }}
        class={classNames}
    >
        <span>顯示所有下劃字符</span>
    </IconButton>
    <IconButton
        icon="mdi:eye-off"
        on:click={() => {
            allSwipeDown(false);
        }}
        class={classNames}
    >
        <span>隱藏所有下劃字符</span>
    </IconButton>
    <IconButton
        icon="mdi:web"
        on:click={() => {
            allSwipeUpByRime(true);
        }}
        class={classNames}
    >
        <span>所有上劃字符經由 Rime 處理</span>
    </IconButton>
    <IconButton
        icon="mdi:web-off"
        on:click={() => {
            allSwipeUpByRime(false);
        }}
        class={classNames}
    >
        <span>所有上劃字符不經由 Rime 處理</span>
    </IconButton>
    <IconButton
        icon="mdi:web"
        on:click={() => {
            allSwipeDownByRime(true);
        }}
        class={classNames}
    >
        <span>所有下劃字符經由 Rime 處理</span>
    </IconButton>
    <IconButton
        icon="mdi:web-off"
        on:click={() => {
            allSwipeDownByRime(false);
        }}
        class={classNames}
    >
        <span>所有下劃字符不經由 Rime 處理</span>
    </IconButton>
    <IconButton
        icon="mdi:web"
        on:click={() => {
            allKeyByRime(true);
        }}
        class={classNames}
    >
        <span>所有按下字符經由 Rime 處理</span>
    </IconButton>
    <IconButton
        icon="mdi:web-off"
        on:click={() => {
            allKeyByRime(false);
        }}
        class={classNames}
    >
        <span>所有按下字符不經由 Rime 處理</span>
    </IconButton>
    <IconButton
        icon="mdi:file-send"
        on:click={() => {
            syncPortraitKeyWidthToLandscape();
        }}
        class={classNames}
    >
        <span>將豎屏鍵寛同步到横屏</span>
    </IconButton>
</div>
