import { getPresignedViewingUrl } from "@/lib/server/s3";
import { redirect } from "next/navigation";
import { staticUploads } from "config";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
	console.log("GET /api/upload/view");
	const { userId } = auth();

	if (!userId) {
		return new Response("You must be logged in to access this resource", {
			status: 401,
		});
	}
	console.log("User ID:", userId);

	const key = new URL(request.url).searchParams.get("key");
	if (!key) {
		return new Response(
			"Request must have a query parameter 'key' associated with it",
			{
				status: 400,
			},
		);
	}
	console.log("Key:", key);

	const decodedKey = decodeURIComponent(key);

	console.log("Decoded Key:", decodedKey);

	// Presign the url and return redirect to it.
	const presignedViewingUrl = await getPresignedViewingUrl(
		staticUploads.bucketName,
		decodedKey,
	);
	console.log("Presigned URL:", presignedViewingUrl);

	return redirect(presignedViewingUrl);
}

export const runtime = "edge";
