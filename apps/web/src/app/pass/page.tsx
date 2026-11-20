import type { Metadata } from "next";
import PassPage from "@/components/pass/PassPage";

export const metadata: Metadata = { title: "Hacker Pass" };

// Tri Nguyen: Login-only hacker pass. Not listed in publicRoutes (packages/config), so middleware asks for sign-in first.
export default function Page() {
	return <PassPage />;
}
