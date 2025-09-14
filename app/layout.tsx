import { ThemeProvider } from "@/components/theme/theme-provider";
import type { Metadata } from "next";
import "./globals.css";
import { equitanSans } from "@/lib/fonts";

export const metadata: Metadata = {
	title: "Aeko Social",
	description: "Your Crypto Social Network"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className="snap-y snap-proximity"
		>
			<body
				className={`${equitanSans.className} antialiased`}
			>
				<ThemeProvider>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
