import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!cloudflareAccountId) {
	throw new Error("CLOUDFLARE_ACCOUNT_ID is not configured");
}

if (!r2AccessKeyId) {
	throw new Error("R2_ACCESS_KEY_ID is not configured");
}

if (!r2SecretAccessKey) {
	throw new Error("R2_SECRET_ACCESS_KEY is not configured");
}

export const S3 = new S3Client({
	region: "auto",
	endpoint: `https://${cloudflareAccountId}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: r2AccessKeyId,
		secretAccessKey: r2SecretAccessKey,
	},
});

const EXPIRE_TIME_SECONDS = 3600;

export async function getPresignedUploadUrl(
	bucket: string,
	key: string,
): Promise<string> {
	return getSignedUrl(
		S3,
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Metadata: {
				"Access-Control-Allow-Origin": "*",
			},
		}),
		{
			expiresIn: EXPIRE_TIME_SECONDS,
		},
	);
}

export async function getPresignedViewingUrl(
	bucket: string,
	key: string,
): Promise<string> {
	return getSignedUrl(
		S3,
		new GetObjectCommand({
			Bucket: bucket,
			Key: key,
		}),
		{
			expiresIn: EXPIRE_TIME_SECONDS,
		},
	);
}