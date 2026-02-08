import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

interface SystemContextType {
	isOpen: boolean;
	isLoading: boolean;
	progress: number;
	isReady: boolean; // Renamed from loadingComplete to isReady
	openOverlay: () => void;
	closeOverlay: () => void;
	toggleOverlay: () => void;
	startLoading: (duration: number) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({
	children,
	initialLoading = false,
}: {
	children: React.ReactNode;
	initialLoading?: boolean;
}) {
	const [isOpen, setIsOpen] = useState(initialLoading);
	const [isLoading, setIsLoading] = useState(initialLoading);
	const [progress, setProgress] = useState(0);
	const [isReady, setIsReady] = useState(false);

	const openOverlay = useCallback(() => setIsOpen(true), []);

	const closeOverlay = useCallback(() => {
		if (isLoading && !isReady) return;
		setIsOpen(false);
		setIsLoading(false);
		setIsReady(false);
		setProgress(0);
	}, [isLoading, isReady]);

	const startLoading = useCallback((duration: number) => {
		setIsLoading(true);
		setIsOpen(true);
		setProgress(0);
		setIsReady(false);

		const startTime = Date.now();
		const interval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			const p = Math.min((elapsed / duration) * 100, 100);
			setProgress(p);

			if (p >= 100) {
				clearInterval(interval);
				setIsReady(true);
			}
		}, 50);
	}, []);

	const toggleOverlay = useCallback(() => {
		if (isLoading) return;
		setIsOpen((prev) => !prev);
	}, [isLoading]);

	const value = useMemo(
		() => ({
			isOpen,
			isLoading,
			progress,
			isReady,
			openOverlay,
			closeOverlay,
			toggleOverlay,
			startLoading,
		}),
		[
			isOpen,
			isLoading,
			progress,
			isReady, // changed from loadingComplete
			openOverlay,
			closeOverlay,
			toggleOverlay,
			startLoading,
		],
	);

	return (
		<SystemContext.Provider value={value}>{children}</SystemContext.Provider>
	);
}

export function useSystem() {
	const context = useContext(SystemContext);
	if (context === undefined) {
		throw new Error("useSystem must be used within a SystemProvider");
	}
	return context;
}
