"use client";
import { deleteSemester } from "@/actions/semester";
import { useAction } from "next-safe-action/hooks";
import {
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteSemesterDialogue({
	semesterID,
	name,
}: {
	semesterID: number;
	name: string;
}) {
	const { refresh } = useRouter();
	const { status, execute: runDeleteSemester } = useAction(deleteSemester, {
		onSuccess: () => {
			toast.dismiss();
			toast.success("Semester deleted successfully");
			refresh();
		},
		onError: (err) => {
			if (
				err.error.validationErrors?._errors?.[0] ===
				"Unauthorized (Not a super admin)"
			) {
				return toast.error(
					"You need super admin permissions to update roles",
				);
			}
			toast.dismiss();
			toast.error("Failed to delete semester");
		},
	});

	const isLoading = status === "executing";

	return (
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>{`Are you want to delete "${name}"`}</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone and will remove any category
					associations with existing events.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction
					disabled={isLoading}
					onClick={() => {
						toast.loading("Deleting event category");
						runDeleteSemester(semesterID);
					}}
				>{`Delete ${name}`}</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	);
}
