import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
	children: ReactNode;
	isOpen: boolean;
	onClose: () => void;
	origin?: { x: string; y: string };
	className?: string;
}

export function MotionOverlay({
	children,
	isOpen,
	onClose,
	origin = { x: "50%", y: "50%" },
	className,
}: Props) {
	const clipPathStart = `circle(0% at ${origin.x} ${origin.y})`;
	const clipPathEnd = `circle(150% at ${origin.x} ${origin.y})`;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ clipPath: clipPathStart }}
					animate={{ clipPath: clipPathEnd }}
					exit={{ clipPath: clipPathStart }}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
					className={cn(
						"dark fixed inset-0 z-40 flex flex-col items-center justify-center bg-black text-white backdrop-blur-sm",
						className,
					)}
				>
					<div className="absolute top-8 right-8 z-50">
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							className="text-white hover:bg-white/10 hover:text-white"
						>
							<X className="h-6 w-6" />
						</Button>
					</div>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
