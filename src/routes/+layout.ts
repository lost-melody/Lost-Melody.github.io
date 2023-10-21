import type { LayoutLoad } from "./$types";

export const prerender: boolean = true;

// 導航列表
var navigations: [string, string][] = [
	["主頁", "/"],
	["倉·佈局", "/hamster-tools"],
	["倉·配色", "/hamster-colors"],
	["雞蛋餅", "/wafel"],
];
// 鳴謝列表
var credits: [string, string][] = [
	["Svelte Kit", "https://kit.svelte.dev"],
	["Skeleton", "https://www.skeleton.dev"],
	["Tailwind CSS", "https://tailwindcss.com"],
];

export const load: LayoutLoad = (_) => {
	return {
		navigations: navigations,
		credits: credits,
	};
}
