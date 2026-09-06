import cors from "cors";
import express from "express";
import { database } from "./database.js";
import type { EventResponse } from "./types/event.js";

const app = express();

const port = Number(process.env.PORT ?? process.env.API_PORT ?? 4000);

const portalBaseUrl =
	process.env.PORTAL_BASE_URL ?? "https://portal.acmutsa.org";

const allowedOrigins = new Set([
	"http://localhost:3000",
	"http://localhost:3001",
	"http://localhost:5173",
	"https://portal.acmutsa.org",
]);

function buildThumbnailUrl(value: unknown): string | null {
	if (value == null || value === "") {
		return null;
	}

	const rawUrl = String(value);

	// Replace existing production portal image URLs with the configured
	// portal URL. This allows localhost during development.
	if (rawUrl.startsWith("https://portal.acmutsa.org/api/upload/view")) {
		const existingUrl = new URL(rawUrl);

		return new URL(
			`${existingUrl.pathname}${existingUrl.search}`,
			portalBaseUrl,
		).toString();
	}

	// Leave unrelated absolute URLs unchanged.
	if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
		return rawUrl;
	}

	// Convert relative URLs into absolute URLs.
	return new URL(rawUrl, portalBaseUrl).toString();
}

app.use(
	cors({
		origin(origin, callback) {
			// Requests from curl, Postman, and other servers may not include Origin.
			if (!origin || allowedOrigins.has(origin)) {
				callback(null, true);
				return;
			}

			callback(new Error(`Origin is not allowed by CORS: ${origin}`));
		},
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.use(express.json());

app.get("/", (_request, response) => {
	response.status(200).json({
		message: "NewPortal API is running",
	});
});

app.get("/api/health", (_request, response) => {
	response.status(200).json({
		status: "ok",
		timestamp: new Date().toISOString(),
	});
});

app.get("/api/test", (_request, response) => {
	response.status(200).json({
		message: "GET request successful",
	});
});

app.get("/api/events", async (_request, response, next) => {
	try {
		const result = await database.execute(`
      SELECT
        id,
        name,
        description,
        thumbnail_url,
        start,
        end,
        checkin_start,
        checkin_end,
        location,
        semester_id
      FROM events
      WHERE is_hidden = 0
      ORDER BY start ASC
    `);

		const events: EventResponse[] = result.rows.map((row) => ({
			id: String(row.id),
			name: String(row.name),
			description:
				row.description === null ? null : String(row.description),
			thumbnailUrl: buildThumbnailUrl(row.thumbnail_url),
			start: Number(row.start),
			end: Number(row.end),
			checkinStart: Number(row.checkin_start),
			checkinEnd: Number(row.checkin_end),
			location: row.location === null ? null : String(row.location),
			semesterId:
				row.semester_id === null ? null : Number(row.semester_id),
		}));

		response.json(events);
	} catch (error) {
		next(error);
	}
});

app.use(
	(
		error: Error,
		_request: express.Request,
		response: express.Response,
		_next: express.NextFunction,
	) => {
		console.error(error);

		response.status(500).json({
			error: "Internal server error",
		});
	},
);

app.listen(port, "0.0.0.0", () => {
	console.log(`API running on port ${port}`);
});
