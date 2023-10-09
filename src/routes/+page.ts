import type { PageLoad } from "./$types";
import { Profile } from "$lib/Card/AvatarCard";

// 個人資料
const myProfile: Profile = new Profile(
	"https://github.com/lost-melody",
	"https://avatars.githubusercontent.com/u/32810294",
	["Lost Melody", "王牌餅乾"],
	["CTF", "DLUT"],
	[
		["本站", "https://lost-melody.github.io"],
		["博客", "https://www.cnblogs.com/lost-melody"],
		["雞蛋餅輸入法", "https://github.com/lost-melody/rime-smyh"],
	],
	["Go語言後端工程師", "雞蛋餅輸入法開發者", "倉輸入法佈局編輯器"]
);
// 友情鏈接
const friendLinks: Profile[] = [
	new Profile(
		"https://github.com/forfudan",
		"https://zhuyuhao.com/img/zhuyuhao.jpg",
		["forFudan", "夢澤閑客"],
		["金融學博士", "復旦大學", "荷蘭銀行"],
		[
			["主頁", "https://zhuyuhao.com"],
			["宇浩輸入法", "https://zhuyuhao.com/yuhao/"],
			[
				"上海話簡明教程",
				"https://www.zhihu.com/column/c_1621352649865043968",
			],
		],
		["荷蘭銀行高級量化模型驗證師", "宇浩輸入法作者", "標準上海話簡明教程作者"]
	),
	new Profile(
		"https://github.com/loora1n",
		"https://avatars.githubusercontent.com/u/102774816",
		["Loora1N", "鷺雨"],
		["Scr1w隧長", "CTF", "DLUT"],
		[["Loora1N's Blog", "https://loora1n.github.io"]],
		[
			"PWN🖐️ from @DLUT",
			"Scr1w, Double-S, 大吉北！",
			"fuzz, Linux kernal, IOT 及虚擬化",
			"藝術就是PWN🎆",
		]
	),
];

export const load: PageLoad = (_) => {
	return {
		title: "主頁",
		myProfile: myProfile,
		friendLinks: friendLinks,
	};
};
