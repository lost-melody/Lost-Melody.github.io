<script lang="ts">
  import type { PageData } from "./$types";
  import AvatarCard from "$lib/Card/AvatarCard.svelte";
  import type { Profile } from "$lib/Card/AvatarCard";

  export var data: PageData;

  // 個人資料
  const myProfile: Profile = data.myProfile;
  // 友情鏈接
  const links: Profile[] = [myProfile, ...data.friendLinks];
</script>

<div class="flex flex-wrap p-4 gap-4 justify-center">
  {#each links as link}
    <AvatarCard
      href={link.href}
      src={link.src}
      labels={link.labels}
      badges={link.badges}
      links={link.links}
      descs={link.descs}
    />
  {/each}
</div>
