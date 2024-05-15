"use client";
import c, { majors } from "config";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { insertUserWithDataSchema } from "db/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, CalendarIcon } from "lucide-react";
import { cn, range } from "@/lib/utils";
import { format } from "date-fns";

const formSchema = insertUserWithDataSchema.omit({
	clerkID: true,
});

export default function RegisterForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			data: {
				major: "",
			},
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<div className="mt-20">
			<Form {...form}>
				<form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
					<FormGroupWrapper title="Basic Info">
						<div className="grid grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</FormGroupWrapper>
					<FormGroupWrapper title="College Information">
						<div className="grid grid-cols-6 gap-4">
							<FormField
								control={form.control}
								name="data.universityID"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{c.schoolUniversityIdName}</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="data.major"
								render={({ field }) => (
									<FormItem className="col-span-2">
										<FormLabel>Major</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															"w-full justify-between",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value
															? majors.find(
																	(major) => major === field.value
																)
															: "Select a Major"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="no-scrollbar max-h-[400px] w-[250px] p-0">
												<Command>
													<CommandInput placeholder="Search major..." />
													<CommandEmpty>No major found.</CommandEmpty>
													<CommandList>
														<CommandGroup>
															{majors.map((major) => {
																return (
																	<CommandItem
																		value={major}
																		key={major}
																		onSelect={(value) => {
																			form.setValue(
																				"data.major",
																				value
																			);
																		}}
																		className="cursor-pointer "
																	>
																		<Check
																			className={`h-4 mr-2 overflow-hidden w-4 ${
																				major.toLowerCase() ===
																				field.value
																					? "block"
																					: "hidden"
																			}
																		`}
																		/>
																		{major}
																	</CommandItem>
																);
															})}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="data.classification"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Classification</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value?.toString()}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Classification" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem
													className="cursor-pointer"
													value="freshman"
												>
													Freshman
												</SelectItem>
												<SelectItem
													className="cursor-pointer"
													value="sophomore"
												>
													Sophomore
												</SelectItem>
												<SelectItem
													className="cursor-pointer"
													value="junior"
												>
													Junior
												</SelectItem>
												<SelectItem
													className="cursor-pointer"
													value="senior"
												>
													Senior
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="data.graduationMonth"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Graduation Month</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value?.toString()}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Month" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem className="cursor-pointer" value="1">
													January
												</SelectItem>
												<SelectItem className="cursor-pointer" value="2">
													February
												</SelectItem>
												<SelectItem className="cursor-pointer" value="3">
													March
												</SelectItem>
												<SelectItem className="cursor-pointer" value="4">
													April
												</SelectItem>
												<SelectItem className="cursor-pointer" value="5">
													May
												</SelectItem>
												<SelectItem className="cursor-pointer" value="6">
													June
												</SelectItem>
												<SelectItem className="cursor-pointer" value="7">
													July
												</SelectItem>
												<SelectItem className="cursor-pointer" value="8">
													August
												</SelectItem>
												<SelectItem className="cursor-pointer" value="9">
													September
												</SelectItem>
												<SelectItem className="cursor-pointer" value="10">
													October
												</SelectItem>
												<SelectItem className="cursor-pointer" value="11">
													November
												</SelectItem>
												<SelectItem className="cursor-pointer" value="12">
													December
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="data.graduationYear"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="w-full">Graduation Year</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value?.toString()}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Year" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{range(
													new Date().getFullYear(),
													new Date().getFullYear() + 5
												).map((year) => (
													<SelectItem
														className="cursor-pointer"
														value={year.toString()}
														key={year}
													>
														{year}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</FormGroupWrapper>
					<FormGroupWrapper title="Personal Information">
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="data.birthday"
								render={({ field }) => (
									<FormItem className="flex flex-col justify-end gap-y-1">
										<FormLabel>Date of birth</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															format(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={
														field.value == null
															? undefined
															: field.value
													}
													onSelect={field.onChange}
													disabled={(date) =>
														date > new Date() ||
														date < new Date("1900-01-01")
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>

										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="data.gender"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Gender</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value?.[0]?.toString()}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Gender" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem className="cursor-pointer" value="male">
													Male
												</SelectItem>
												<SelectItem
													className="cursor-pointer"
													value="female"
												>
													Female
												</SelectItem>
												<SelectItem
													className="cursor-pointer"
													value="other"
												>
													Other
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="data.ethnicity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ethnicity</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value?.[0]?.toString()}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Ethnicity" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem
													className="cursor-pointer"
													value="asian"
												>
													Asian
												</SelectItem>
												<SelectItem
													className="cursor-pointer"
													value="black"
												>
													Black/African American
												</SelectItem>
												<SelectItem
													className="cursor-pointer"
													value="hispanic"
												>
													Hispanic/Latino
												</SelectItem>
												<SelectItem
													className="cursor-pointer"
													value="white"
												>
													White/Caucasian
												</SelectItem>
												<SelectItem
													className="cursor-pointer"
													value="native"
												>
													Native American
												</SelectItem>
												<SelectItem
													className="cursor-pointer"
													value="other"
												>
													Other
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4"></div>
					</FormGroupWrapper>
					<FormGroupWrapper title="Other">
						<div className="grid grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="data.shirtSize"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Shirt Size</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value?.toString()}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Shirt Size" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem className="cursor-pointer" value="xs">
													XS
												</SelectItem>
												<SelectItem className="cursor-pointer" value="s">
													S
												</SelectItem>
												<SelectItem className="cursor-pointer" value="m">
													M
												</SelectItem>
												<SelectItem className="cursor-pointer" value="l">
													L
												</SelectItem>
												<SelectItem className="cursor-pointer" value="xl">
													XL
												</SelectItem>
												<SelectItem className="cursor-pointer" value="xxl">
													XXL
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="data.shirtType"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Shirt Type</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value?.toString()}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Shirt Type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem
													className="cursor-pointer"
													value="tshirt"
												>
													Unix
												</SelectItem>
												<SelectItem className="cursor-pointer" value="polo">
													Polo
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="data.resume"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Resume</FormLabel>
										<FormControl>
											<Input
												type="file"
												{...field}
												value={field.value || undefined}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</FormGroupWrapper>

					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</div>
	);
}

interface FormGroupWrapperProps {
	title: string;
	children: React.ReactNode;
}

function FormGroupWrapper({ children, title }: FormGroupWrapperProps) {
	return (
		<div className="relative rounded-lg border p-5">
			<p className="bg-background absolute top-0 z-10 -translate-y-[10px] px-2 text-sm font-bold">
				{title}
			</p>
			<div className="relative top-0 space-y-6">{children}</div>
		</div>
	);
}
