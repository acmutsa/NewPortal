import { auth } from "@clerk/nextjs/server";
import { staticUploads } from "config";
import { getPresignedViewingUrl } from "@/lib/server/s3";

const PUBLIC_EVENT_THUMBNAIL_PREFIX =
	"ACM UTSA-UTSA/event-thumbnails/";

export async function GET(request: Request) {
	const key = new URL(request.url).searchParams.get("key");

	console.log("Upload view request:", {
		key,
		bucketName: staticUploads.bucketName,
	});

	if (!key) {
		return new Response(
			"Request must have a query parameter 'key' associated with it",
			{ status: 400 },
		);
	}

	const isPublicEventThumbnail = key.startsWith(
		PUBLIC_EVENT_THUMBNAIL_PREFIX,
	);

	console.log("Thumbnail access check:", {
		isPublicEventThumbnail,
	});

	if (!isPublicEventThumbnail) {
		const { userId } = await auth();

		if (!userId) {
			return new Response(
				"You must be logged in to access this resource",
				{ status: 401 },
			);
		}
	}

	try {
		console.log("Creating presigned URL...");

		const presignedViewingUrl = await getPresignedViewingUrl(
			staticUploads.bucketName,
			key,
		);

		console.log("Presigned URL created:", Boolean(presignedViewingUrl));

		return new Response(null, {
			status: 307,
			headers: {
				Location: presignedViewingUrl,
			},
		});
	} catch (error) {
		console.error("Presigned URL generation failed:", error);

		return Response.json(
			{
				error: "Failed to retrieve uploaded file",
				details:
					error instanceof Error
						? error.message
						: String(error),
			},
			{ status: 500 },
		);
	}
}

export const runtime = "edge";