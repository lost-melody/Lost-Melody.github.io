<script lang="ts">
    import type { Profile } from "./AvatarCard";

    export var profile: Profile;
    var target = profile.github !== "" ? "_blank" : "_self";
    var href = profile.github !== "" ? "https://github.com/" + profile.github : "/";
    var src = profile.avatar;
    var labels = profile.labels;
    var badges = profile.badges;
    var links = profile.links;
    var desc = profile.desc;
</script>

<div class="card card-hover flex w-64 flex-col items-center gap-2 p-4">
    <!-- 頭像, 名稱及主頁鏈接 -->
    <a {target} {href} class="flex gap-2 rounded-full p-1 hover:variant-soft">
        <img {src} alt="頭像" class="h-12 w-12 rounded-full" />
        <div class="flex flex-col justify-around">
            {#each labels as label}
                <p class="text-sm">{label}</p>
            {/each}
        </div>
    </a>
    <!-- 徽章 -->
    {#if badges.length !== 0}
        <div class="flex gap-1">
            {#each badges as badge}
                <span class="variant-filled badge">{badge}</span>
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
                    class="variant-ghost badge hover:variant-ringed"
                >
                    {link.label}
                </a>
            {/each}
        </div>
    {/if}
    <!-- 個人信息 -->
    {#each desc as desc}
        <p class="text-center text-sm">{desc}</p>
    {/each}
</div>
