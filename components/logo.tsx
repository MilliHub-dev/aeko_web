import { useTheme } from "next-themes";
import Image from "next/image";

interface LogoProps {
  size?: number;
}

const Logo = () => {
	return (
		<div className="">
			<img
				src="/aeko-mobile.svg"
				alt="aeko logo"
				className="object-contain"
			/>
		</div>
	);
};

export { Logo };
