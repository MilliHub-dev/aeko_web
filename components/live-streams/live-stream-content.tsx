"use client";

import { LiveStream, LiveStreamCard, UpcomingStreamCard } from "./live-card";

export function LiveStreamContent({
  activeCategory,
}: {
  activeCategory: string;
}) {
  const liveStreams: LiveStream[] = [
    {
      id: 1,
      title: "Bitcoin Technical Analysis & Trading",
      streamer: {
        name: "CryptoMaster",
        username: "@cryptomaster",
        avatar: "/placeholder.svg",
      },
      category: "Trading",
      viewers: 1245,
      thumbnail: "/placeholder.svg",
      isLive: true,
      description:
        "Live technical analysis of BTC/USD with real-time trading strategies and market insights.",
    },
    {
      id: 2,
      title: "DeFi Deep Dive - Yield Farming Strategies",
      streamer: {
        name: "DeFiGuru",
        username: "@defiguru",
        avatar: "/placeholder.svg",
      },
      category: "Education",
      viewers: 876,
      thumbnail: "/placeholder.svg",
      isLive: true,
      description:
        "Exploring the best yield farming opportunities across different DeFi protocols.",
    },
    {
      id: 3,
      title: "NFT Trading & Collection Review",
      streamer: {
        name: "NFTWhale",
        username: "@nftwhale",
        avatar: "/placeholder.svg",
      },
      category: "NFTs",
      viewers: 3421,
      thumbnail: "/placeholder.svg",
      isLive: true,
      description: "Live NFT trading, collection reviews, and market analysis.",
    },
    {
      id: 4,
      title: "Altcoin Season Analysis",
      streamer: {
        name: "AltHunter",
        username: "@althunter",
        avatar: "/placeholder.svg",
      },
      category: "Trading",
      viewers: 567,
      thumbnail: "/placeholder.svg",
      isLive: true,
      description:
        "Analyzing promising altcoins and their potential for the upcoming bull run.",
    },
    {
      id: 5,
      title: "Crypto Talk: The Future of Web3",
      streamer: {
        name: "Web3Expert",
        username: "@web3expert",
        avatar: "/placeholder.svg",
      },
      category: "Talk Shows",
      viewers: 0,
      thumbnail: "/placeholder.svg",
      isLive: false,
      scheduledFor: "Tomorrow at 7:00 PM",
      description:
        "Discussion about the latest developments in Web3, DAOs, and the future of decentralized internet.",
    },
    {
      id: 6,
      title: "Smart Contract Development Workshop",
      streamer: {
        name: "BlockchainDev",
        username: "@blockchaindev",
        avatar: "/placeholder.svg",
      },
      category: "Education",
      viewers: 0,
      thumbnail: "/placeholder.svg",
      isLive: false,
      scheduledFor: "Friday at 3:00 PM",
      description:
        "Learn how to develop and audit smart contracts on Ethereum and other EVM-compatible chains.",
    },
  ];

  // Filter streams based on active category
  const filteredStreams =
    activeCategory === "All"
      ? liveStreams
      : liveStreams.filter((stream) => stream.category === activeCategory);

  // Separate live and upcoming streams
  const liveNow = filteredStreams.filter((stream) => stream.isLive);
  const upcoming = filteredStreams.filter((stream) => !stream.isLive);

  return (
    <div className="space-y-8 py-4 text-black">
      {/* Live Now Section */}
      {liveNow.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Live Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveNow.map((stream) => (
              <LiveStreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Streams Section */}
      {upcoming.length > 0 && (
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold text-primary dark:text-primary-foreground">
            Upcoming Streams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((stream) => (
              <UpcomingStreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        </div>
      )}

      {/* No Streams Message */}
      {filteredStreams.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No streams found for this category. Try selecting a different
            category.
          </p>
        </div>
      )}
    </div>
  );
}
