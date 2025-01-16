import Image from "next/image";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import ProfileButton from "@/components/shared/profile-button";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

import c from "config";
import { Menu } from "lucide-react";

type NavbarProps = {
	siteRegion?: string;
	showBorder?: boolean;
};

export default async function Navbar({ siteRegion, showBorder }: NavbarProps) {
	const clerkAuth = auth();
	const clerkUser = await currentUser();
	const { userId } = clerkAuth;
	const user = userId
		? await db.query.users.findFirst({
				where: eq(users.clerkID, userId),
				with: { data: true },
			})
		: null;

	const registrationComplete = user != null;
	return (
		<div
			className={
				"z-20 grid h-16 w-full grid-cols-2 px-5" +
				(showBorder ? " border-b" : "")
			}
		>
			<div className="flex items-center gap-x-4">
				<Link href="/">
					<Image
						src={c.icon.svg}
						alt={c.clubName + " Logo"}
						width={32}
						height={32}
					/>
				</Link>

				{siteRegion && (
					<>
						<div className="h-[45%] w-[2px] rotate-[25deg] bg-muted-foreground" />
						<h2 className="font-bold tracking-tight">
							{siteRegion}
						</h2>
					</>
				)}
			</div>

			{/* Large screen navbar */}
			<div className="my-2 hidden items-center justify-end gap-x-2 md:flex">
				{user ? (
					<>
						<Link
							href={registrationComplete ? "/dash" : "/sign-up"}
						>
							<Button
								variant={
									registrationComplete ? "outline" : "default"
								}
							>
								{registrationComplete
									? "Dashboard"
									: "Complete Registration"}
							</Button>
						</Link>
						<Link href={"/events"}>
							<Button variant={"outline"}>Events</Button>
						</Link>
						{(user.role === "admin" ||
							user.role === "super_admin") && (
							<Link href={"/admin"}>
								<Button
									variant={"outline"}
									className="text-blue-400"
								>
									Admin
								</Button>
							</Link>
						)}
						<ProfileButton
							clerkUser={clerkUser}
							clerkAuth={clerkAuth}
							user={user}
						/>
					</>
				) : (
					<>
						<Link href={"/sign-in"}>
							<Button
								variant={"outline"}
								className="hover:bg-background"
							>
								Sign In
							</Button>
						</Link>
						<Link href={"/sign-up"}>
							<Button>Register</Button>
						</Link>
					</>
				)}
			</div>

			{/* Small screen navbar */}
			<div className="flex items-center justify-end gap-2 md:hidden">
				<Sheet>
					<SheetTrigger asChild>
						<Menu />
					</SheetTrigger>
					<SheetContent className="flex max-w-[40%] flex-col-reverse items-center justify-center gap-y-1">
						{user ? (
							<>
								<Link
									href={
										registrationComplete
											? "/dash"
											: "/onboarding"
									}
								>
									<Button
										variant={
											registrationComplete
												? "ghost"
												: "default"
										}
									>
										{registrationComplete
											? "Dashboard"
											: "Complete Registration"}
									</Button>
								</Link>
								<Link href={"/events"}>
									<Button variant={"ghost"}>Events</Button>
								</Link>
								{(user.role === "admin" ||
									user.role === "super_admin") && (
									<Link href={"/admin"}>
										<Button variant={"ghost"}>Admin</Button>
									</Link>
								)}
								<div className="px-4">
									<ProfileButton
										clerkUser={clerkUser}
										clerkAuth={clerkAuth}
										user={user}
									/>
								</div>
							</>
						) : (
							<div className="flex flex-col items-center justify-center space-y-3">
								<Link href={"/sign-in"}>
									<Button
										variant={"outline"}
										className="hover:bg-background"
									>
										Sign In
									</Button>
								</Link>
								<Link href={"/sign-up"}>
									<Button>Register</Button>
								</Link>
							</div>
						)}
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
}
