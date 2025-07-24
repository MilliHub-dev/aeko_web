"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState } from "react";
import { Heart, MessageCircle, Share, Users } from "lucide-react";

interface LiveStream {
  id: number;
  title: string;
  streamer: {
    name: string;
    username: string;
    avatar: string;
  };
  category: string;
  viewers: number;
  thumbnail: string;
  isLive: boolean;
  scheduledFor?: string;
  description: string;
}

export function LiveStreamContent() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = [
    "All",
    "Gaming",
    "Music",
    "Talk Shows",
    "Sports",
    "Education",
    "Creative",
  ];

  const liveStreams: LiveStream[] = [
    {
      id: 1,
      title: "Building a Next.js App from Scratch",
      streamer: {
        name: "DevMaster",
        username: "@devmaster",
        avatar: "/placeholder.svg",
      },
      category: "Education",
      viewers: 1245,
      thumbnail: "/placeholder.svg",
      isLive: true,
      description: "Learn how to build a full-stack application with Next.js and deploy it to production.",
    },
    {
      id: 2,
      title: "Late Night Coding Session - Building a Twitter Clone",
      streamer: {
        name: "CodeNinja",
        username: "@codeninja",
        avatar: "/placeholder.svg",
      },
      category: "Education",
      viewers: 876,
      thumbnail: "/placeholder.svg",
      isLive: true,
      description: "Join me as I build a Twitter clone using React, Node.js, and MongoDB.",
    },
    {
      id: 3,
      title: "Apex Legends Ranked Grind",
      streamer: {
        name: "GamerPro",
        username: "@gamerpro",
        avatar: "/placeholder.svg",
      },
      category: "Gaming",
      viewers: 3421,
      thumbnail: "/placeholder.svg",
      isLive: true,
      description: "Watch me climb to Predator rank in Apex Legends Season 18.",
    },
    {
      id: 4,
      title: "Piano Practice & Chill",
      streamer: {
        name: "MusicLover",
        username: "@musiclover",
        avatar: "/placeholder.svg",
      },
      category: "Music",
      viewers: 567,
      thumbnail: "/placeholder.svg",
      isLive: true,
      description: "Relaxing piano session with viewer requests and improvisation.",
    },
    {
      id: 5,
      title: "Tech Talk: The Future of AI",
      streamer: {
        name: "TechGuru",
        username: "@techguru",
        avatar: "/placeholder.svg",
      },
      category: "Talk Shows",
      viewers: 0,
      thumbnail: "/placeholder.svg",
      isLive: false,
      scheduledFor: "Tomorrow at 7:00 PM",
      description: "Discussion about the latest advancements in artificial intelligence and machine learning.",
    },
    {
      id: 6,
      title: "Digital Art Creation - Character Design",
      streamer: {
        name: "ArtistPro",
        username: "@artistpro",
        avatar: "/placeholder.svg",
      },
      category: "Creative",
      viewers: 0,
      thumbnail: "/placeholder.svg",
      isLive: false,
      scheduledFor: "Friday at 3:00 PM",
      description: "Watch me design game characters from concept to final artwork using Procreate.",
    },
  ];

  // Filter streams based on active category
  const filteredStreams = activeCategory === "All" 
    ? liveStreams 
    : liveStreams.filter(stream => stream.category === activeCategory);

  // Separate live and upcoming streams
  const liveNow = filteredStreams.filter(stream => stream.isLive);
  const upcoming = filteredStreams.filter(stream => !stream.isLive);

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-2 hide-scrollbar gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === category
              ? "bg-blue-gem-500 text-white dark:bg-green-yellow-500 dark:text-gray-900"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Live Now Section */}
      {liveNow.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-gem-50 dark:text-green-yellow-300">
            Live Now
          </h2>
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
          <h2 className="text-xl font-semibold text-blue-gem-50 dark:text-green-yellow-300">
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
            No streams found for this category. Try selecting a different category.
          </p>
        </div>
      )}
    </div>
  );
}

function LiveStreamCard({ stream }: { stream: LiveStream }) {
  return (
    <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Stream Thumbnail */}
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-blue-gem-300 to-blue-gem-500 dark:from-green-yellow-300 dark:to-green-yellow-500">
          {/* Thumbnail would go here */}
        </div>
        <div className="absolute top-2 left-2">
          <Badge className="bg-red-500 text-white px-2 py-0.5 text-xs font-medium">
            LIVE
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2">
          <Badge className="bg-black/70 text-white px-2 py-0.5 text-xs font-medium flex items-center gap-1">
            <Users size={12} />
            {stream.viewers.toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* Stream Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs font-normal px-2 py-0.5 border-blue-gem-200 dark:border-green-yellow-200 text-blue-gem-500 dark:text-green-yellow-500">
            {stream.category}
          </Badge>
        </div>

        <Link href={`/live-streams/${stream.id}`}>
          <h3 className="text-lg font-semibold text-blue-gem-50 dark:text-green-yellow-100 hover:text-blue-gem-500 dark:hover:text-green-yellow-300 transition-colors">
            {stream.title}
          </h3>
        </Link>

        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={stream.streamer.avatar} />
            <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
              {stream.streamer.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {stream.streamer.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stream.streamer.username}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 dark:text-gray-400 hover:text-blue-gem-500 dark:hover:text-green-yellow-300 transition-colors">
              <Heart size={18} />
            </button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-blue-gem-500 dark:hover:text-green-yellow-300 transition-colors">
              <MessageCircle size={18} />
            </button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-blue-gem-500 dark:hover:text-green-yellow-300 transition-colors">
              <Share size={18} />
            </button>
          </div>
          <Button size="sm" className="rounded-full px-4">
            Watch
          </Button>
        </div>
      </div>
    </div>
  );
}

function UpcomingStreamCard({ stream }: { stream: LiveStream }) {
  return (
    <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Stream Thumbnail */}
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800">
          {/* Thumbnail would go here */}
        </div>
        <div className="absolute top-2 left-2">
          <Badge className="bg-blue-500 text-white px-2 py-0.5 text-xs font-medium">
            UPCOMING
          </Badge>
        </div>
      </div>

      {/* Stream Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs font-normal px-2 py-0.5 border-blue-gem-200 dark:border-green-yellow-200 text-blue-gem-500 dark:text-green-yellow-500">
            {stream.category}
          </Badge>
          <span className="text-xs text-blue-gem-500 dark:text-green-yellow-300 font-medium">
            {stream.scheduledFor}
          </span>
        </div>

        <Link href={`/live-streams/${stream.id}`}>
          <h3 className="text-lg font-semibold text-blue-gem-50 dark:text-green-yellow-100 hover:text-blue-gem-500 dark:hover:text-green-yellow-300 transition-colors">
            {stream.title}
          </h3>
        </Link>

        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={stream.streamer.avatar} />
            <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
              {stream.streamer.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {stream.streamer.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stream.streamer.username}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <Button variant="outline" size="sm" className="rounded-full px-4">
            Remind Me
          </Button>
        </div>
      </div>
    </div>
  );
}