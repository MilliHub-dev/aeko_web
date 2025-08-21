"use client";

import { ExploreContent } from "@/components/explore/explore-content";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@base-ui-components/react/tabs";
import { CategoryTabs } from "@/components/category-tabs";
import { Post, PostProps } from "@/components/home/post-feed/post";
import Link from "next/link";
import { Card } from "@/components/communities/card/card";

const categories = [
  "For You",
  "Trending",
  "DeFi",
  "NFTs",
  "Trading",
  "Technology",
];

interface TrendingTopic {
  id: number;
  title: string;
  category: string;
  timeAgo: string;
  avatars: string[];
  image?: string;
  description: string;
}

export default function CommunitiesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("For You");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  // Recent search users data
  const recentSearchUsers = [
    {
      id: 1,
      name: "Dr Mille",
      username: "@drmille",
      avatar: "/users/mike-chen.jpg",
    },
    {
      id: 2,
      name: "Ayo Mash",
      username: "@aymash",
      avatar: "/users/sarah-johnson.jpeg",
    },
    {
      id: 3,
      name: "Debby",
      username: "@fingerlittle",
      avatar: "/users/lisa-wong.jpeg",
    },
    {
      id: 4,
      name: "Joshua Martins",
      username: "@joshmart",
      avatar: "/users/alex-rivera.jpg",
    },
    {
      id: 5,
      name: "Dr Mille",
      username: "@drmille",
      avatar: "/users/emily-carter.jpg",
    },
  ];

  // Recent search queries
  const recentSearches = [
    "Pricillia Baby's announcement",
    "Kussman's Wedding",
    "Kussman's Wife",
    "Kussman's Wife's black eye",
  ];

  // Trending topics
  const trending = ["#Pric's baby", "#you.me.us", "#challenge"];

  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };

  const trendingTopics: TrendingTopic[] = [
    {
      id: 1,
      title: "Bitcoin ETF Approval: Market Impact Analysis",
      category: "Trading",
      timeAgo: "Trending Now",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      image: "/placeholder.svg",
      description:
        "Breaking down the implications of spot Bitcoin ETF approvals on crypto markets.",
    },
    {
      id: 2,
      title: "Ethereum's New Layer 2 Solutions Transform DeFi Landscape",
      category: "DeFi",
      timeAgo: "Trending Now",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      image: "/placeholder.svg",
      description:
        "Latest developments in Ethereum scaling solutions revolutionize DeFi protocols.",
    },
    {
      id: 3,
      title: "NFT Gaming Platform Secures $100M Investment",
      category: "NFTs",
      timeAgo: "Trending Now",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      image: "/placeholder.svg",
      description:
        "Major investment signals growing confidence in blockchain gaming sector.",
    },
    {
      id: 4,
      title: "New DeFi Protocol Promises Zero-Knowledge Privacy",
      category: "DeFi",
      timeAgo: "Trending Now",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      image: "/placeholder.svg",
      description:
        "Revolutionary protocol combines DeFi functionality with enhanced privacy features.",
    },
    {
      id: 5,
      title: "AI Trading Bots Show Promise in Crypto Markets",
      category: "Technology",
      timeAgo: "2 hours ago",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      image: "/placeholder.svg",
      description:
        "Machine learning algorithms achieve breakthrough performance in crypto trading.",
    },
    {
      id: 6,
      title: "Green Bitcoin Mining Initiative Gains Traction",
      category: "Technology",
      timeAgo: "5 hours ago",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      image: "/placeholder.svg",
      description:
        "Major miners commit to renewable energy sources for sustainable crypto mining.",
    },
  ];

  const posts: PostProps[] = [
    {
      type: "image",
      username: "Lisa Wong",
      handle: "@lisawongdesigns",
      profileImage: "/users/lisa-wong.jpeg",
      backgroundImage: "/posts/interior-design-4x5.jpg",
      content:
        "Just finished this minimalist living room project! Love how the natural light plays with the neutral tones. Swipe for before photos ➡️ #InteriorDesign",
      likes: "4.2K",
      shares: "892",
      bookmarks: "345",
      comments: "167",
      hashtags: [
        "interiordesign",
        "minimalism",
        "homedecor",
        "design",
        "architecture",
      ],
      timePosted: "3h",
    },
    {
      type: "video",
      username: "Mike Chen",
      handle: "@chefmikechen",
      profileImage: "/users/mike-chen.jpg",
      backgroundImage: "/posts/cooking-thumbnail.jpg",
      videoSrc: "/posts/ramen-recipe.mp4",
      content:
        "The secret to perfect tonkotsu ramen! � Been perfecting this recipe for months. Full recipe in bio! #Cooking",
      likes: "89.4K",
      shares: "12.3K",
      bookmarks: "15.2K",
      comments: "3.4K",
      hashtags: ["cooking", "foodie", "ramen", "recipe", "chefsofinstagram"],
      timePosted: "5h",
    },
    {
      type: "text",
      username: "Sarah Johnson",
      handle: "@sarahcodes",
      profileImage: "/users/sarah-johnson.jpeg",
      content:
        "🎉 Big news! After 6 months of hard work, we've just open-sourced our React state management library. Already 2.5k stars on GitHub in just 24 hours! Check it out: github.com/statex/react\n\nProud of what our small team has accomplished. Threading some key features below... 🧵",
      likes: "3.1K",
      shares: "945",
      bookmarks: "721",
      comments: "234",
      hashtags: [
        "opensource",
        "reactjs",
        "javascript",
        "webdev",
        "programming",
      ],
      timePosted: "1h",
    },
    {
      type: "image",
      username: "Alex Rivera",
      handle: "@arivera.photo",
      profileImage: "/users/alex-rivera.jpg",
      backgroundImage: "/posts/street-photography-4x5.jpg",
      content:
        "Rainy evening in Tokyo. The neon lights reflecting off the wet streets create such a cyberpunk atmosphere. Shot on Sony A7IV, 35mm f/1.4 📸",
      likes: "12.5K",
      shares: "2.8K",
      bookmarks: "1.9K",
      comments: "428",
      hashtags: [
        "photography",
        "tokyo",
        "streetphotography",
        "nightlife",
        "urban",
      ],
      timePosted: "8h",
    },
    {
      type: "text",
      username: "Dr. Emily Carter",
      handle: "@dr_carter",
      profileImage: "/users/emily-carter.jpg",
      content:
        "Just published our research on AI-assisted cancer detection in Nature Medicine! Our model achieved 94% accuracy, potentially reducing diagnostic time by 60%.\n\nThank you to my amazing team and all the healthcare workers who helped validate the results. 🧬🔬\n\nLink to paper: nature.com/articles/s41591...",
      likes: "15.7K",
      shares: "8.9K",
      bookmarks: "6.2K",
      comments: "892",
      hashtags: ["science", "AI", "healthcare", "research", "medicine"],
      timePosted: "12h",
    },
  ];

  const handleSearchBlur = (e: React.FocusEvent) => {
    // Only hide if clicking outside the search area
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setShowSearchResults(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="space-y-5 px-6 pb-6 mx-auto">
      <Tabs.Root defaultValue="my-communities">
        <div className="sticky top-16 md:top-0 z-10 mb-6 -mx-4 pt-12 pb-6 px-4  text-black bg-background">
          <div>
            <h1 className="hidden md:block text-3xl font-semibold">
              Communities
            </h1>
          </div>
          <div className=" pb-2 pt-2">
            {/* Search Area - Visible on both mobile and desktop */}
            <div
              className="mb-4 relative"
              onBlur={handleSearchBlur}
              tabIndex={-1}
            >
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-black  size-10 rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </div>
                <Input
                  placeholder="Search for Communities"
                  className="w-full bg-gray-50 border-gray-200 rounded-full pl-15 pr-10 shadow-xl focus:outline-none focus:ring-2 focus:ring-secondary h-15 placeholder:text-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={handleClearSearch}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results Panel - Show when focused */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-20 p-4">
                  {/* Recent Search Section */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Recent Search</h3>
                      <button className="text-muted-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* User Avatars */}
                    <div className="flex space-x-4 mb-4 overflow-x-auto pb-2">
                      {recentSearchUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex flex-col items-center space-y-1 min-w-[60px]"
                        >
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium truncate w-full text-center">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate w-full text-center">
                            {user.username}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Recent Search Queries */}
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-1"
                        >
                          <span className="text-sm">{search}</span>
                          <button className="text-muted-foreground">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trending Topics Section */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Trending Topics</h3>
                      <button className="text-muted-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {trending.map((topic, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="rounded-full px-3 py-1"
                        >
                          {topic}
                          <button className="ml-1 text-muted-foreground">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Watch Viral Posts Section */}
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">
                      Watch viral posts
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="aspect-video bg-muted rounded-lg"></div>
                      <div className="aspect-video bg-muted rounded-lg"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Tabs.List className="flex justify-center items-center pt-12">
            <div className="">
              <Tabs.Tab
                value="my-communities"
                className="p-2 border border-primary w-45 rounded-l-2xl  data-[selected]:bg-primary data-[selected]:text-white"
              >
                My Communities
              </Tabs.Tab>
              <Tabs.Tab
                value="explore"
                className="p-2 border border-primary w-45 rounded-r-2xl data-[selected]:bg-primary data-[selected]:text-white"
              >
                Explore
              </Tabs.Tab>
              <Tabs.Indicator />
            </div>
          </Tabs.List>
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>
        <div className="space-y-2 mt-20 md:mt-0 text-black">
          <Tabs.Panel value="my-communities">
            {" "}
            {/* My Communities Grid */}
            <div className="mb-8 flex justify-between">
              <h2 className="text-2xl font-semibold">Communities You Follow</h2>
              <Link
                href="/communities/my-communities"
                className="text-lg font-semibold text-primary-foreground"
              >
                See All
              </Link>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {posts.map((post, idx) => (
                <Card key={`image-${idx}`} {...post} />
              ))}
            </div>
            {/* Load More Button */}
            <div className="flex justify-center pt-4">
              <button className="px-6 py-2 rounded-full bg-blue-gem-100 text-blue-gem-600 dark:bg-gray-800 dark:text-green-yellow-300 hover:bg-blue-gem-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                Load More
              </button>
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="explore">
            {/* Trending Topics Grid */}
            <div className="my-8">
              <h2 className="text-2xl font-semibold">Trending Topics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <h3 className="text-lg font-semibold text-primary dark:text-primary-foreground transition-colors">
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
          </Tabs.Panel>
        </div>
      </Tabs.Root>
    </div>
  );
}
