import { RotateCcw, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { settingsService } from "@/lib/storage";
import { DEFAULT_QR_OPTIONS } from "@/lib/types";
import { QRStyleSettings } from "../components/style-settings";
import { useQR } from "../context";

export function StylePage() {
	const navigate = useNavigate();
	const { options, setOptions } = useQR();

	const handleTabChange = (value: string) => {
		if (value === "content") navigate("/qr/content");
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-lg tracking-tight">
					Style Customization
				</h2>
				<div className="flex gap-2">
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="outline" size="sm" title="Reset to defaults">
								<RotateCcw className="mr-2 h-4 w-4" />
								Reset
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Reset Style?</AlertDialogTitle>
								<AlertDialogDescription>
									This will revert all style settings to their default values.
									This action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => setOptions(DEFAULT_QR_OPTIONS)}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button size="sm" title="Save as default">
								<Save className="mr-2 h-4 w-4" />
								Save Default
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Save as Default?</AlertDialogTitle>
								<AlertDialogDescription>
									This will save the current style as the global default for all
									new QR codes.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() =>
										settingsService.updateSettings({ defaultOptions: options })
									}
								>
									Save
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>

			<Tabs value="style" onValueChange={handleTabChange} className="w-full">
				<TabsList className="mb-4 grid w-full grid-cols-2">
					<TabsTrigger value="content">Content</TabsTrigger>
					<TabsTrigger value="style">Style</TabsTrigger>
				</TabsList>

				<TabsContent value="style">
					<QRStyleSettings options={options} onChange={setOptions} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
