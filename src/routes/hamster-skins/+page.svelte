<script lang="ts">
    import type { Writable } from "svelte/store";
    import { writable } from "svelte/store";
    import { getToastStore } from "@skeletonlabs/skeleton";
    import { toastError } from "$lib/utils/error";
    import { dataUrlFromFile } from "$lib/utils/file";
    import { ImageAlbum, ImageAtlas } from "./models";
    import AtlasGallery from "./AtlasGallery.svelte";

    const toastStore = getToastStore();

    var fileInput: HTMLInputElement | undefined = $state();
    var album: Writable<ImageAlbum> = writable(new ImageAlbum());

    function onUploadFile() {
        let file = fileInput?.files?.[0];
        if (file) {
            let name = file.name.replace(/\.png$/, "");
            dataUrlFromFile(file)
                .then((dataUrl) => {
                    let exists = false;
                    for (let atlas of $album.atlases) {
                        // 若已存在同名貼圖集, 則覆蓋之
                        if (atlas.name == name) {
                            atlas.descriptors = [];
                            atlas.source = dataUrl;
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        // 無同名貼圖集, 追加
                        let atlas = new ImageAtlas();
                        atlas.name = name;
                        atlas.descriptors = [];
                        atlas.source = dataUrl;
                        $album.atlases.push(atlas);
                    }
                    $album = $album;
                })
                .catch((err) => {
                    toastError(toastStore, "貼圖集加載失敗!");
                    console.error("failed to load altas:", err);
                })
                .finally(() => {
                    // 清除選中的文件
                    fileInput!.value = "";
                });
        }
    }
</script>

<div class="flex flex-col gap-2">
    <label>
        <input bind:this={fileInput} title="上傳貼圖集" type="file" accept=".png" onchange={onUploadFile} />
    </label>
    <AtlasGallery bind:album={$album} />
</div>
