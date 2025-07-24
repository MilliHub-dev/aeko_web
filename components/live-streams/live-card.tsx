import { Heart, MessageCircle, Share, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

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


const LiveStreamCard = ({ stream }: { stream: LiveStream }) => {
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
          <Badge
            variant="outline"
            className="text-xs font-normal px-2 py-0.5 border-blue-gem-200 dark:border-green-yellow-200 text-blue-gem-500 dark:text-green-yellow-500"
          >
            {stream.category}
          </Badge>
        </div>

        <Link href={`/live-streams/${stream.id}`}>
          <h3 className="text-lg font-semibold hover:text-blue-gem-500 dark:hover:text-green-yellow-300 transition-colors text-primary dark:text-primary-foreground">
            {stream.title}
          </h3>
        </Link>

        <div className="flex items-center space-x-2 text-primary dark:text-primary-foreground">
          <Avatar className="w-8 h-8">
            <AvatarImage src={stream.streamer.avatar} />
            <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
              {stream.streamer.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium ">
              {stream.streamer.name}
            </p>
            <p className="text-xs ">
              {stream.streamer.username}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 text-primary dark:text-primary-foreground">
          <div className="flex items-center space-x-4">
            <button className="transition-colors">
              <Heart size={18} />
            </button>
            <button className="transition-colors">
              <MessageCircle size={18} />
            </button>
            <button className="transition-colors">
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

const UpcomingStreamCard = ({ stream }: { stream: LiveStream }) =>{
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
      <div className="p-4 space-y-3 text-primary dark:text-primary-foreground">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="text-xs font-normal px-2 py-0.5 border-blue-gem-200 dark:border-green-yellow-200 text-primary dark:text-primary-foreground"
          >
            {stream.category}
          </Badge>
          <span className="text-xs font-medium">
            {stream.scheduledFor}
          </span>
        </div>

        <Link href={`/live-streams/${stream.id}`}>
          <h3 className="text-lg font-semibold transition-colors">
            {stream.title}``
          </h3>
        </Link>

        <div className="flex items-center space-x-2 text-primary dark:text-primary-foreground">
          <Avatar className="w-8 h-8">
            <AvatarImage src={stream.streamer.avatar} />
            <AvatarFallback className="bg-gray-300 text-xs">
              {stream.streamer.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {stream.streamer.name}
            </p>
            <p className="text-xs ">
              {stream.streamer.username}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <Button size="sm" className="rounded-full px-4">
            Remind Me
          </Button>
        </div>
      </div>
    </div>
  );
}

export { LiveStreamCard, UpcomingStreamCard };
export type { LiveStream };