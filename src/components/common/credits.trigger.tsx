import { Button } from "@/components/ui/button";
import { Logo } from "./app.logo";
import { useSystem } from "./system.context";

export function CreditsTrigger() {
	const { openOverlay } = useSystem();
	return (
		<Button
			variant="ghost"
			size="lg"
			className="group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:!h-12 relative h-16 overflow-visible rounded-none outline-none focus-visible:border-none focus-visible:ring-0"
			onClick={openOverlay}
		>
			<Logo />
			<div className="absolute right-1 bottom-0 cursor-pointer rounded-t-lg bg-border p-1 px-2 text-center font-medium text-[8px] text-foreground uppercase tracking-widest group-data-[collapsible=icon]:hidden">
				credits
			</div>
		</Button>
	);
}
