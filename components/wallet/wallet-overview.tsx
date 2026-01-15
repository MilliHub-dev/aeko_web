import {
	ArrowDownLeft,
	ArrowUpDown,
	ArrowUpRight,
	ChevronDownIcon,
	Settings2Icon,
	SettingsIcon,
	TrendingUp
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "../ui/card";
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from "../ui/avatar";
import { ScrollArea } from "@base-ui-components/react/scroll-area";

type WalletTransactions = {
	id: number;
	type: "received" | "sent" | "withdrawal";
	title: string;
	amount: number;
	time: string;
	icon?: string;
	avatar?: string;
	status: "completed" | "pending" | "failed";
};

type WalletOverviewProps = {
	balance: number;
	usdValue: number;
	transactions: WalletTransactions[];
};

const WalletOverview = ({
	balance,
	usdValue,
	transactions
}: WalletOverviewProps) => {
	return (
		<div className="min-h-[calc(100vh-6rem)] space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">
						Portfolio Overview
					</h1>
					<p className="text-muted-foreground">
						Manage your Aeko tokens and
						transactions
					</p>
				</div>
			</div>

			{/* Balance Cards Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Balance Card */}
				<Card className="lg:col-span-1 shadow-md border-none h-[350px] text-black">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg">
								Aekocoin Balance
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4 ">
							<div className="text-center">
								<h2 className="text-4xl font-bold">
									{balance.toFixed(8)}
								</h2>
								<div className="flex items-center gap-2 mt-2">
									<span className="text-xl font-semibold">
										${usdValue}
									</span>
									<span className="text-muted-foreground">
										(USD)
									</span>
									<Badge
										variant="secondary"
										className="text-green-600 bg-green-50"
									>
										+5.6%
									</Badge>
								</div>
							</div>

							{/* Quick Actions */}
							<div className="grid grid-cols-2 gap-3 pt-4">
								<Button className="flex items-center justify-center gap-2 h-16">
									<ArrowUpDown className="h-5 w-5 text-white" />
									<span className="text-md text-white">
										Withdraw
									</span>
								</Button>
								<Button
									variant="outline"
									className="flex items-center justify-center gap-2 h-16 bg-transparent"
								>
									<ArrowDownLeft className="h-5 w-5 text-black " />
									<span className="text-md text-black">
										Receive
									</span>
								</Button>
								<Button
									variant="outline"
									className="flex items-center justify-center gap-2 h-16 bg-transparent"
								>
									<ArrowUpRight className="h-5 w-5  text-black" />
									<span className="text-md text-black">
										Send
									</span>
								</Button>
								<Button
									variant="outline"
									className="flex items-center justify-center gap-2 h-16 bg-transparent"
								>
									<TrendingUp className="h-5 w-5  text-black" />
									<span className="text-md text-black">
										Stake
									</span>
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
				{/* Recent Transactions */}
				<div className="lg:col-span-2 border-none">
					<div className="flex items-center justify-between px-6">
						<CardTitle>
							Recent Transactions
						</CardTitle>
						<Button variant="ghost">
							View All
						</Button>
					</div>

					<CardContent>
						<ScrollArea.Root className="overflow-y-hidden pr-8">
							<ScrollArea.Viewport className="space-y-5 py-3 h-[calc(100vh-14rem)]">
								{transactions.map((tx) => (
									<Card
										key={tx.id}
										className="flex flex-row items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border-none inset-shadow-sm shadow-sm"
									>
										<div className="flex items-center gap-3">
											{tx.avatar ? (
												<Avatar className="h-10 w-10">
													<AvatarImage
														src={
															tx.avatar ||
															"/placeholder.svg"
														}
													/>
													<AvatarFallback>
														{
															tx
																.title[0]
														}
													</AvatarFallback>
												</Avatar>
											) : (
												<div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
													<span className="text-lg">
														{
															tx.icon
														}
													</span>
												</div>
											)}
											<div>
												<p className="font-medium">
													{
														tx.title
													}
												</p>
												<p className="text-sm text-muted-foreground">
													{tx.type ===
													"received"
														? "Received"
														: "Sent to"}{" "}
													•{" "}
													{
														tx.time
													}
												</p>
											</div>
										</div>
										<div className="text-right">
											<div className="flex items-center gap-2">
												<div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
													<span className="text-primary-foreground text-xs">
														A
													</span>
												</div>
												<span
													className={`font-semibold ${
														tx.amount >
														0
															? "text-green-600"
															: "text-red-600"
													}`}
												>
													{tx.amount >
													0
														? "+"
														: ""}
													{tx.amount.toFixed(
														2
													)}
												</span>
											</div>
											<Badge
												variant="secondary"
												className="text-xs mt-1"
											>
												{tx.status}
											</Badge>
										</div>
									</Card>
								))}
							</ScrollArea.Viewport>
							<ScrollArea.Scrollbar className="m-2 flex w-1 justify-center rounded bg-gray-200 opacity-0 transition-opacity delay-300 data-[hovering]:opacity-100 data-[hovering]:delay-0 data-[hovering]:duration-75 data-[scrolling]:opacity-100 data-[scrolling]:delay-0 data-[scrolling]:duration-75">
								<ScrollArea.Thumb className="w-full rounded bg-gray-500" />
							</ScrollArea.Scrollbar>
						</ScrollArea.Root>
					</CardContent>
				</div>
			</div>
		</div>
	);
};

export { WalletOverview };
export type { WalletTransactions };
