import { Outlet } from "react-router-dom";
import { QRPreview } from "./components/qr-preview";
import { useQR } from "./context";

function QRLayoutContent() {
	const { svgContent, handleDownload } = useQR();

	return (
		<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
			{/* Left Column: Inputs & Settings (Pages) */}
			<div className="space-y-6 lg:col-span-2">
				<Outlet />
			</div>

			{/* Right Column: Preview */}
			<div className="lg:col-span-1">
				<div className="sticky top-6 space-y-4">
					<QRPreview svgContent={svgContent} onDownload={handleDownload} />
				</div>
			</div>
		</div>
	);
}

export function QRGeneratorPage() {
	return <QRLayoutContent />;
}
