import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VERCEL_IP_TIMEZONE_HEADER_KEY } from "@/lib/constants";
import UserDash from "@/components/dash/UserDash";
import { headers } from "next/headers";
import { getClientTimeZone } from "@/lib/utils";
export default function Page() {
	const { userId } = auth();

	if (!userId) return redirect("/sign-in");

	const clientTimeZoneValue = headers().get(VERCEL_IP_TIMEZONE_HEADER_KEY);
	const clientTimeZone = getClientTimeZone(clientTimeZoneValue);
	
	return (
		<main className="flex min-h-[calc(100vh-4rem)] w-screen items-center justify-center overflow-x-hidden px-4 py-4 md:px-5 ">
			<UserDash userId={userId} clientTimeZone={clientTimeZone} />
		</main>
	);
}

export const runtime = 'edge'
export const revalidate = 30