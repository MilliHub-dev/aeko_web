import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useFollowUser } from "@/features/profile/hooks/use-follow-user";
import { useSuggestedUsers } from "@/features/explore/hooks/use-suggested-users";
import { SuggestedUser } from "@/types/explore";

const WhoToFollow = () => {
  const { users: suggestedUsers, isLoading } = useSuggestedUsers();

  if (isLoading) {
    return (
      <Card className="space-y-2 px-4 border border-primary text-black py-4">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold">Who to follow</h3>
        </div>
        <div className="space-y-3 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (suggestedUsers.length === 0) return null;

  return (
    <Card className="space-y-2 px-4 border border-primary text-black">
      {/* Header */}
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">Who to follow</h3>
        <p className="text-xl text-primary">See more</p>
      </div>

      {/* User Suggestions */}
      <div className="space-y-3">
        {suggestedUsers.slice(0, 5).map((user) => (
          <UserItem key={user._id} user={user} />
        ))}
      </div>

      {/* Show More Button */}
      <Link
        href={"/explore"}
        className="text-foreground font-medium p-0 h-auto w-full justify-start"
      >
        + Show More
      </Link>
    </Card>
  );
};

function UserItem({ user }: { user: SuggestedUser }) {
  const { isFollowing, toggleFollow, isLoading } = useFollowUser(
    user._id,
    user.isFollowing
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10 aspect-square outline-2 outline-offset-2 outline-normal-active">
          <AvatarImage src={user.profilePicture || "/placeholder.svg"} />
          <AvatarFallback className="bg-gray-300 text-gray-600">
            <Image
              src="/profile_icon.jpg"
              alt="Profile"
              fill
              className="object-cover"
            />
          </AvatarFallback>
        </Avatar>

        <div className="flex-2 w-[80px]">
          <div className="font-semibold text-sm truncate">{user.name}</div>
          <div className="text-primary text-sm truncate">@{user.username}</div>
        </div>
      </div>
      <Button
        onClick={toggleFollow}
        disabled={isLoading}
        variant={isFollowing ? "outline" : "ghost"}
        className={`rounded-full w-25 ${
          isFollowing
            ? "text-primary border-primary"
            : "text-secondary bg-primary hover:bg-normal-hover hover:text-secondary"
        }`}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
}

export { WhoToFollow };
