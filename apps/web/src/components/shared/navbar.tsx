import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import c from "config";

type NavbarProps = {
	siteRegion?: string;
	showBorder?: boolean;
};

export default function Navbar({ siteRegion, showBorder }: NavbarProps) {
	return (
		<div
			className={
				"z-20 grid h-16 w-full grid-cols-2 bg-nav px-5" +
				(showBorder ? " border-b" : "")
			}
		>
			<div className="flex items-center gap-x-4 bg-nav">
				<Image
					src={c.icon.svg}
					alt={c.clubName + " Logo"}
					width={32}
					height={32}
				/>
				{siteRegion && (
					<>
						<div className="h-[45%] w-[2px] rotate-[25deg] bg-muted-foreground" />
						<h2 className="font-bold tracking-tight">
							{siteRegion}
						</h2>
					</>
				)}
			</div>
			<div className="hidden items-center justify-end md:flex">
				<Link href={"/"}>
					<Button
						className="bg-nav text-nav-content hover:bg-nav-content/70 hover:text-nav-content/70"
						size={"icon"}
					>
						<Home />
					</Button>
				</Link>
			</div>
		</div>
	);
}
