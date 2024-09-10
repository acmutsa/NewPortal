import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Hero() {
	return (
		<section className="bg-hero h-screen w-full">
			<div className="flex h-full flex-col items-center gap-y-20">
				<div className="mt-20 px-8">
					<h1 className="font-acm lg:text-title text-center text-7xl font-bold leading-9">
						ACM
						<br />
						<span className="text-4xl font-[400] lg:text-8xl">
							UTSA
						</span>
					</h1>
					<h3 className="max-w-full text-center lg:text-xl">
						We are the premier Computer Science Organization at{" "}
						<strong>UTSA</strong>, run & staffed by students.
					</h3>
				</div>

				<div className="flex flex-wrap items-center justify-center gap-x-5 px-8">
					<Link href="/register">
						<Button>Register</Button>
					</Link>
					<Link href="/events" className="h-min p-2">
						<p>Find Events →</p>
					</Link>
				</div>
			</div>
		</section>
	);
}
