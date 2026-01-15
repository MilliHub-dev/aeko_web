import React from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from "@/components/ui/avatar";
import { Heart, CircleDollarSign } from "lucide-react";

export type NFTCardProps = {
	authorName: string;
	authorAvatar?: string;
	likes: number | string;
	imageSrc: string;
	title: string;
	bidCount: number;
	currentBid: number; // in USD or your preferred currency
	price: number; // listing price
	className?: string;
	onView?: () => void;
};

export function NFTCard({
	authorName,
	authorAvatar,
	likes,
	imageSrc,
	title,
	bidCount,
	currentBid,
	price,
	className,
	onView
}: NFTCardProps) {
	return (
		<Card
			className={[
				"w-[300px] rounded-2xl border gap-4 shadow-sm max-w-lg py-0 space-y-0",
				className
			]
				.filter(Boolean)
				.join(" ")}
		>
			<CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
				<div className="flex items-center gap-2 min-w-0">
					<Avatar className="h-6 w-6">
						<AvatarImage
							src={authorAvatar}
							alt={authorName}
						/>
						<AvatarFallback>
							{authorName
								.slice(0, 2)
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<span className="text-sm font-medium truncate">
						{authorName}
					</span>
				</div>
				<div className="flex items-center gap-1 text-muted-foreground">
					<Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
					<span className="text-xs font-medium">
						{likes}
					</span>
				</div>
			</CardHeader>

			<CardContent className="px-4 pb-0">
				<div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
					<img
						src={imageSrc}
						alt={title}
						className="h-full w-full object-cover"
					/>
				</div>

				<div className="mt-3 flex items-start justify-between">
					<div className="min-w-0">
						<h3 className="text-sm font-semibold leading-tight truncate">
							{title}
						</h3>
						<div className="mt-2 flex items-center justify-between">
							<span className="text-xs text-muted-foreground">
								Price:
							</span>
							<div className="flex items-center gap-1 text-sm font-medium">
								<CircleDollarSign className="h-4 w-4" />
								<span>
									{price.toFixed(2)}
								</span>
							</div>
						</div>
					</div>
					<div className="text-right leading-tight">
						<div className="text-[11px] text-muted-foreground">
							Bid: {bidCount}
						</div>
						<div className="text-sm font-semibold text-emerald-600">
							${currentBid}
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="p-4 pt-3">
				<Button
					className="w-full rounded-sm text-white"
					onClick={onView}
				>
					View Now
				</Button>
			</CardFooter>
		</Card>
	);
}
