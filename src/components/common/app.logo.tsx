import { QrCodeIcon } from "lucide-react";

export function Logo() {
	return (
		<>
			<div className="aspect-square size-8">
				<QrCodeIcon className="size-full" />
			</div>
			<div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
				<span className="truncate font-semibold">QR Coder</span>
				<span className="truncate text-xs">by goker</span>
			</div>
		</>
	);
}
