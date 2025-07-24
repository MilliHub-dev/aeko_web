"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

interface TrendingTopic {
  id: number;
  title: string;
  category: string;
  timeAgo: string;
  avatars: string[];
  image?: string;
  description: string;
}

export function ExploreContent() {

  const trendingTopics: TrendingTopic[] = [
    {
      id: 1,
      title: "Bitcoin ETF Approval: Market Impact Analysis",
      category: "Trading",
      timeAgo: "Trending Now",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      image: "/placeholder.svg",
      description: "Breaking down the implications of spot Bitcoin ETF approvals on crypto markets.",
    },
    {
      id: 2,
      title: "Ethereum's New Layer 2 Solutions Transform DeFi Landscape",
      category: "DeFi",
      timeAgo: "Trending Now",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      image: "/placeholder.svg",
      description: "Latest developments in Ethereum scaling solutions revolutionize DeFi protocols.",
    },
    {
      id: 3,
      title: "NFT Gaming Platform Secures $100M Investment",
      category: "NFTs",
      timeAgo: "Trending Now",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      image: "/placeholder.svg",
      description: "Major investment signals growing confidence in blockchain gaming sector.",
    },
    {
      id: 4,
      title: "New DeFi Protocol Promises Zero-Knowledge Privacy",
      category: "DeFi",
      timeAgo: "Trending Now",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      image: "/placeholder.svg",
      description: "Revolutionary protocol combines DeFi functionality with enhanced privacy features.",
    },
    {
      id: 5,
      title: "AI Trading Bots Show Promise in Crypto Markets",
      category: "Technology",
      timeAgo: "2 hours ago",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      image: "/placeholder.svg",
      description: "Machine learning algorithms achieve breakthrough performance in crypto trading.",
    },
    {
      id: 6,
      title: "Green Bitcoin Mining Initiative Gains Traction",
      category: "Technology",
      timeAgo: "5 hours ago",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      image: "/placeholder.svg",
      description: "Major miners commit to renewable energy sources for sustainable crypto mining.",
    },
  ];

  return (
    <div className="space-y-2 mt-20 md:mt-0">
      

      {/* Trending Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trendingTopics.map((topic) => (
          <div
            key={topic.id}
            className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Topic Image */}
            <div className="relative aspect-[16/9] bg-gradient-to-br from-blue-gem-300 to-blue-gem-500 dark:from-green-yellow-300 dark:to-green-yellow-500">
              {/* Image would go here */}
            </div>

            {/* Topic Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className="text-xs font-normal px-2 py-0.5 border-blue-gem-200 dark:border-green-yellow-200 text-blue-gem-500 dark:text-green-yellow-500"
                >
                  {topic.category}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {topic.timeAgo}
                </span>
              </div>

              <Link href={`/explore/topic/${topic.id}`}>
                <h3 className="text-lg font-semibold text-blue-gem-50 dark:text-green-yellow-100 hover:text-blue-gem-500 dark:hover:text-green-yellow-300 transition-colors">
                  {topic.title}
                </h3>
              </Link>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {topic.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  {/* Avatar Stack */}
                  <div className="flex -space-x-2">
                    {topic.avatars.slice(0, 3).map((avatar, index) => (
                      <Avatar
                        key={index}
                        className="w-6 h-6 border-2 border-white dark:border-gray-800"
                      >
                        <AvatarImage src={avatar} />
                        <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                          {index + 1}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +2.5k discussing
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-4">
        <button className="px-6 py-2 rounded-full bg-blue-gem-100 text-blue-gem-600 dark:bg-gray-800 dark:text-green-yellow-300 hover:bg-blue-gem-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
          Load More
        </button>
      </div>
    </div>
  );
}
