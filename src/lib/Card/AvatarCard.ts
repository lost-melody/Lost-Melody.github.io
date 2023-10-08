export class Profile {
	href: string;
	src: string;
	labels: string[];
	badges: string[];
	links: [string, string][];
	descs: string[];
	constructor(
		href: string,
		src: string,
		labels: string[],
		badges: string[],
		links: [string, string][],
		descs: string[]
	) {
		this.href = href;
		this.src = src;
		this.labels = labels;
		this.badges = badges;
		this.links = links;
		this.descs = descs;
	}
}
