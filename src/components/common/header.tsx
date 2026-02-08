import { Coffee, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
	const location = useLocation();
	const [theme, setTheme] = useState<"light" | "dark">("light");

	// Initialize theme from storage or system
	useEffect(() => {
		const storedTheme = localStorage.getItem("theme") as
			| "light"
			| "dark"
			| null;
		if (storedTheme) {
			setTheme(storedTheme);
			if (storedTheme === "dark") {
				document.documentElement.classList.add("dark");
			}
		} else {
			const isDark = document.documentElement.classList.contains("dark");
			setTheme(isDark ? "dark" : "light");
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	// Breadcrumb logic
	const pathSegments = location.pathname.split("/").filter(Boolean);

	// Map segments to readable names if needed
	const getReadableName = (segment: string) => {
		if (segment === "qr") return "Generators";
		if (segment === "content") return "Content";
		if (segment === "style") return "Style";
		return segment.charAt(0).toUpperCase() + segment.slice(1);
	};

	return (
		<header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="#">QR Coder</BreadcrumbLink>
						</BreadcrumbItem>
						{pathSegments.map((segment, index) => {
							const isLast = index === pathSegments.length - 1;
							const name = getReadableName(segment);

							return (
								<div key={segment} className="flex items-center">
									<BreadcrumbSeparator className="hidden md:block" />
									<BreadcrumbItem>
										{isLast ? (
											<BreadcrumbPage>{name}</BreadcrumbPage>
										) : (
											<BreadcrumbLink
												// href={`/${pathSegments.slice(0, index + 1).join("/")}`}
												// Make non-clickable for now or implement proper routing logic if needed
												className="cursor-default"
											>
												{name}
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
								</div>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					className="cursor-pointer"
					onClick={toggleTheme}
					aria-label="Toggle theme"
				>
					{theme === "light" ? (
						<Sun className="h-5 w-5" />
					) : (
						<Moon className="h-5 w-5" />
					)}
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="cursor-pointer bg-[rgb(255,221,0)] text-stone-900"
					onClick={() =>
						window.open("https://buymeacoffee.com/goker", "_blank")
					}
				>
					<Coffee className="h-4 w-4 pl-0.5" />
				</Button>
			</div>
		</header>
	);
}
