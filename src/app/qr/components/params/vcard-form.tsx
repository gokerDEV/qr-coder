import { Input } from "@/components/ui/input";
import type { VCardPayload } from "@/lib/types";

interface VCardFormProps {
	value: VCardPayload;
	onChange: (value: VCardPayload) => void;
}

export function VCardForm({ value, onChange }: VCardFormProps) {
	return (
		<div className="grid grid-cols-2 gap-3">
			<Input
				placeholder="First Name"
				value={value.firstName}
				onChange={(e) => onChange({ ...value, firstName: e.target.value })}
			/>
			<Input
				placeholder="Last Name"
				value={value.lastName || ""}
				onChange={(e) => onChange({ ...value, lastName: e.target.value })}
			/>
			<Input
				placeholder="Phone"
				className="col-span-2"
				value={value.phone || ""}
				onChange={(e) => onChange({ ...value, phone: e.target.value })}
			/>
			<Input
				placeholder="Email"
				className="col-span-2"
				value={value.email || ""}
				onChange={(e) => onChange({ ...value, email: e.target.value })}
			/>
		</div>
	);
}
