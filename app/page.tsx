"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FloatingCards } from "@/components/landing/floating-cards";
import { LandingHeader } from "@/components/landing/landing-header";
import { motion } from "motion/react";
import Link from "next/link";

export default function LandingPage() {
	return (
		<main className="relative overflow-hidden min-h-screen bg-[radial-gradient(120%_120%_at_30%_10%,#007F6D,#003B33)] text-black">
			{/* Subtle texture */}
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_0%,transparent,rgba(0,0,0,0.04))]" />

			<LandingHeader />

			<section className="relative mx-auto max-w-[1920px] flex flex-col justify-center h-[calc(100vh-120px)] items-center gap-8 lg:gap-18 px-4 lg:px-12">
				<motion.h1
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center font-extrabold leading-tight mt-10 text-4xl md:text-6xl lg:text-7xl  text-secondary"
				>
					Transform Your Connections into
					<br />
					<span className="inline-block">
						Real-World Value.
					</span>
				</motion.h1>

				<FloatingCards
					images={[
						"/posts/street-photography.jpg",
						"/users/sarah-johnson.jpeg",
						"/posts/interior-design.jpg",
						"/users/mike-chen.jpg",
						"/posts/street-photography-4x5.jpg",
						"/users/alex-rivera.jpg",
						"/avatars/mich.jpeg"
					]}
				/>

				<motion.p
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						delay: 0.2,
						duration: 0.4
					}}
					className="hidden md:block max-w-2xl text-2xl text-center text-secondary"
				>
					From digital interactions to tangible
					value, Aeko lets you share, trade, and
					build with the people who matter most.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						delay: 0.25,
						duration: 0.4
					}}
				>
					<Button className="btn-glass rounded-full">
						<Link
							href="/login"
							className="flex gap-3 py-3"
						>
							Get Started
							<ArrowRight className="size-5" />
						</Link>
					</Button>
				</motion.div>
			</section>
		</main>
	);
}
