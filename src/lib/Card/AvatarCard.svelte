<script lang="ts">
    import { Avatar } from "@skeletonlabs/skeleton";
    import type { Profile } from "./AvatarCard";

    export var profile: Profile;
    var target = profile.github !== "" ? "_blank" : "_self";
    var href =
        profile.github !== "" ? "https://github.com/" + profile.github : "/";
    var src = profile.avatar;
    var labels = profile.labels;
    var badges = profile.badges;
    var links = profile.links;
    var desc = profile.desc;
</script>

<div
    class="card card-hover p-4 gap-2 flex flex-col justify-center items-center"
>
    <!-- 頭像, 名稱及主頁鏈接 -->
    <a
        {target}
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
                    target={link.address.startsWith("/") ? "_self" : "_blank"}
                    href={link.address}
                    class="badge variant-ghost hover:variant-ringed"
                >
                    {link.label}
                </a>
            {/each}
        </div>
    {/if}
    <!-- 個人信息 -->
    {#each desc as desc}
        <p class="text-center">{desc}</p>
    {/each}
</div>
