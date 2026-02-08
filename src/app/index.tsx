import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/components/common/app.layout";
import { HistoryPage } from "./history/page";
import { QRGeneratorPage } from "./qr/page";
import { ContentPage } from "./qr/pages/content.page";
import { StylePage } from "./qr/pages/style.page";
import { SettingsPage } from "./settings/page";
import "../style.css";

const rootElement = document.getElementById("root");

if (rootElement) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<HashRouter>
				<Routes>
					<Route element={<Layout />}>
						<Route path="/" element={<Navigate to="/qr/content" replace />} />
						<Route path="/qr" element={<QRGeneratorPage />}>
							<Route index element={<Navigate to="content" replace />} />
							<Route path="content" element={<ContentPage />} />
							<Route path="style" element={<StylePage />} />
						</Route>
						<Route path="/history" element={<HistoryPage />} />
						<Route path="/settings" element={<SettingsPage />} />
					</Route>
				</Routes>
			</HashRouter>
		</React.StrictMode>,
	);
}
