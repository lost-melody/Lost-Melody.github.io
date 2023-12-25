import { parse } from "yaml";

/** 個人資料卡信息 */
export type Profile = {
    github: string;
    avatar: string;
    labels: string[];
    badges: string[];
    desc: string[];
    links: { label: string; address: string }[];
};

/** 從 *yaml* 文本導入 `Profile` 列表 */
export function profilesFromYaml(content: string): Profile[] {
    var profiles: Profile[] = [];
    try {
        var obj = parse(content);
        for (var { github, avatar, labels, badges, desc, links } of obj.profiles) {
            var profile: Profile = {
                github: github ? (github as string) : "",
                avatar: avatar ? (avatar as string) : "",
                labels: labels ? (labels as string[]) : [],
                badges: badges ? (badges as string[]) : [],
                desc: desc ? (desc as string[]) : [],
                links: [],
            };
            if (links) {
                for (var { label, address } of links) {
                    if (label && address) {
                        profile.links.push({
                            label: label as string,
                            address: address as string,
                        });
                    }
                }
            }
            profiles.push(profile);
        }
    } catch (e) {
        console.error("failed to parse yaml:", (e as Error).message);
    }
    return profiles;
}
