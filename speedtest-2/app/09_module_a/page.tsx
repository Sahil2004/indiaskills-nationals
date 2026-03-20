export default function Module() {
	return (
		<main className="flex flex-col justify-center items-center gap-10 p-10">
			<h1 className="text-3xl">09_module_a</h1>
			<section className="flex justify-center items-center gap-5 flex-wrap">
				<a href="/09_module_a/A1">
					<article className="flex flex-col justify-center items-center gap-5 p-5 rounded-2xl border-2">
						<h2 className="text-2xl">A1</h2>
						<div className="w-[384px] h-[216px]">
							<iframe
								src="/09_module_a/A1"
								className="w-[1920px] h-[1080px] scale-20 border-2 rounded-4xl origin-top-left"
								inert
							></iframe>
						</div>
					</article>
				</a>
				<a href="/09_module_a/A2">
					<article className="flex flex-col justify-center items-center gap-5 p-5 rounded-2xl border-2">
						<h2 className="text-2xl">A2</h2>
						<div className="w-[384px] h-[216px]">
							<iframe
								src="/09_module_a/A2"
								className="w-[1920px] h-[1080px] scale-20 border-2 rounded-4xl origin-top-left"
								inert
							></iframe>
						</div>
					</article>
				</a>
				<a href="/09_module_a/A3">
					<article className="flex flex-col justify-center items-center gap-5 p-5 rounded-2xl border-2">
						<h2 className="text-2xl">A3</h2>
						<div className="w-[384px] h-[216px]">
							<iframe
								src="/09_module_a/A3"
								className="w-[1920px] h-[1080px] scale-20 border-2 rounded-4xl origin-top-left"
								inert
							></iframe>
						</div>
					</article>
				</a>
				<a href="/09_module_a/A4">
					<article className="flex flex-col justify-center items-center gap-5 p-5 rounded-2xl border-2">
						<h2 className="text-2xl">A4</h2>
						<div className="w-[384px] h-[216px]">
							<iframe
								src="/09_module_a/A4"
								className="w-[1920px] h-[1080px] scale-20 border-2 rounded-4xl origin-top-left"
								inert
							></iframe>
						</div>
					</article>
				</a>
			</section>
		</main>
	);
}
