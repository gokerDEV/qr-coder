import { ChevronRight, History, QrCode, Settings2 } from "lucide-react";
import type * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { CreditsTrigger } from "./credits.trigger";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "QR Generator",
			url: "/qr/content",
			icon: QrCode,
			isActive: true,
			items: [
				{
					title: "Content",
					url: "/qr/content",
				},
				{
					title: "Style & Options",
					url: "/qr/style",
				},
			],
		},
		{
			title: "History",
			url: "/history",
			icon: History,
		},
		{
			title: "Settings",
			url: "/settings",
			icon: Settings2,
		},
	],
};

export function AppSidebar({
	className,
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const location = useLocation();
	const { state } = useSidebar();

	return (
		<Sidebar collapsible="icon" className={cn("z-30", className)} {...props}>
			<SidebarHeader className="!p-0 h-16 border-b group-data-[collapsible=icon]:h-12">
				<CreditsTrigger />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarMenu>
						{data.navMain.map((item) => {
							// Check if item has children and sidebar is collapsed
							if (
								item.items &&
								item.items.length > 0 &&
								state === "collapsed"
							) {
								return (
									<SidebarMenuItem key={item.title}>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<SidebarMenuButton tooltip={item.title}>
													{item.icon && <item.icon />}
													<span>{item.title}</span>
													<ChevronRight className="ml-auto size-4" />
												</SidebarMenuButton>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												side="right"
												align="start"
												className="min-w-56 rounded-lg"
											>
												<DropdownMenuLabel className="px-2 py-1.5 text-muted-foreground text-xs">
													{item.title}
												</DropdownMenuLabel>
												{item.items.map((subItem) => (
													<DropdownMenuItem key={subItem.title} asChild>
														<Link
															to={subItem.url}
															className="flex w-full items-center gap-2"
														>
															<span>{subItem.title}</span>
														</Link>
													</DropdownMenuItem>
												))}
											</DropdownMenuContent>
										</DropdownMenu>
									</SidebarMenuItem>
								);
							}

							return (
								<Collapsible
									key={item.title}
									asChild
									defaultOpen={item.isActive}
									className="group/collapsible"
								>
									<SidebarMenuItem>
										{item.items ? (
											// Collapsible item for submenus (Expanded State)
											<>
												<CollapsibleTrigger asChild>
													<SidebarMenuButton tooltip={item.title}>
														{item.icon && <item.icon />}
														<span>{item.title}</span>
														<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
													</SidebarMenuButton>
												</CollapsibleTrigger>
												<CollapsibleContent>
													<SidebarMenuSub>
														{item.items.map((subItem) => (
															<SidebarMenuSubItem key={subItem.title}>
																<SidebarMenuSubButton
																	asChild
																	isActive={location.pathname === subItem.url}
																>
																	<Link to={subItem.url}>
																		<span>{subItem.title}</span>
																	</Link>
																</SidebarMenuSubButton>
															</SidebarMenuSubItem>
														))}
													</SidebarMenuSub>
												</CollapsibleContent>
											</>
										) : (
											// Simple Link Item
											<SidebarMenuButton
												asChild
												tooltip={item.title}
												isActive={location.pathname === item.url}
											>
												<Link to={item.url}>
													{item.icon && <item.icon />}
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										)}
									</SidebarMenuItem>
								</Collapsible>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				{/* Empty User Menu for now as requested */}
				<div className="p-4" />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
