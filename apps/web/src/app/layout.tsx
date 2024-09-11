import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "ACM UTSA",
	description: "ACM UTSA's membership and event portal",
	icons: ["/img/logos/acm.ico"],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={`${inter.className} dark`}>{children}</body>
			</html>
		</ClerkProvider>
	);
}
