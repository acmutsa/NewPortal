import { fileURLToPath } from "node:url";
import createJiti from "jiti";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		// fix image optmization
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "rtj2mkgfsw7b7j1m.public.blob.vercel-storage.com",
			},
		],
	},
};
if (process.env.NODE_ENV === "development") {
	await setupDevPlatform();
}
export default nextConfig;
