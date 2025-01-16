import Hero from "@/components/landing/Hero";
import Navbar from "@/components/shared/navbar";
export default function Home() {
	return (
		// bg-[var(--my-var,var(--my-background,pink))]
		<div className=" flex h-[100dvh] w-screen flex-col">
			<header>
				<Navbar />
			</header>
			<main className="w-full">
				<Hero />
			</main>
		</div>
	);
}
