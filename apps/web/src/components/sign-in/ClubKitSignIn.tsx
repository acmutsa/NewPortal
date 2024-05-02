"use client";

import * as SignIn from "@clerk/elements/sign-in";
import * as Clerk from "@clerk/elements/common";
import { Card } from "@/components/ui/card

export default function ClubKitSignIn() {
	return (
        <Card
		<SignIn.Root>
			<SignIn.Step name="start">
				<h1>Sign in to Clover</h1>
				<p>Welcome back! Please sign in to continue.</p>

				<Clerk.GlobalError />

				<Clerk.Connection name="google">
					<Clerk.Icon /> Sign in with Google
				</Clerk.Connection>

				<div>or</div>

				<Clerk.Field name="identifier">
					<Clerk.Label>Email address</Clerk.Label>
					<Clerk.Input />
					<Clerk.FieldError />
				</Clerk.Field>

				<SignIn.Action submit>Continue</SignIn.Action>
			</SignIn.Step>
			<SignIn.Step name="verifications">
				<Clerk.GlobalError />

				<SignIn.Strategy name="email_code">
					<h1>Check your email</h1>
					<p>
						We've sent a code to <SignIn.SafeIdentifier />.
					</p>
					<Clerk.Field name="code">
						<Clerk.Label>Email code</Clerk.Label>
						<Clerk.Input />
						<Clerk.FieldError />
					</Clerk.Field>
					<SignIn.Action submit>Continue</SignIn.Action>
				</SignIn.Strategy>
			</SignIn.Step>
		</SignIn.Root>
	);
}
