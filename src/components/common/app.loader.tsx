import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Credits } from "./credits";
import { useSystem } from "./system.context";

interface Props {
	children: ReactNode;
	timeout?: number;
}

export function AppLoader({ children, timeout = 3000 }: Props) {
	const { isLoading, startLoading } = useSystem();

	// Use a ref to prevent double-invocation of startLoading (Strict Mode or re-renders)
	// which could cause the progress bar to reset or flickering.
	const hasStarted = useRef(false);

	useEffect(() => {
		if (!hasStarted.current) {
			startLoading(timeout);
			hasStarted.current = true;
		}
	}, [startLoading, timeout]);
	return (
		<>
			{!isLoading && children}
			{isLoading && <Credits brand="goker" />}
		</>
	);
}
