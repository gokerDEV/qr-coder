import React from "react";
import ReactDOM from "react-dom/client";
import { Popup } from "./Popup";
import "../style.css"; // Ensure Tailwind is loaded

const rootElement = document.getElementById("root");

if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<Popup />
		</React.StrictMode>,
	);
}
