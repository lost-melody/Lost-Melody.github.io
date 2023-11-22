import type { PageLoad } from "./$types";
import type { Profile } from "$lib/Card/AvatarCard";
import { profilesFromYaml } from "$lib/Card/AvatarCard";

// 導入 yaml 文件數據
import profilesYaml from "$lib/assets/profiles.yaml?raw";

// 資料卡列表
var profiles: Profile[] = profilesFromYaml(profilesYaml);

export const load: PageLoad = (_) => {
    return {
        title: "首頁·友鏈列表",
        profiles,
    };
};
