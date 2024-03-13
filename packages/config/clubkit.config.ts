export default {
	clubName: "ClubKit",
	eventTypes: {
		ACM: {
			color: "#179BD5",
		},
		"ACM-W": {
			color: "#7BE9E8",
		},
		"Rowdy Creators": {
			color: "#FFD51E",
		},
	},
} as const;

// These are routes that users can access without having to sign in

export const publicRoutes = ["/"];
