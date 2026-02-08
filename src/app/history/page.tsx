import { ArrowUpRight, Copy, Download, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQR } from "@/app/qr/context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { historyService } from "@/lib/storage";
import type { QRHistoryItem, VCardPayload, WiFiPayload } from "@/lib/types";

export function HistoryPage() {
	const [history, setHistory] = useState<QRHistoryItem[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const {
		setOptions,
		setInputType,
		setTextInput,
		setWifiInput,
		setVCardInput,
	} = useQR();

	const loadData = useCallback(async () => {
		setLoading(true);
		try {
			const data = await historyService.getHistory();
			setHistory(data);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleLoad = (item: QRHistoryItem) => {
		setOptions(item.options);
		setInputType(item.type);

		if (item.type === "text" || item.type === "url") {
			setTextInput(item.content as string);
		} else if (item.type === "wifi") {
			setWifiInput(item.content as WiFiPayload);
		} else if (item.type === "vcard") {
			setVCardInput(item.content as VCardPayload);
		}

		navigate("/qr/content");
	};

	const handleClear = async () => {
		if (
			confirm(
				"Are you sure you want to clear all history? This action cannot be undone.",
			)
		) {
			await historyService.clearHistory();
			loadData();
		}
	};
	// ... (export logic same) ...
	const handleExport = async () => {
		const json = await historyService.exportHistory();
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		chrome.downloads.download({
			url,
			filename: `qr-history-export-${Date.now()}.json`,
			saveAs: true,
		});
	};

	if (loading) {
		return (
			<div className="p-10 text-center text-muted-foreground">
				Loading history...
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-2xl tracking-tight">
					Generation History
				</h2>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={loadData}
						title="Refresh"
					>
						<RefreshCw className="h-4 w-4" />
					</Button>
					<Button variant="outline" onClick={handleExport}>
						<Download className="mr-2 h-4 w-4" /> Export JSON
					</Button>
					<Button variant="destructive" onClick={handleClear}>
						<Trash2 className="mr-2 h-4 w-4" /> Clear History
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader className="pb-2">
					<CardTitle>Recent Activity</CardTitle>
					<CardDescription>
						Your locally stored QR generation history.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{history.length === 0 ? (
						<div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
							<p>No history yet. Generate some QR codes!</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Timestamp</TableHead>
									<TableHead>Type</TableHead>
									<TableHead className="w-1/3">Content</TableHead>
									<TableHead>Options</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{history.map((item) => (
									<TableRow key={item.id}>
										<TableCell className="whitespace-nowrap font-medium">
											{new Date(item.timestamp).toLocaleString()}
										</TableCell>
										<TableCell>
											<Badge variant="secondary" className="capitalize">
												{item.type}
											</Badge>
										</TableCell>
										<TableCell className="max-w-xs truncate font-mono text-xs">
											{typeof item.content === "string"
												? item.content
												: JSON.stringify(item.content)}
										</TableCell>
										<TableCell className="text-muted-foreground text-xs">
											{item.options.ecc} • Mod: {item.options.moduleSize}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="secondary"
													size="icon"
													className="h-8 w-8"
													title="Load Configuration"
													onClick={() => handleLoad(item)}
												>
													<ArrowUpRight className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
													title="Copy Content"
													onClick={() => {
														const text =
															typeof item.content === "string"
																? item.content
																: JSON.stringify(item.content);
														navigator.clipboard.writeText(text);
													}}
												>
													<Copy className="h-3 w-3" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
