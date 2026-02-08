import plecos from "@/assets/memory-l201-plecos.jpg";

export function CreditsMemorial() {
	return (
		<div className="flex w-full max-w-4xl flex-col items-center justify-center gap-8 py-32 opacity-50 transition-opacity duration-700 hover:opacity-100">
			<div className="relative aspect-[16/9] w-full max-w-2xl overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
				<img
					src={plecos}
					alt="In loving memory of L201 Plecos"
					className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
				<div className="absolute bottom-6 left-6 text-left">
					<h3 className="font-bold font-mono text-white text-xl tracking-wider">
						L201 Orinoco Angel Plecos
					</h3>
					<p className="mt-1 font-mono text-sm text-zinc-400">
						swimming in the eternal currents
					</p>
				</div>
			</div>

			<p className="font-mono text-xs text-zinc-600 uppercase tracking-[0.2em]">
				in loving memory - 21/12 - 26/02
			</p>
		</div>
	);
}
