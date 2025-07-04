import { Star, Flame as Fire } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

export default function RightSidebar() {
  return (
    <div className="hidden xl:flex flex-col fixed right-[max(0px,calc(42%-640px))] w-[320px] h-screen glass justify-start">
      {/* Trending Hashtags - Fixed Height */}
        <div className="p-6 pb-4">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Fire className="w-5 h-5 text-aeko-primary" />
            Trending Now
          </h3>
          <div className="space-y-3">
            {[
              { tag: "#BitcoinETF", posts: "2.3M posts", trend: "+125%" },
              { tag: "#DeFiSummer", posts: "890K posts", trend: "+89%" },
              { tag: "#NFTDrop", posts: "1.2M posts", trend: "+67%" },
              { tag: "#Web3Gaming", posts: "456K posts", trend: "+234%" },
              { tag: "#CryptoNews", posts: "3.1M posts", trend: "+45%" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 bg-gray-100 dark:bg-white/5 backdrop-blur-sm rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer transition-colors relative border border-gray-200 dark:border-transparent"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-aeko-light-purple/5 to-transparent rounded-lg"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-aeko-primary">
                      {item.tag}
                    </span>
                    <Badge className="bg-green-500/20 text-green-400 text-xs">
                      {item.trend}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.posts}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

    </div>
  );
}