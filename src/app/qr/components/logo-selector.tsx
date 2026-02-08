import { Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { logoService, type StoredLogo } from "@/lib/logo.storage";
import { cn } from "@/lib/utils";

interface LogoSelectorProps {
	selectedContent?: string;
	onSelect: (content: string | undefined) => void;
}

export function LogoSelector({ selectedContent, onSelect }: LogoSelectorProps) {
	const [logos, setLogos] = useState<StoredLogo[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Load logos on mount
	useEffect(() => {
		const loadLogos = async () => {
			const stored = await logoService.getLogos();
			setLogos(stored);
		};
		loadLogos();
	}, []);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;
		const file = files[0];

		if (file.type !== "image/svg+xml") {
			alert("Only SVG files are supported.");
			return;
		}

		const reader = new FileReader();
		reader.onload = async (e) => {
			const content = e.target?.result as string;
			if (content) {
				const newLogos = await logoService.addLogo(content);
				setLogos(newLogos);
				onSelect(content); // Auto-select uploaded logo
			}
		};
		reader.readAsText(file);

		// Reset file input
		event.target.value = "";
	};

	const handleDelete = async (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const logoToDelete = logos.find((l) => l.id === id);
		const newLogos = await logoService.deleteLogo(id);
		setLogos(newLogos); // Update local state directly from result to avoid reload flicker

		// If the deleted logo was the selected one, deselect it
		if (logoToDelete && logoToDelete.content === selectedContent) {
			onSelect(undefined);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Label>Logo Selection</Label>
				<Button
					variant="outline"
					size="sm"
					onClick={() => fileInputRef.current?.click()}
				>
					<Upload className="mr-2 h-4 w-4" />
					Upload
				</Button>
				<input
					type="file"
					ref={fileInputRef}
					className="hidden"
					accept=".svg"
					onChange={handleFileChange}
				/>
			</div>

			<div className="grid grid-cols-4 gap-3">
				{/* None Option - always first */}
				<button
					type="button"
					className={cn(
						"flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 p-2 transition-all hover:bg-muted/40",
						!selectedContent
							? "border-primary bg-primary/5 ring-2 ring-primary/20"
							: "border-muted bg-muted/20",
					)}
					onClick={() => onSelect(undefined)}
				>
					<span className="font-medium text-muted-foreground text-xs">
						None
					</span>
				</button>

				{logos.map((logo) => (
					<div
						key={logo.id}
						className={cn(
							"group relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 bg-background p-2 transition-all hover:border-primary/50",
							selectedContent === logo.content
								? "border-primary bg-primary/5 ring-2 ring-primary/20"
								: "border-muted",
						)}
					>
						<button
							type="button"
							onClick={() => onSelect(logo.content)}
							className="absolute inset-0 h-full w-full opacity-0"
							aria-label="Select logo"
						/>
						<div
							className="h-full w-full [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted content
							dangerouslySetInnerHTML={{ __html: logo.content }}
						/>
						<Button
							variant="destructive"
							size="icon"
							className="absolute -top-2 -right-2 h-6 w-6 scale-75 opacity-0 shadow-sm transition-opacity hover:scale-100 group-hover:opacity-100"
							onClick={(e) => handleDelete(logo.id, e)}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				))}
			</div>
			{logos.length === 0 && (
				<p className="py-2 text-center text-muted-foreground text-xs">
					No saved logos. Upload an SVG to get started.
				</p>
			)}
		</div>
	);
}
