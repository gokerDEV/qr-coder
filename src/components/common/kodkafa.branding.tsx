import { motion } from "framer-motion";

export const KodkafaLogo = () => (
	<motion.svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="h-full w-full"
		initial={{ opacity: 0, scale: 0.8 }}
		animate={{ opacity: 1, scale: 1 }}
		transition={{ duration: 0.5 }}
		aria-label="Kodkafa Logo"
	>
		<title>Kodkafa Logo</title>
		<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
	</motion.svg>
);
