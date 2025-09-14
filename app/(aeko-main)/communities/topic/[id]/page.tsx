import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/components/home/post/components/post";

interface TopicPageProps {
  params: {
    id: string;
  };
}

export default function TopicPage({ params }: TopicPageProps) {
  // In a real app, you would fetch the topic data based on the ID
  const topicId = params.id;
  
  // Mock data for demonstration
  const topic = {
    id: parseInt(topicId),
    title: "Biden: Truth Over Smooth Speeches",
    category: "Politics",
    timeAgo: "Trending Now",
    description: "Latest updates on the presidential campaign and debates with comprehensive analysis from political experts and commentators.",
    discussionCount: "2.5k",
    avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  };

  return (
    <div className="space-y-6">
      {/* Topic Header */}
      <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden p-6">
        <div className="flex items-center space-x-2 mb-2">
          <Badge variant="outline" className="text-xs font-normal px-2 py-0.5 border-blue-gem-200 dark:border-green-yellow-200 text-blue-gem-500 dark:text-green-yellow-500">
            {topic.category}
          </Badge>
          <span className="text-xs text-gray-500 dark:text-gray-400">{topic.timeAgo}</span>
        </div>
        
        <h1 className="text-2xl font-bold text-blue-gem-50 dark:text-green-yellow-300 mb-4">
          {topic.title}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {topic.description}
        </p>
        
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {topic.avatars.map((avatar, index) => (
              <Avatar
                key={index}
                className="w-8 h-8 border-2 border-white dark:border-gray-800"
              >
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                  {index + 1}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            +{topic.discussionCount} discussing this topic
          </span>
        </div>
      </div>

      {/* Related Posts */}
      <h2 className="text-xl font-semibold text-blue-gem-50 dark:text-green-yellow-300 mt-8 mb-4">
        Related Posts
      </h2>
      
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <Post key={item} />
        ))}
      </div>
    </div>
  );
}