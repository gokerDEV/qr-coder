import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { QRContentSettings } from "@/app/qr/components/content-settings";
import { QRStyleSettings } from "@/app/qr/components/style-settings";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { settingsService } from "@/lib/storage";
import { DEFAULT_QR_OPTIONS, type QROptions } from "@/lib/types";

export function SettingsPage() {
	const [options, setOptions] = useState<QROptions>(DEFAULT_QR_OPTIONS);
	const [loading, setLoading] = useState(true);
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		settingsService.getSettings().then((s) => {
			setOptions(s.defaultOptions);
			setLoading(false);
		});
	}, []);

	const handleSave = async () => {
		await settingsService.updateSettings({ defaultOptions: options });
		setSaved(true);
		setTimeout(() => setSaved(false), 2000);
	};

	if (loading) {
		return <div className="p-4 text-muted-foreground">Loading settings...</div>;
	}

	return (
		<div className="space-y-6">
			<Card className="max-w-3xl">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Global Settings</CardTitle>
							<CardDescription>
								Default settings used by the extension popup.
							</CardDescription>
						</div>
						<Button onClick={handleSave}>
							<Save className="mr-2 h-4 w-4" />
							{saved ? "Saved!" : "Save Defaults"}
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Reusing the QROptionsForm but only rendering form fields, 
                        we wrap it here to match layout or we could adjust QROptionsForm 
                        to accept className. For now, embedding it is fine. */}
					<div className="space-y-8">
						<QRContentSettings options={options} onChange={setOptions} />
						<div className="border-t pt-6">
							<h3 className="mb-4 font-medium text-lg">Appearance</h3>
							<QRStyleSettings options={options} onChange={setOptions} />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
