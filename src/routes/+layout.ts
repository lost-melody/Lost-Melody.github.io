import type { LayoutLoad } from "./$types";

export const prerender: boolean = true;
export const ssr: boolean = false;

// 導航列表
var navigations: [string, string][] = [
	["主頁", "/"],
	["倉·工具", "/hamster-tools"],
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
