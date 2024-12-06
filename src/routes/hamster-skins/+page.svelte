<script lang="ts">
    import { getToastStore } from "@skeletonlabs/skeleton";
    import { toastError } from "$lib/utils/error";
    import { dataUrlFromFile } from "$lib/utils/file";
    import { ImageAlbum, ImageAtlas } from "./models";
    import AtlasGallery from "./AtlasGallery.svelte";

    const toastStore = getToastStore();

    var fileInput: HTMLInputElement | undefined = $state();
    var album: ImageAlbum = $state(new ImageAlbum());

    function onUploadFile() {
        let file = fileInput?.files?.[0];
        if (file) {
            dataUrlFromFile(file)
                .then((dataUrl) => {
                    let exists = false;
                    for (let atlas of album.atlases) {
                        // 若已存在同名貼圖集, 則覆蓋之
                        if (atlas.name == file.name) {
                            atlas.descriptors = [];
                            atlas.source = `url(${dataUrl})`;
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        // 無同名貼圖集, 追加
                        let atlas = new ImageAtlas();
                        atlas.name = file.name;
                        atlas.descriptors = [];
                        atlas.source = `url(${dataUrl})`;
                        album.atlases.push(atlas);
                    }
                    album = album;
                })
                .catch((err) => {
                    toastError(toastStore, "貼圖集加載失敗!");
                    console.error("failed to load altas:", err);
                });
        }
    }
</script>

<div class="flex flex-col gap-2">
    <label>
        <input bind:this={fileInput} title="上傳貼圖集" type="file" accept=".png" onchange={onUploadFile} />
    </label>
    <AtlasGallery bind:album />
    {album.atlases.length}
</div>
