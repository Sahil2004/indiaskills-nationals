import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStorage = await cookies();
	const session = cookieStorage.get("session")?.value
		? JSON.parse(cookieStorage.get("session")?.value as string)
		: null;
	if (session && session.token.token) {
		return <section>{children}</section>;
	} else {
		redirect("/");
	}
}
