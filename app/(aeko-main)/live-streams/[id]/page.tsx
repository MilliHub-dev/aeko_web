import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, Users } from "lucide-react";
import { LiveChat } from "@/components/live-streams/live-chat";

interface LiveStreamPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LiveStreamPage({ params }: LiveStreamPageProps) {
  // In a real app, you would fetch the stream data based on the ID
  const { id: streamId } = await params;

  // Mock data for demonstration
  const stream = {
    id: parseInt(streamId),
    title: "Building a Next.js App from Scratch",
    streamer: {
      name: "DevMaster",
      username: "@devmaster",
      avatar: "/placeholder.svg",
      followers: "12.5k",
    },
    category: "Education",
    viewers: 1245,
    likes: 342,
    description:
      "Learn how to build a full-stack application with Next.js and deploy it to production. We'll cover routing, data fetching, authentication, and more.",
    tags: ["coding", "webdev", "nextjs", "react"],
  };

  return (
    <div className=" space-y-5 px-6 py-6">
      <div className="gap-6 max-h-full">
        {/* Main Content - Video and Info */}
        <div className="space-y-4">
          {/* Video Player */}
          <div className="aspect-[16/10] bg-black/30 backdrop-blur-xl  rounded-2xl relative overflow-hidden">
            {/* Video would go here */}
            <video
              src="/demo.mp4"
              className="w-full h-full object-cover"
              // controls
            />
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <Badge className="bg-red-500 text-white px-2 py-0.5 text-xs font-medium">
                LIVE
              </Badge>
              <Badge className="bg-black/70 text-white px-2 py-0.5 text-xs font-medium flex items-center gap-1">
                <Users size={12} />
                {stream.viewers.toLocaleString()}
              </Badge>
            </div>
            {/* Stream Info */}
            <div className="absolute bottom-16 left-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-blue-gem-50 dark:text-green-yellow-300 mb-2">
                    {stream.title}
                  </h1>

                  <div className="flex items-center space-x-2 mb-4">
                    <Badge
                      variant="outline"
                      className="text-xs font-normal px-2 py-0.5 border-blue-gem-200 dark:border-green-yellow-200 text-blue-gem-500 dark:text-green-yellow-500"
                    >
                      {stream.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full flex items-center gap-1"
                  >
                    <Heart size={16} />
                    <span>{stream.likes}</span>
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Share size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={stream.streamer.avatar} />
                  <AvatarFallback className="bg-gray-300 text-gray-600 text-sm">
                    {stream.streamer.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {stream.streamer.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stream.streamer.username} • {stream.streamer.followers}{" "}
                        followers
                      </p>
                    </div>
                    <Button className="rounded-full px-4">Follow</Button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {stream.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {stream.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm text-blue-gem-500 dark:text-green-yellow-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Live Chat */}
            <div className="absolute top-0 bottom-0 right-6">
              <LiveChat streamId={streamId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
