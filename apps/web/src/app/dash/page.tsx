import { SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import { redirect } from "next/navigation";

export default async function Page() {
	const { userId } = auth();

	if (!userId) return redirect("/sign-in");

	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (!user) return redirect("/onboarding");
	return (
		<main className="flex min-h-screen w-screen items-center justify-center">
			<div>
				<div>
					<h2 className="text-xl font-bold">Welcome,</h2>
					<h1 className="pb-5 text-5xl font-black">
						{user.firstName}
					</h1>
				</div>
				<div className="shadow-x grid min-h-[40vh] w-[900px] max-w-[100vw] grid-cols-3 rounded-xl border border-border">
					<div></div>
				</div>
			</div>
		</main>
	);
}
