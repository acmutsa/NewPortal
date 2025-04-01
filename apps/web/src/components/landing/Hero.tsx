'use client'
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import {motion} from "framer-motion"
import Image from "next/image";

export default function Hero() {
	const [isVisible, setIsVisible] = useState(false);
	const [innerWidth, setInnerWidth] = useState(0);
	const [innerHeight, setInnerHeight] = useState(0);

	useEffect(() => {
		setIsVisible(true);
		setInnerWidth(window.innerWidth);
		setInnerHeight(window.innerHeight);
	}, []);



	return (
		<section className="bg-hero relative h-full flex-1">
			<div className="absolute inset-0 overflow-hidden">
				{Array.from({ length: 20 }).map((_, i) => (
					<motion.div
						key={i}
						className="absolute opacity-30"
						initial={{ opacity: 0, scale: 0 }}
						animate={{
							opacity: [0.2, 0.5, 0.2],
							scale: [1, 2, 1],
							x: [
								Math.random() * innerWidth,
								Math.random() * innerWidth,
							],
							y: [
								Math.random() * innerHeight,
								Math.random() * innerHeight,
							],
						}}
						transition={{
							duration: Math.random() * 10 + 10,
							repeat: Infinity,
							delay: Math.random() * 5,
						}}
					>
						<Image
							src={`/img/logos/kailey-${i % 2 === 0 ? "float" : "turtle"}.png`}
							width={20}
							height={20}
							alt="turtle"
						/>
					</motion.div>
				))}
			</div>
			<div className="flex h-full flex-col items-center gap-y-20">
				<div className="mt-20 px-8">
					<h1 className="text-center font-acm text-7xl font-bold leading-9 text-white lg:text-title">
						ACM
						<br />
						<span className="text-4xl font-[400] text-white lg:text-8xl">
							UTSA
						</span>
					</h1>
					<h3 className="mt-8 max-w-xl text-center text-white lg:text-xl">
						We are the premier Computer Science Organization at{" "}
						<strong>UTSA</strong>, run & staffed by students.
					</h3>
				</div>

				<div className="flex flex-wrap items-center justify-center gap-x-5 px-8 text-white">
					<Link href="/sign-up">
						<Button className="bg-acm-blue hover:bg-acm-blue/90 dark:text-white">
							Register
						</Button>
					</Link>
					<Link href="/events" className="h-min p-2">
						<p>Find Events →</p>
					</Link>
				</div>
			</div>
		</section>
	);
}
