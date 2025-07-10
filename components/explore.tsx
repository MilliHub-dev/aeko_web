import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface ExploreItem {
  id: number;
  title: string;
  category: string;
  timeAgo: string;
  avatars: string[];
}

const Explore = () => {
  const exploreItems: ExploreItem[] = [
    {
      id: 1,
      title: "Biden: Truth Over Smooth Speeches",
      category: "Politics",
      timeAgo: "Trending Now",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
    },
    {
      id: 2,
      title: "NY Times Editorial Board Weighs in on Biden's 2024 Chances",
      category: "Politics",
      timeAgo: "Trending Now",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
    },
    {
      id: 3,
      title: "Trump's 30+ False Claims Ignite Debate Critique",
      category: "Politics",
      timeAgo: "Trending Now",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
    },
    {
      id: 4,
      title: "Calls to 25th Amendment Biden Removal Grow",
      category: "Politics",
      timeAgo: "Trending Now",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Explore Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary dark:text-white">
          Explore
        </h2>
        
      </div>

      {/* Trending Articles */}
      <div className="space-y-6">
        {exploreItems.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <h3 className="text-prigray dark:text-white font-semibold text-base leading-tight mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {item.title}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Avatar Stack */}
                <div className="flex -space-x-2">
                  {item.avatars.slice(0, 3).map((avatar, index) => (
                    <Avatar key={index} className="w-6 h-6 border-2 border-white dark:border-gray-800">
                      <AvatarImage src={avatar} />
                      <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                        {index + 1}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                  <span>{item.timeAgo}</span>
                  <span>•</span>
                  <span>{item.category}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      <Link
        href={"#"}
        className="text-gray-600 cursor-pointer"
      >
        + Show More
      </Link>
    </div>
  );
};

export { Explore }; 