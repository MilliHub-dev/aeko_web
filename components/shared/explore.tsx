import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";

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
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    },
    {
      id: 2,
      title: "NY Times Editorial Board Weighs in on Biden's 2024 Chances",
      category: "Politics",
      timeAgo: "Trending Now",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    },
    {
      id: 3,
      title: "Trump's 30+ False Claims Ignite Debate Critique",
      category: "Politics",
      timeAgo: "Trending Now",
      avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    },
  ];

  return (
    <Card className="space-y-2 px-4 border border-primary text-black">
      {/* Explore Header */}
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">Explore</h3>
        <p className="text-xl text-primary">See more</p>
      </div>

      {/* Trending Articles */}
      <div className="space-y-6">
        {exploreItems.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <h3 className="text-blue-gem-50 dark:text-green-yellow-100 font-semibold text-base leading-tight mb-3">
              {item.title}
            </h3>

            <div className="flex items-center justify-between text-primary">
              <div className="flex items-center space-x-2">
                {/* Avatar Stack */}
                <div className="flex -space-x-2">
                  {item.avatars.slice(0, 3).map((avatar, index) => (
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

      {/* Show More Button */}
      <Link
        href={"#"}
        className="text-blue-gem-50 dark:text-green-yellow-100 cursor-pointer"
      >
        + Show More
      </Link>
    </Card>
  );
};

export { Explore };
