import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		loader: "custom",
		loaderFile: "./image-loader.ts",
		remotePatterns: [
			{
				protocol: "https",
				hostname: "rtj2mkgfsw7b7j1m.public.blob.vercel-storage.com",
			},
		],
	},
	async headers() {
		return [
			{
				source: "/events",
				headers: [
					{
						key: "x-timezone",
						value: Intl.DateTimeFormat().resolvedOptions().timeZone,
					},
				],
			},
		];
	},
};

export default nextConfig;
