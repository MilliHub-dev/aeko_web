import { CategoryTabs } from "@/components/category-tabs";
import { NFTCard } from "@/components/nfts/nft-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Settings2 } from "lucide-react";

export default function NFTMarketPlace() {
	const auctions = [
		{
			authorName: "Clinton Rayyan",
			likes: "3.5k",
			imageSrc: "/mnt/data/NFT Card1.jpg",
			title: "Artistic Cosmetics",
			bidCount: 20,
			currentBid: 25,
			price: 54.0
		},
		{
			authorName: "Sofia Malik",
			likes: "1.2k",
			imageSrc: "/images/artwork1.jpg",
			title: "Vintage Perfume",
			bidCount: 10,
			currentBid: 40,
			price: 70.0
		},
		{
			authorName: "Ethan Cole",
			likes: "800",
			imageSrc: "/images/artwork2.jpg",
			title: "Luxury Skincare Set",
			bidCount: 15,
			currentBid: 32,
			price: 60.0
		},
		{
			authorName: "Ethan Cole",
			likes: "800",
			imageSrc: "/images/artwork2.jpg",
			title: "Luxury Skincare Set",
			bidCount: 15,
			currentBid: 32,
			price: 60.0
		},
		{
			authorName: "Ethan Cole",
			likes: "800",
			imageSrc: "/images/artwork2.jpg",
			title: "Luxury Skincare Set",
			bidCount: 15,
			currentBid: 32,
			price: 60.0
		},
		{
			authorName: "Ethan Cole",
			likes: "800",
			imageSrc: "/images/artwork2.jpg",
			title: "Luxury Skincare Set",
			bidCount: 15,
			currentBid: 32,
			price: 60.0
		},
		{
			authorName: "Ethan Cole",
			likes: "800",
			imageSrc: "/images/artwork2.jpg",
			title: "Luxury Skincare Set",
			bidCount: 15,
			currentBid: 32,
			price: 60.0
		},
		{
			authorName: "Ethan Cole",
			likes: "800",
			imageSrc: "/images/artwork2.jpg",
			title: "Luxury Skincare Set",
			bidCount: 15,
			currentBid: 32,
			price: 60.0
		},
		{
			authorName: "Ethan Cole",
			likes: "800",
			imageSrc: "/images/artwork2.jpg",
			title: "Luxury Skincare Set",
			bidCount: 15,
			currentBid: 32,
			price: 60.0
		},
		{
			authorName: "Ethan Cole",
			likes: "800",
			imageSrc: "/images/artwork2.jpg",
			title: "Luxury Skincare Set",
			bidCount: 15,
			currentBid: 32,
			price: 60.0
		}
	];

	const categories = [
		"All",
		"Art",
		"Fashion",
		"Music",
		"Photography",
		"Technology",
		"Travel",
		"Videography",
		"Anime"
	];

	return (
		<div className="space-y-5 px-4 mx-auto">
			<nav className="sticky top-0 bg-white border-b drop-shadow-[0_35px_25px_rgba(0,0,0,0.05)] space-y-4 z-50">
				<div className="max-w-7xl mx-auto py-3 flex justify-between items-center w-full">
					<h2 className="text-xl font-bold">
						NFTrades
					</h2>
					<div className="flex-1 relative max-w-md">
						<Input
							type="text"
							placeholder="Search NFTs..."
							className="pl-10 py-4 rounded-lg border focus:outline-none focus:ring focus:ring-green-500 w-full h-10"
						/>
						<div className="absolute left-2 top-1/2 -translate-y-1/2 text-black size-10 rounded-full flex items-center justify-center">
							<Search className="w-5 h-5" />
						</div>
					</div>
				</div>
				<CategoryTabs categories={categories} />
			</nav>
			<div className=" text-black ">
				<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 place-items-center h-full not-first-of-type:py-6 px-3">
					{auctions.map((auction, idx) => (
						<NFTCard
							key={`nft-card-${idx}`}
							{...auction}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
