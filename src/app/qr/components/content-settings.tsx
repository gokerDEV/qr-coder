import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type {
	QRCharset,
	QRErrorCorrectionLevel,
	QRMode,
	QROptions,
} from "@/lib/types";

interface QRContentSettingsProps {
	options: QROptions;
	onChange: (options: QROptions) => void;
}

export function QRContentSettings({
	options,
	onChange,
}: QRContentSettingsProps) {
	const updateOption = <K extends keyof QROptions>(
		key: K,
		value: QROptions[K],
	) => {
		onChange({ ...options, [key]: value });
	};

	return (
		<div className="space-y-4 rounded-lg border bg-muted/20 p-4">
			<h3 className="mb-2 font-semibold text-muted-foreground text-sm">
				Generation Settings
			</h3>
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>Correction Level</Label>
					<Select
						value={options.ecc}
						onValueChange={(v) =>
							updateOption("ecc", v as QRErrorCorrectionLevel)
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="L">Low (~7%)</SelectItem>
							<SelectItem value="M">Medium (~15%)</SelectItem>
							<SelectItem value="Q">Quartile (~25%)</SelectItem>
							<SelectItem value="H">High (~30%)</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label>Size ({options.moduleSize})</Label>
					<Slider
						min={2}
						max={20}
						step={1}
						value={[options.moduleSize]}
						onValueChange={([v]) => updateOption("moduleSize", v)}
					/>
				</div>
				<div className="space-y-2">
					<Label>Mode</Label>
					<Select
						value={options.mode}
						onValueChange={(v) => updateOption("mode", v as QRMode)}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="auto">Auto</SelectItem>
							<SelectItem value="byte">Byte</SelectItem>
							<SelectItem value="alphanumeric">Alphanumeric</SelectItem>
							<SelectItem value="numeric">Numeric</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label>Charset</Label>
					<Select
						value={options.charset}
						onValueChange={(v) => updateOption("charset", v as QRCharset)}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="utf-8">UTF-8</SelectItem>
							<SelectItem value="iso-8859-1">ISO-8859-1</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
}
