import Link from "next/link";
import { Logo } from "../logo";

const LandingHeader = () => {
	return (
		<header className="relative z-50 mx-auto w-full max-w-[1920px] p-6 lg:px-12 lg:py-4 flex items-center justify-between">
			<div className="flex items-center gap-3">
				<Link
					href="/"
					className="w-16 lg:w-24"
				>
					<Logo />
				</Link>
			</div>
			<nav className="flex items-center gap-6 text-md text-gray-500 ">
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
				<Link
					href="https://chain.aeko.social"
					className="btn-glass"
				>
					Aeko Chain
				</Link>
			</nav>
		</header>
	);
};

export { LandingHeader };
