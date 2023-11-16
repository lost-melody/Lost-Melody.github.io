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
                if (
                    key.landscape !== key.width ||
                    key.autoLandscape !== key.autoWidth
                ) {
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
</script>

<div>
    <IconButton
        icon="mdi:eye"
        on:click={() => {
            allSwipeUp(true);
        }}
        class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
    >
        <span>顯示所有上劃字符</span>
    </IconButton>
    <IconButton
        icon="mdi:eye-off"
        on:click={() => {
            allSwipeUp(false);
        }}
        class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
    >
        <span>隱藏所有上劃字符</span>
    </IconButton>
    <IconButton
        icon="mdi:eye"
        on:click={() => {
            allSwipeDown(true);
        }}
        class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
    >
        <span>顯示所有下劃字符</span>
    </IconButton>
    <IconButton
        icon="mdi:eye-off"
        on:click={() => {
            allSwipeDown(false);
        }}
        class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
    >
        <span>隱藏所有下劃字符</span>
    </IconButton>
    <IconButton
        icon="mdi:web"
        on:click={() => {
            allSwipeUpByRime(true);
        }}
        class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
    >
        <span>所有上劃字符經由 Rime 處理</span>
    </IconButton>
    <IconButton
        icon="mdi:web-off"
        on:click={() => {
            allSwipeUpByRime(false);
        }}
        class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
    >
        <span>所有上劃字符不經由 Rime 處理</span>
    </IconButton>
    <IconButton
        icon="mdi:web"
        on:click={() => {
            allSwipeDownByRime(true);
        }}
        class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
    >
        <span>所有下劃字符經由 Rime 處理</span>
    </IconButton>
    <IconButton
        icon="mdi:web-off"
        on:click={() => {
            allSwipeDownByRime(false);
        }}
        class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
    >
        <span>所有下劃字符不經由 Rime 處理</span>
    </IconButton>
    <IconButton
        icon="mdi:web"
        on:click={() => {
            allKeyByRime(true);
        }}
        class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
    >
        <span>所有按下字符經由 Rime 處理</span>
    </IconButton>
    <IconButton
        icon="mdi:web-off"
        on:click={() => {
            allKeyByRime(false);
        }}
        class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
    >
        <span>所有按下字符不經由 Rime 處理</span>
    </IconButton>
    <IconButton
        icon="mdi:file-send"
        on:click={() => {
            syncPortraitKeyWidthToLandscape();
        }}
        class="p-2 gap-2 w-full flex items-center rounded-md hover:variant-ghost"
    >
        <span>將豎屏鍵寛同步到横屏</span>
    </IconButton>
</div>
