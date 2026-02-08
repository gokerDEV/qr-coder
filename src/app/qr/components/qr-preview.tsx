import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QRPreviewProps {
	svgContent: string;
	onDownload: (format: "svg" | "png") => void;
	inputType?: string; // For generating filename internally if we move logic here
}

export function QRPreview({ svgContent, onDownload }: QRPreviewProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Preview</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border bg-muted/20 p-4 shadow-inner">
					{svgContent ? (
						<div
							className="flex h-full w-full items-center justify-center"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted SVG content
							dangerouslySetInnerHTML={{ __html: svgContent }}
						/>
					) : (
						<div className="p-4 text-center text-muted-foreground">
							<RefreshCw className="mx-auto mb-2 h-8 w-8 opacity-50" />
							<p>Enter content to generate</p>
						</div>
					)}
				</div>
				{svgContent && (
					<div className="mt-4 grid grid-cols-2 gap-3">
						<Button onClick={() => onDownload("svg")}>
							<Download className="mr-2 h-4 w-4" /> SVG
						</Button>
						<Button variant="secondary" onClick={() => onDownload("png")}>
							<Download className="mr-2 h-4 w-4" /> PNG
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
