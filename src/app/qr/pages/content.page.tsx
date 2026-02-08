import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { InputType, QROptions } from "@/lib/types";
import { QRContentSettings } from "../components/content-settings";
import { LogoSelector } from "../components/logo-selector";
import { VCardForm } from "../components/params/vcard-form";
import { WiFiForm } from "../components/params/wifi-form";
import { useQR } from "../context";

export function ContentPage() {
	const navigate = useNavigate();
	const {
		inputType,
		setInputType,
		textInput,
		setTextInput,
		wifiInput,
		setWifiInput,
		vCardInput,
		setVCardInput,
		options,
		setOptions,
	} = useQR();

	const handleTabChange = (value: string) => {
		if (value === "style") navigate("/qr/style");
	};

	const handleLogoSelect = (content: string | undefined) => {
		setOptions((prev: QROptions) => ({
			...prev,
			logoContent: content,
			logoEnabled: !!content,
		}));
	};

	return (
		<div className="space-y-6">
			<Tabs value="content" onValueChange={handleTabChange} className="w-full">
				<TabsList className="mb-4 grid w-full grid-cols-2">
					<TabsTrigger value="content">Content</TabsTrigger>
					<TabsTrigger value="style">Style</TabsTrigger>
				</TabsList>

				<TabsContent value="content" className="space-y-6">
					{/* 1. Content Input */}
					<Card>
						<CardHeader>
							<CardTitle>Data Content</CardTitle>
						</CardHeader>
						<CardContent>
							<Tabs
								value={inputType}
								onValueChange={(v) => setInputType(v as InputType)}
								className="w-full"
							>
								<TabsList className="mb-4 grid w-full grid-cols-4">
									<TabsTrigger value="text">Text</TabsTrigger>
									<TabsTrigger value="url">URL</TabsTrigger>
									<TabsTrigger value="wifi">WiFi</TabsTrigger>
									<TabsTrigger value="vcard">vCard</TabsTrigger>
								</TabsList>

								<TabsContent value="text">
									<Textarea
										placeholder="Enter text here..."
										className="min-h-[120px]"
										value={textInput}
										onChange={(e) => setTextInput(e.target.value)}
									/>
								</TabsContent>
								<TabsContent value="url">
									<Input
										type="url"
										placeholder="https://example.com"
										value={textInput}
										onChange={(e) => setTextInput(e.target.value)}
									/>
								</TabsContent>
								<TabsContent value="wifi">
									<WiFiForm value={wifiInput} onChange={setWifiInput} />
								</TabsContent>
								<TabsContent value="vcard">
									<VCardForm value={vCardInput} onChange={setVCardInput} />
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>

					{/* 2. Generation Settings (Size, Correction, Mode) - Kept with content as per original design or move to style? Original had it in content tab */}
					<QRContentSettings options={options} onChange={setOptions} />

					{/* 3. Logo Selection */}
					<div className="rounded-lg border bg-card p-4 shadow-sm">
						<LogoSelector
							selectedContent={options.logoContent}
							onSelect={handleLogoSelect}
						/>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
