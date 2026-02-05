import { useState, useEffect } from "react";
import { FeedPost } from "@/types/post";

interface AdResponse {
  _id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  targetUrl: string;
  type?: "image" | "video";
}

export function useAds() {
  const [ads, setAds] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/ads/targeted");
        if (response.ok) {
          const data = await response.json();
          // Map ads to FeedPost structure
          const formattedAds: FeedPost[] = (Array.isArray(data) ? data : data.data || []).map((ad: any) => ({
            _id: ad._id,
            text: ad.content || ad.title,
            mediaUrl: ad.mediaUrl,
            media: ad.mediaUrl ? [ad.mediaUrl] : [],
            type: ad.type || (ad.mediaUrl?.match(/\.(mp4|webm|mov)$/i) ? "video" : "image"),
            user: {
              _id: "sponsored",
              name: ad.title || "Sponsored",
              username: "sponsored",
              profilePicture: "/images/sponsored-avatar.png", // Placeholder
              blueTick: false,
              goldenTick: false,
            },
            likesCount: 0,
            commentsCount: 0,
            bookmarksCount: 0,
            views: 0,
            engagement: {
              totalShares: 0,
              totalComments: 0,
              totalLikes: 0,
              engagementRate: 0,
            },
            privacy: {
              level: "public",
              selectedUsers: [],
              updatedAt: new Date().toISOString(),
              updateHistory: [],
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isAd: true,
            targetUrl: ad.targetUrl,
            ad: {
              isPromoted: true,
              budget: 0,
              target: "",
              startDate: null,
              endDate: null,
            },
            comments: [],
            likes: [],
            bookmarks: [],
            reposts: [],
            originalPost: null,
            uniqueViewers: [],
            transferHistory: [],
            isEligibleForNFT: false,
            nftMinted: false,
            isListedForSale: false,
            __v: 0,
          }));
          setAds(formattedAds);
        }
      } catch (error) {
        console.error("Failed to fetch ads:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, []);

  return { ads, isLoading };
}
