import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { WiFiPayload } from "@/lib/types";

interface WiFiFormProps {
	value: WiFiPayload;
	onChange: (value: WiFiPayload) => void;
}

export function WiFiForm({ value, onChange }: WiFiFormProps) {
	return (
		<div className="space-y-3">
			<Input
				placeholder="SSID (Network Name)"
				value={value.ssid}
				onChange={(e) => onChange({ ...value, ssid: e.target.value })}
			/>
			<div className="grid grid-cols-2 gap-4">
				<Select
					value={value.encryption}
					onValueChange={(v) =>
						onChange({
							...value,
							encryption: v as WiFiPayload["encryption"],
						})
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Encryption" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="WPA">WPA/WPA2</SelectItem>
						<SelectItem value="WEP">WEP</SelectItem>
						<SelectItem value="nopass">No Password</SelectItem>
					</SelectContent>
				</Select>
				<Input
					type="password"
					placeholder="Password"
					value={value.password || ""}
					onChange={(e) => onChange({ ...value, password: e.target.value })}
					disabled={value.encryption === "nopass"}
				/>
			</div>
			<div className="flex items-center space-x-2">
				<Switch
					id="hidden-wifi"
					checked={value.hidden}
					onCheckedChange={(c) => onChange({ ...value, hidden: c })}
				/>
				<Label htmlFor="hidden-wifi">Hidden Network</Label>
			</div>
		</div>
	);
}
