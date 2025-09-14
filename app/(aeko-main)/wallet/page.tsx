"use client";

import { Tabs } from "@base-ui-components/react/tabs";
import {
	WalletOverview,
	WalletTransactions
} from "@/components/wallet/wallet-overview";
import {
	LucideChartLine,
	LucideFileClock,
	LucideNotebookTabs,
	SettingsIcon
} from "lucide-react";
import { Menu } from "@base-ui-components/react/menu";
import { Card } from "@/components/ui/card";

export default function AekoWallet() {
	const transactions: WalletTransactions[] = [
		{
			id: 1,
			type: "received",
			title: "Reel Tips",
			amount: 1.8,
			time: "16hr",
			icon: "🎬",
			status: "completed"
		},
		{
			id: 2,
			type: "received",
			title: "Referral Tips",
			amount: 2.2,
			time: "1d",
			icon: "👥",
			status: "completed"
		},
		{
			id: 3,
			type: "sent",
			title: "Riyyat Breem",
			amount: -3.0,
			time: "Jun, 16th",
			avatar: "/placeholder.svg?height=40&width=40",
			status: "completed"
		},
		{
			id: 4,
			type: "received",
			title: "Clinton Rayyan",
			amount: 430.0,
			time: "Aug, 7th",
			avatar: "/placeholder.svg?height=40&width=40",
			status: "completed"
		},
		{
			id: 5,
			type: "sent",
			title: "Riyyat Breem",
			amount: -3.0,
			time: "Jun, 16th",
			avatar: "/placeholder.svg?height=40&width=40",
			status: "completed"
		},
		{
			id: 6,
			type: "received",
			title: "Clinton Rayyan",
			amount: 430.0,
			time: "Aug, 7th",
			avatar: "/placeholder.svg?height=40&width=40",
			status: "completed"
		},
		{
			id: 7,
			type: "sent",
			title: "Riyyat Breem",
			amount: -3.0,
			time: "Jun, 16th",
			avatar: "/placeholder.svg?height=40&width=40",
			status: "completed"
		},
		{
			id: 8,
			type: "received",
			title: "Clinton Rayyan",
			amount: 430.0,
			time: "Aug, 7th",
			avatar: "/placeholder.svg?height=40&width=40",
			status: "completed"
		},
		{
			id: 9,
			type: "sent",
			title: "Riyyat Breem",
			amount: -3.0,
			time: "Jun, 16th",
			avatar: "/placeholder.svg?height=40&width=40",
			status: "completed"
		},
		{
			id: 10,
			type: "received",
			title: "Clinton Rayyan",
			amount: 430.0,
			time: "Aug, 7th",
			avatar: "/placeholder.svg?height=40&width=40",
			status: "completed"
		},
		{
			id: 11,
			type: "sent",
			title: "Riyyat Breem",
			amount: -3.0,
			time: "Jun, 16th",
			avatar: "/placeholder.svg?height=40&width=40",
			status: "completed"
		},
		{
			id: 12,
			type: "received",
			title: "Clinton Rayyan",
			amount: 430.0,
			time: "Aug, 7th",
			avatar: "/placeholder.svg?height=40&width=40",
			status: "completed"
		},
		{
			id: 13,
			type: "sent",
			title: "Riyyat Breem",
			amount: -3.0,
			time: "Jun, 16th",
			avatar: "/placeholder.svg?height=40&width=40",
			status: "completed"
		},
		{
			id: 14,
			type: "received",
			title: "Clinton Rayyan",
			amount: 430.0,
			time: "Aug, 7th",
			avatar: "/placeholder.svg?height=40&width=40",
			status: "completed"
		},
		{
			id: 15,
			type: "sent",
			title: "Riyyat Breem",
			amount: -3.0,
			time: "Jun, 16th",
			avatar: "/placeholder.svg?height=40&width=40",
			status: "completed"
		}
	];

	return (
		<Tabs.Root
			className="flex-1"
			defaultValue="token"
		>
			<div className="flex justify-between items-center sticky bg-background top-0 py-2 px-6 z-10 isolate">
				<Tabs.List className="border-1 border-gray-100 rounded-full w-50 inset-shadow-sm">
					<Tabs.Tab
						value="token"
						className="flex-1 py-2 px-6 text-black data-[selected]:bg-primary data-[selected]:text-white rounded-full w-[50%]"
					>
						Token
					</Tabs.Tab>
					<Tabs.Tab
						value="nft"
						className="flex-1 py-2 px-6 text-black data-[selected]:bg-primary data-[selected]:text-white rounded-full w-[50%]"
					>
						NFTs
					</Tabs.Tab>
				</Tabs.List>

				<Menu.Root>
					<Menu.Trigger className="flex p-4 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-[popup-open]:bg-gray-100">
						<SettingsIcon className="size-6" />
					</Menu.Trigger>
					<Menu.Portal>
						<Menu.Positioner
							className="outline-none"
							sideOffset={10}
							alignOffset={-90}
						>
							<Menu.Popup className="origin-[var(--transform-origin)] rounded-md bg-background text-black shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 w-[calc(100%+4rem)] p-4">
								<Card className="p-4 gap-y-1 border-none shadow-[0px_5px_7px_rgba(0,0,0,0.05)]">
									<Menu.Item className="flex items-center cursor-default text-sm leading-4 outline-none select-none hover:bg-secondary hover:text-primary p-2 rounded-sm">
										<LucideNotebookTabs className="size-5 mr-5" />
										Wallet Address
									</Menu.Item>
									<Menu.Item className="flex items-center cursor-default text-sm leading-4 outline-none select-none hover:bg-secondary hover:text-primary p-2 rounded-sm">
										<LucideFileClock className="size-5 mr-5" />
										Transaction History
									</Menu.Item>
									<Menu.Item className="flex items-center cursor-default text-sm leading-4 outline-none select-none hover:bg-secondary hover:text-primary p-2 rounded-sm">
										<LucideChartLine className="size-5 mr-5" />
										Coin Value
									</Menu.Item>
								</Card>
								<Card className="p-4 gap-y-1 border-none shadow-[0px_5px_7px_rgba(0,0,0,0.05)]">
									<Menu.Item className="flex items-center cursor-default text-sm leading-4 outline-none select-none hover:bg-secondary hover:text-primary p-2 rounded-sm">
										<LucideFileClock className="size-5 mr-5" />
										Transaction History
									</Menu.Item>
									<Menu.Item className="flex items-center cursor-default text-sm leading-4 outline-none select-none hover:bg-secondary hover:text-primary p-2 rounded-sm">
										<LucideChartLine className="size-5 mr-5" />
										Coin Value
									</Menu.Item>
								</Card>
								<Card className="p-4 gap-y-1 border-none shadow-[0px_5px_7px_rgba(0,0,0,0.05)]">
									<Menu.Item className="flex items-center cursor-default text-sm leading-4 outline-none select-none hover:bg-secondary hover:text-primary p-2 rounded-sm">
										<LucideFileClock className="size-5 mr-5" />
										Transaction History
									</Menu.Item>
									<Menu.Item className="flex items-center cursor-default text-sm leading-4 outline-none select-none hover:bg-secondary hover:text-primary p-2 rounded-sm">
										<LucideChartLine className="size-5 mr-5" />
										Coin Value
									</Menu.Item>
								</Card>
							</Menu.Popup>
						</Menu.Positioner>
					</Menu.Portal>
				</Menu.Root>
			</div>
			<div className="overflow-y-auto">
				<Tabs.Panel
					value="token"
					className="relative px-8 h-full"
				>
					<WalletOverview
						balance={1000}
						usdValue={100000}
						transactions={transactions}
					/>
				</Tabs.Panel>
				<Tabs.Panel
					value="nft"
					className="relative overflow-y-auto"
				>
					<WalletOverview
						balance={1000}
						usdValue={100000}
						transactions={transactions}
					/>
				</Tabs.Panel>
			</div>
		</Tabs.Root>
	);
}
