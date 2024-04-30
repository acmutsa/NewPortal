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
	userIdentityOptions: {
		ethnicity: [
			"American Indian or Alaska Native",
			"Asian",
			"Black or African American",
			"Hispanic or Latino",
			"Native Hawaiian or Other Pacific Islander",
			"White",
		],
		gender: ["Male", "Female", "Non-binary", "Transgender", "Intersex", "Prefer not to say"],
	},
} as const;

// These are routes that users can access without having to sign in

export const publicRoutes = ["/"];
