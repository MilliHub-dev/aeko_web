import { ThemeProvider } from "@/components/theme/theme-provider";
import { LanguageProvider } from "@/components/shared/language-context";
import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { equitanSans } from "@/lib/fonts";

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#000000" }
	],
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	interactiveWidget: "resizes-content"
};

export const metadata: Metadata = {
	title: {
		default: "Aeko",
		template: "%s | Aeko Social"
	},
	description: "Discover creators, live streams, and communities on Aeko and explore unlimited blockchain and web3 features.",
	metadataBase: new URL("https://aeko.social"),
	keywords: [
		"aeko",
		"social media",
		"crypto social media",
		"blockchain social media",
		"crypto communities",
		"live streams",
		"creators",
		"social network",
		"crypto",
		"web3",
		"communities"
	],
	openGraph: {
		title: "Aeko",
		description: "Discover creators, live streams, and communities on Aeko and explore unlimited blockchain and web3 features..",
		url: "https://aeko.social",
		siteName: "Aeko",
		images: [{ url: "/aeko-logo.png", width: 1200, height: 630, alt: "Aeko" }],
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: "Aeko",
		description: "Discover creators, live streams, and communities on Aeko and explore unlimited blockchain and web3 features.",
		images: ["/aeko-logo.png"]
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true
		}
	},
	alternates: {
		canonical: "https://aeko.social"
	},
	icons: {
		icon: "/icon.jpg",
		shortcut: "/icon.jpg",
		apple: "/icon.jpg"
	}
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
		>
			<body
				className={`${equitanSans.className} antialiased`}
			>
				<LanguageProvider>
					<ThemeProvider>
						{children}
						<Toaster richColors />
					</ThemeProvider>
				</LanguageProvider>
			</body>
		</html>
	);
}
