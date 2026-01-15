import localFont from "next/font/local";

export const equitanSans = localFont({
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
