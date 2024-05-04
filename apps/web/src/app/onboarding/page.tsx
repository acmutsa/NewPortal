import RegisterForm from "@/components/registration/registerForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
	return (
		<main className="w-screen">
			<div className="max-w-5xl mx-auto min-h-screen pt-40">
				<div className="grid grid-cols-2">
					<div>
						<h1 className="font-black text-5xl">Registration</h1>
						<p className="mt-5 font-medium">
							<span className="font-bold">Welcome!</span> Please fill out the form
							below to complete your registration.
						</p>
					</div>
					<div className="bg-primary rounded-lg text-white flex flex-col items-center justify-center gap-y-3">
						<p className="text-sm font-bold">Had a portal (abc123 & email) account?</p>
						<Link href="/onboarding/migrate">
							<Button className="w-full dark">Migrate from Portal</Button>
						</Link>
					</div>
				</div>
				<RegisterForm />
			</div>
		</main>
	);
}
