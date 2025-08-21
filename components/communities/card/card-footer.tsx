import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ExploreItem {
  id: number;
  title: string;
  category: string;
  timeAgo: string;
  avatars: string[];
}

const exploreItems: ExploreItem[] = [
  {
    id: 1,
    title: "Biden: Truth Over Smooth Speeches",
    category: "Politics",
    timeAgo: "Trending Now",
    avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  },
];

const PostFooter = () => (
  <div className="space-y-4">
    <div className="space-y-6">
      {exploreItems.map((item) => (
        <div key={item.id} className="group cursor-pointer">
          <h3 className="text-white font-semibold text-base leading-tight mb-3">
            {item.title}
          </h3>

          <div className="flex items-center justify-between text-primary">
            <div className="flex items-center space-x-2">
              {/* Avatar Stack */}
              <div className="flex -space-x-2">
                {item.avatars.slice(0, 3).map((avatar, index) => (
                  <Avatar
                    key={index}
                    className="size-8 border-2 border-white dark:border-gray-800"
                  >
                    <AvatarImage src={avatar} />
                    <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                      {index + 1}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>

              <div className="flex items-center space-x-1 text-sm text-blue-gem-200 dark:text-green-yellow-300">
                <span>{item.timeAgo}</span>
                <span>•</span>
                <span>{item.category}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export { PostFooter };
