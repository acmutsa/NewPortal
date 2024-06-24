import { SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import { redirect } from "next/navigation";
import c from "config";
import Image from "next/image";
import CircularProgressBar from "@/components/shared/circular-progress";

export default async function Page() {
	const { userId } = auth();

	if (!userId) return redirect("/sign-in");

	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (!user) return redirect("/onboarding");
	return (
		<main className="flex min-h-[calc(100vh-4rem)] w-screen items-center justify-center">
			<div>
				<div>
					<h2 className="text-xl font-bold">Welcome,</h2>
					<h1 className="pb-5 text-5xl font-black">
						{user.firstName}
					</h1>
				</div>
				<div className="shadow-x grid min-h-[40vh] w-[900px] max-w-[100vw] grid-cols-3 rounded-xl border border-border p-10">
					<div className="flex items-center justify-center">
						<CircularProgressBar size={300} progress={75} />
					</div>
				</div>
			</div>
		</main>
	);
}
