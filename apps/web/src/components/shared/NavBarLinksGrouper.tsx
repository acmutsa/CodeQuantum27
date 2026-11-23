import { getLandingNavItems } from "@/lib/utils/server/redis";
import NavbarItem from "./NavbarItem";

export default async function NavBarLinksGrouper() {
	const nav = await getLandingNavItems();
	const toRender: React.ReactNode[] = [];
	for (const item of nav) {
		if (item.enabled) {
			toRender.push(
				<NavbarItem key={item.name} link={item.url}>
					{item.name}
				</NavbarItem>,
			);
		}
	}
	return <>{toRender}</>;
}

export const revalidate = 30;
