import { createPrompt } from "bun-promptx";

async function move() {
	const url = createPrompt("Enter Get All Users URL: ");
	if (url.error || !url.value) {
		console.error(url.error);
		return process.exit(1);
	}

	const username = createPrompt("Enter admionusername: ");
	if (username.error || !username.value) {
		console.error(username.error);
		return process.exit(1);
	}
	const password = createPrompt("Enter password: ", { echoMode: "password" });
	if (password.error || !password.value) {
		console.error(password.error);
		return process.exit(1);
	}

	const req = await fetch(url.value, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			apikey: username.value + password.value,
		}),
	});

	const res = await req.json();

	const allMembers = res.allMembers;

	console.log(allMembers[0]);

	// for (const member of allMembers) {
	// 	console.log(member);
	// }

	return process.exit(0);
}

move();
