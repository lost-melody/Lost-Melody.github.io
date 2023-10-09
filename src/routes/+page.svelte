<script lang="ts">
  import AvatarCard from "$lib/Card/AvatarCard.svelte";
  import type { Profile } from "$lib/Card/AvatarCard";
  import { profilesFromYaml } from "$lib/Card/AvatarCard";

  // 導入 yaml 文件數據
  import profilesYaml from "$lib/assets/profiles.yaml?raw";

  // 資料卡列表
  var profiles: Profile[] = profilesFromYaml(profilesYaml);
</script>

<div class="flex flex-wrap p-4 gap-4 justify-center">
  {#each profiles as profile}
    <AvatarCard {profile} />
  {/each}
</div>
