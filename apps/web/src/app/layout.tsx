import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });
import { cookies } from "next/headers";
import { defaultTheme } from "config";

export const metadata: Metadata = {
	title: "ACM UTSA",
	description: "ACM UTSA's membership and event portal",
	icons: ["/img/logos/snapping-turtle.jpg"],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const theme = cookies().get("ck_theme")?.value || defaultTheme;
	return (
		<ClerkProvider>
			<html lang="en">
				<body
					className={`${inter.className} ${theme === "dark" ? "dark" : ""}`}
				>
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}

export const runtime = "edge";
