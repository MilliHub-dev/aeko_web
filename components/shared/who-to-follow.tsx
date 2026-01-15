import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

const WhoToFollow = () => {
  const suggestedUsers: User[] = [
    {
      id: 1,
      name: "Dan Miluanton",
      username: "@buildwithdan88",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Amilia Gonzales",
      username: "@amilia7781_y",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Kim Chiushu",
      username: "@kim_from_theworld",
      avatar: "/placeholder.svg",
    },
  ];

  return (
    <Card className="space-y-2 px-4 border border-primary text-black">
      {/* Header */}
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">Who to follow</h3>
        <p className="text-xl text-primary">See more</p>
      </div>

      {/* User Suggestions */}
      <div className="space-y-3">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 aspect-square outline-2 outline-offset-2 outline-normal-active">
                <AvatarImage src="/profile.jpeg" />
                <AvatarFallback className="bg-gray-300 text-gray-600">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-2 w-[80px]">
                <div className="font-semibold text-sm truncate">
                  {user.name}
                </div>
                <div className="text-primary text-sm truncate">
                  {user.username}
                </div>
              </div>
            </div>
            <Button
              // onClick={() => handleFollow(user.id)}
              variant={"ghost"}
              className="text-secondary bg-primary hover:bg-normal-hover hover:text-secondary rounded-full w-25"
            >
              Follow
            </Button>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      <Link
        href={"#"}
        className="text-foreground font-medium p-0 h-auto w-full justify-start"
      >
        + Show More
      </Link>
    </Card>
  );
};

export { WhoToFollow };
