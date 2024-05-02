import { SignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import c from "config";

export default function Page() {
	return (
		<main className="h-screen w-screen flex flex-col gap-y-5 items-center justify-center">
			<div className="max-w-[400px] flex-col flex items-center justify-center gap-y-5">
				<h1 className="font-black text-4xl">ClubKit</h1>
				<SignIn />
				{/* TODO: Add Explainer For Portal Accounts as a Dialog */}
				<Button className="w-full">Migrating From A Portal Account?</Button>
			</div>
		</main>
	);
}
