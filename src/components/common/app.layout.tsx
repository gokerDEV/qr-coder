import { Outlet } from "react-router-dom";
import { QRProvider } from "@/app/qr/context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppLoader } from "./app.loader";
import { AppSidebar } from "./app.sidebar";
import { Credits } from "./credits";
import { Header } from "./header";
import { SystemProvider } from "./system.context";

export default function Layout() {
	return (
		<SystemProvider initialLoading={true}>
			<AppLoader timeout={3000}>
				<QRProvider>
					<SidebarProvider>
						<AppSidebar />
						<SidebarInset>
							<Header />
							<div className="flex flex-1 flex-col gap-4">
								<div className="min-h-[100vh] flex-1 p-6 md:min-h-min">
									<Outlet />
								</div>
							</div>
						</SidebarInset>
					</SidebarProvider>
					<Credits brand="goker" origin={{ x: "0%", y: "0%" }} />
				</QRProvider>
			</AppLoader>
		</SystemProvider>
	);
}
