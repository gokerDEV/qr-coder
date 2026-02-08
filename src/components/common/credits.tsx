import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import { useEffect } from "react";
import gokerCartoonish from "@/assets/goker-cartoonish.jpg";
import gokerNetwork from "@/assets/goker-network.svg";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PROFILES } from "@/lib/goker.profile";
import { BRANDING } from "@/services/branding.config";
import { CreditsMemorial } from "./credits.memorial";
import Logo from "./goker.logo";
import { MotionOverlay } from "./motion.overlay";
import { useSystem } from "./system.context";

interface CreditsProps {
	brand?: "goker" | "kodkafa";
	origin?: { x: string; y: string };
}

const creditsData: Record<
	"goker" | "kodkafa",
	{
		title: string;
		description: string;
		links?: { name: string; url: string }[];
	}
> = {
	goker: {
		title: "Crafted with passion by goker",
		description:
			"Hei, I'm goker! an open-source developer. " +
			"I create tools, libs, etc. and your feedback helps shape what I build next. " +
			"If you have ideas, suggestions, or just want to talk tech, you can send a message with a coffee" +
			" — or just buy me a coffee.",
		links: [
			{
				name: "goker.me",
				url: "https://goker.me",
			},
			{
				name: "goker.dev",
				url: "https://goker.dev",
			},
			{
				name: "goker.art",
				url: "https://goker.art",
			},
		],
	},
	kodkafa: {
		title: "KODKAFA",
		description:
			"Building digital experiences with passion and precision. Creator of QR Coder and many other open-source tools.",
	},
};

export function Credits({
	brand = "goker",
	origin = { x: "50%", y: "50%" },
}: CreditsProps) {
	const { isOpen, closeOverlay, isLoading, isReady, progress } = useSystem();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// If loading and ready (Press any key state), any key closes it.
			if (isLoading && isReady) {
				closeOverlay();
				return;
			}
			// If standard credits mode (open but not loading), only Escape closes it.
			if (isOpen && !isLoading && e.key === "Escape") {
				closeOverlay();
			}
		};

		if (isOpen) window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, isLoading, isReady, closeOverlay]);

	const { title, description, links } = creditsData[brand];

	return (
		<MotionOverlay
			isOpen={isOpen}
			origin={origin}
			onClose={closeOverlay}
			className="justify-start"
		>
			<ScrollArea className="h-full w-full">
				<div className="flex w-full flex-col items-center">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.1, duration: 0.3 }}
						className="relative flex min-h-screen w-full flex-col items-center justify-center space-y-6 p-8 text-center text-zinc-50"
					>
						<div className="h-48 w-48 text-primary">
							<Logo className="h-full w-full fill-white" />
						</div>

						<div className="flex max-w-3xl flex-col items-center gap-8 px-6 md:flex-row md:gap-12">
							<div className="relative flex h-48 w-48 flex-shrink-0 items-center justify-center md:h-64 md:w-64">
								{/* Rotating Background SVG */}
								<motion.img
									src={gokerNetwork}
									alt="Network"
									className="absolute inset-0 h-full w-full object-contain opacity-80"
									animate={{ rotate: -360 }}
									transition={{
										duration: 20,
										repeat: Number.POSITIVE_INFINITY,
										ease: "linear",
									}}
								/>

								{/* Stationary Profile Image */}
								<div className="relative z-10 h-36 w-36 overflow-hidden rounded-full border-2 border-white/20 shadow-xl md:h-48 md:w-48">
									<img
										src={gokerCartoonish}
										alt="Profile"
										className="h-full w-full object-cover"
									/>
								</div>
							</div>

							{/* Right Column: Content */}
							<div className="flex flex-col items-center space-y-6 text-center text-zinc-50 md:items-start md:text-left">
								<div className="space-y-4">
									<h2 className="font-bold text-2xl tracking-tight md:text-3xl">
										{title}
									</h2>
									<p className="max-w-md text-muted-foreground text-sm leading-relaxed">
										{description}{" "}
										<Button
											size="xs"
											className="h-4 gap-2"
											onClick={() =>
												window.open(
													BRANDING.CREDITS.BUY_ME_COFFEE_URL,
													"_blank",
												)
											}
										>
											FUEL ME BY <Coffee className="h-5 w-5" />
										</Button>
									</p>

									{links && (
										<div className="flex flex-wrap items-center justify-center gap-4 font-medium text-emerald-400 text-sm md:justify-start">
											{links.map(
												(
													link: { name: string; url: string },
													index: number,
												) => (
													<div
														key={link.url}
														className="flex items-center gap-4"
													>
														<a
															href={link.url}
															target="_blank"
															rel="noreferrer"
															className="transition-colors hover:text-emerald-300 hover:underline"
														>
															{link.name}
														</a>
														{index < links.length - 1 && (
															<span className="text-zinc-600">•</span>
														)}
													</div>
												),
											)}
										</div>
									)}
								</div>
							</div>
						</div>

						{isLoading ? (
							<div className="mt-4 flex min-h-[40px] w-full max-w-[300px] flex-col gap-2">
								{!isReady ? (
									<div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
										<motion.div
											className="h-full bg-white"
											initial={{ width: 0 }}
											animate={{ width: `${progress}%` }}
											transition={{ duration: 0.1, ease: "linear" }}
										/>
									</div>
								) : (
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: [0.5, 1, 0.5] }}
										transition={{
											duration: 1.5,
											repeat: Number.POSITIVE_INFINITY,
											ease: "easeInOut",
										}}
										className="cursor-pointer text-center font-medium text-sm text-white/80 uppercase tracking-widest"
										onClick={closeOverlay}
									>
										Press any key to start
									</motion.p>
								)}
							</div>
						) : (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className="flex items-center gap-4 pt-4"
							>
								<motion.p
									initial={{ opacity: 0 }}
									animate={{ opacity: [0.5, 1, 0.5] }}
									transition={{
										duration: 1.5,
										repeat: Number.POSITIVE_INFINITY,
										ease: "easeInOut",
									}}
									className="cursor-pointer text-center font-medium text-sm text-white/80 uppercase tracking-widest"
									onClick={closeOverlay}
								>
									Press "ESC" to close
								</motion.p>
							</motion.div>
						)}

						<div className="flex w-[600px] max-w-full flex-wrap items-center justify-center gap-4 pt-4">
							{Object.entries(PROFILES).map(([key, url]) => (
								<a
									key={key}
									href={url as string}
									target="_blank"
									rel="noreferrer"
									className="text-xl text-zinc-400 transition-colors hover:text-emerald-400"
									title={key}
								>
									<i className={`icon-${key}`} />
								</a>
							))}
						</div>

						<footer
							className="absolute bottom-8 text-muted-foreground text-sm"
							title="Developed with love, coffee and time"
						>
							{BRANDING.APP_NAME} {BRANDING.CREDITS.VERSION} • Developed with ❤️
							☕️ ⏰
						</footer>
					</motion.div>

					{!isLoading && <CreditsMemorial />}
				</div>
			</ScrollArea>
		</MotionOverlay>
	);
}
