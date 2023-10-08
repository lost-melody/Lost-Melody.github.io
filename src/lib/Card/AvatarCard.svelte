<script lang="ts">
    import { Avatar } from "@skeletonlabs/skeleton";

    export var src: string;
    export var href: string;
    export var labels: string[] = [];
    export var badges: string[] = [];
    export var links: [string, string][] = [];
    export var descs: string[] = [];
</script>

<div
    class="card card-hover p-4 gap-2 flex flex-col justify-center items-center"
>
    <!-- 頭像, 名稱及主頁鏈接 -->
    <a
        target="_blank"
        {href}
        class="flex gap-2 p-1 flex-row hover:variant-soft rounded-full justify-center items-center"
    >
        <Avatar {src} initials={labels.length !== 0 ? labels[0] : "X"} />
        <div>
            {#each labels as label}
                <p>{label}</p>
            {/each}
        </div>
    </a>
    <!-- 徽章 -->
    {#if badges.length !== 0}
        <div class="flex gap-1">
            {#each badges as badge}
                <span class="badge variant-filled">{badge}</span>
            {/each}
        </div>
    {/if}
    <!-- 站點鏈接 -->
    {#if links.length !== 0}
        <div class="flex gap-1">
            {#each links as link}
                <a
                    target="_blank"
                    href={link[1]}
                    class="badge variant-ghost hover:variant-ringed"
                >
                    {link[0]}
                </a>
            {/each}
        </div>
    {/if}
    <!-- 個人信息 -->
    {#each descs as desc}
        <p class="text-center">{desc}</p>
    {/each}
</div>
