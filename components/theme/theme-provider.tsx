"use client";

import { ThemeProvider as BaseThemeProvider } from "next-themes";
import { useEffect } from "react";

type ThemeProviderProps = {
	children: React.ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
	useEffect(() => {
		const storedSize = localStorage.getItem("aeko-font-size-scale");
		if (storedSize) {
			const size = parseInt(storedSize, 10);
			const scale = 85 + (size / 100) * 30;
			document.documentElement.style.fontSize = `${scale}%`;
		}
	}, []);

	return (
		<BaseThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem
		>
			{children}
		</BaseThemeProvider>
	);
};

export { ThemeProvider };
