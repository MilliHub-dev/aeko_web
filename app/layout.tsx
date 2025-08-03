import { BaseLayout } from "@/components/shared/base-layout";
import { ThemeProvider } from "@/components/theme/theme-provider";
import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Aeko Social",
	description: "Your Crypto Social Network"
};

const equitanSans = localFont({
	src: [
		{
			path: "../public/fonts/EquitanSans/EquitanSans-Thin.woff2",
			weight: "100",
			style: "normal"
		},
		{
			path: "../public/fonts/EquitanSans/EquitanSans-ThinItalic.woff2",
			weight: "100",
			style: "italic"
		},
		{
			path: "../public/fonts/EquitanSans/EquitanSans-ExtraLight.woff2",
			weight: "200",
			style: "normal"
		},
		{
			path: "../public/fonts/EquitanSans/EquitanSans-ExtraLightItalic.woff2",
			weight: "200",
			style: "italic"
		},
		{
			path: "../public/fonts/EquitanSans/EquitanSans-Light.woff2",
			weight: "300",
			style: "normal"
		},
		{
			path: "../public/fonts/EquitanSans/EquitanSans-LightItalic.woff2",
			weight: "300",
			style: "italic"
		},
		{
			path: "../public/fonts/EquitanSans/EquitanSans-Regular.woff2",
			weight: "400",
			style: "normal"
		},
		{
			path: "../public/fonts/EquitanSans/EquitanSans-Italic.woff2",
			weight: "400",
			style: "italic"
		},
		{
			path: "../public/fonts/EquitanSans/EquitanSans-SemiBold.woff2",
			weight: "600",
			style: "normal"
		},
		{
			path: "../public/fonts/EquitanSans/EquitanSans-SemiBoldItalic.woff2",
			weight: "600",
			style: "italic"
		},
		{
			path: "../public/fonts/EquitanSans/EquitanSans-Bold.woff2",
			weight: "700",
			style: "normal"
		},
		{
			path: "../public/fonts/EquitanSans/EquitanSans-BoldItalic.woff2",
			weight: "700",
			style: "italic"
		},
		{
			path: "../public/fonts/EquitanSans/EquitanSans-Black.woff2",
			weight: "900",
			style: "normal"
		},
		{
			path: "../public/fonts/EquitanSans/EquitanSans-BlackItalic.woff2",
			weight: "900",
			style: "italic"
		}
	],
	display: "swap",
	variable: "--font-equitan-sans"
});

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<body className={`${equitanSans.className} antialiased`}>
				<ThemeProvider>
					<BaseLayout>{children}</BaseLayout>
				</ThemeProvider>
			</body>
		</html>
	);
}
