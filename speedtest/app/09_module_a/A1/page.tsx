"use client";
import { useEffect, useRef } from "react";
import "./a1.scss";

export default function A1() {
	const main = useRef<HTMLElement | null>(null);
	const glow = useRef<HTMLSpanElement | null>(null);
	const boxes = useRef<(HTMLElement | null)[]>([]);
	const threshold = 200;
	useEffect(() => {
		document.addEventListener("mousemove", (e: MouseEvent) => {
			const x = e.clientX;
			const y = e.clientY;
			if (glow.current) {
				glow.current.style.left = `${x}px`;
				glow.current.style.top = `${y}px`;
			}
			boxes.current.forEach((box, i) => {
				if (!box) return;
				const dim = box?.getBoundingClientRect() as DOMRect;
				const centerX = dim.x + dim.width / 2;
				const centerY = dim.y + dim.height / 2;
				const dx = x - centerX;
				const dy = y - centerY;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < threshold) {
					const scale = 1 + (1 - dist / threshold) * 0.3;
					box.style.scale = `${scale}`;
				} else {
					box.style.scale = "1";
				}
			});
		});
		document.body.style.overflow = "hidden";
	}, []);
	return (
		<main
			className="flex items-center justify-center gap-5 h-screen w-screen"
			ref={main}
		>
			<span
				className="block rounded-full w-40 h-40 blur-2xl bg-red-400 absolute -translate-1/2 z-0"
				ref={glow}
			></span>
			{[...Array(10)].map((_, i) => (
				<div
					key={i}
					className="w-20 h-20 bg-purple-400 z-10 box"
					ref={(box) => {
						boxes.current[i] = box;
					}}
				></div>
			))}
		</main>
	);
}
