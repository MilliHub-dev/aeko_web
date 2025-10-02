import Link from "next/link";
import { Logo } from "../logo";

const LandingHeader = () => {
	return (
		<header className="relative mx-auto max-w-full p-6 lg:px-12 lg:py-4 flex items-center justify-between">
			<div className="flex items-center gap-3">
				<Link
					href="/"
					className="w-16 lg:w-24"
				>
					<Logo />
				</Link>
			</div>
			<nav className="flex items-center gap-8 text-md text-gray-600 ">
				<Link
					href="/login"
					className="btn-glass"
				>
					Login
				</Link>
				<Link
					href="/signup"
					className="btn-glass"
				>
					Sign up
				</Link>
			</nav>
		</header>
	);
};

export { LandingHeader };
