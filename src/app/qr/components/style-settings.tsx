import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { QR_TIER_CONFIG } from "@/config/qr-options.config";
import type { QRGrouping, QRModuleShape, QROptions } from "@/lib/types";
import { LogoSelector } from "./logo-selector";

interface QRStyleSettingsProps {
	options: QROptions;
	onChange: (options: QROptions) => void;
	tier?: "free" | "premium";
}

// --- Helper Components ---
function ColorInput({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (val: string) => void;
}) {
	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			<div className="flex gap-2">
				<Input
					type="color"
					className="h-9 w-12 cursor-pointer p-1"
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
				<Input
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="font-mono"
				/>
			</div>
		</div>
	);
}

function SliderInput({
	label,
	value,
	min,
	max,
	step,
	disabled,
	onChange,
	renderLabel,
}: {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	disabled?: boolean;
	onChange: (val: number) => void;
	renderLabel?: (v: number) => string;
}) {
	return (
		<div className="space-y-2">
			<Label>
				{label} ({renderLabel ? renderLabel(value) : value})
			</Label>
			<Slider
				disabled={disabled}
				min={min}
				max={max}
				step={step}
				value={[value]}
				onValueChange={([v]) => onChange(v)}
			/>
		</div>
	);
}

export function QRStyleSettings({
	options,
	onChange,
	tier = "free",
}: QRStyleSettingsProps) {
	const config = QR_TIER_CONFIG[tier];

	const updateOption = <K extends keyof QROptions>(
		key: K,
		value: QROptions[K],
	) => {
		onChange({ ...options, [key]: value });
	};

	return (
		<div className="space-y-6">
			{/* Colors */}
			<div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
				<h3 className="font-medium text-sm leading-none">Colors</h3>
				<div className="grid grid-cols-2 gap-4">
					<ColorInput
						label="Foreground"
						value={options.foregroundColor}
						onChange={(v) => updateOption("foregroundColor", v)}
					/>
					<ColorInput
						label="Background"
						value={options.backgroundColor}
						onChange={(v) => updateOption("backgroundColor", v)}
					/>
				</div>
			</div>

			{/* Logo */}
			<div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
				<div className="flex items-center justify-between">
					<Label htmlFor="logo-switch" className="font-medium text-sm">
						Logo
					</Label>
					<Switch
						id="logo-switch"
						checked={options.logoEnabled}
						onCheckedChange={(v) => updateOption("logoEnabled", v)}
					/>
				</div>

				{options.logoEnabled && (
					<div className="space-y-4 pt-2">
						<LogoSelector
							selectedContent={options.logoContent}
							onSelect={(content) => {
								updateOption("logoContent", content);
								// If clearing logo, maybe disable it? Or allow empty logo enabled state?
								// Usually if content is undefined, logoEnabled should be false or handled gracefully.
								if (!content) updateOption("logoEnabled", false);
							}}
						/>
						<div className="grid grid-cols-2 gap-4">
							<SliderInput
								label="Size (%)"
								value={options.logoSize}
								min={10}
								max={50}
								step={5}
								onChange={(v) => updateOption("logoSize", v)}
							/>
							<SliderInput
								label="Radius (%)"
								value={options.logoRadius}
								min={0}
								max={50}
								step={5}
								onChange={(v) => updateOption("logoRadius", v)}
							/>
						</div>
					</div>
				)}
			</div>
			<div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
				<h3 className="font-medium text-sm leading-none">Rendering Options</h3>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>Module Shape</Label>
						<Select
							value={options.moduleShape}
							onValueChange={(v) =>
								updateOption("moduleShape", v as QRModuleShape)
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="square">Square</SelectItem>
								<SelectItem value="circle">Circle</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Grouping</Label>
						<Select
							value={options.grouping}
							onValueChange={(v) => updateOption("grouping", v as QRGrouping)}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{config.grouping.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<SliderInput
						label="Global Rotation"
						value={options.rotateDeg}
						min={config.globalRotation.min}
						max={config.globalRotation.max}
						step={config.globalRotation.step}
						onChange={(v) => updateOption("rotateDeg", v)}
						renderLabel={(v) => `${v}°`}
					/>

					<SliderInput
						label="Module Rotation"
						value={options.moduleRotationDeg}
						min={config.moduleRotation.min}
						max={config.moduleRotation.max}
						step={config.moduleRotation.step}
						disabled={options.grouping !== "dot"}
						onChange={(v) => updateOption("moduleRotationDeg", v)}
						renderLabel={(v) => `${v}°`}
					/>

					<SliderInput
						label="Corner Radius"
						value={options.cornerRadius}
						min={0}
						max={6}
						step={1}
						onChange={(v) => updateOption("cornerRadius", v)}
					/>

					<SliderInput
						label="Margin Modules"
						value={options.margin}
						min={0}
						max={20}
						step={1}
						onChange={(v) => updateOption("margin", v)}
					/>

					<div className="col-span-2 flex items-center justify-between pt-2">
						<Label htmlFor="crisp-edges">Crisp Edges (sharp rendering)</Label>
						<Switch
							id="crisp-edges"
							checked={options.crispEdges}
							onCheckedChange={(c) => updateOption("crispEdges", c)}
						/>
					</div>
				</div>
			</div>

			{/* Logo Settings */}
		</div>
	);
}
