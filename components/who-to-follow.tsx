import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

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
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Amilia Gonzales",
      username: "@amilia7781_y",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Kim Chiushu",
      username: "@kim_from_theworld",
      avatar: "/placeholder.svg"
    }
  ];


  return (
    <div className="bg-primary/20 dark:bg-gray-900/50 rounded-2xl p-4 space-y-4">
      {/* Header */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        Who to follow
      </h3>

      {/* User Suggestions */}
      <div className="space-y-3">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gray-300 text-gray-600">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 w-[80px]">
                <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {user.name}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm truncate">
                  {user.username}
                </div>
              </div>
            </div>
            <Button
              // onClick={() => handleFollow(user.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium text-sm"
            >
              Follow
            </Button>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      <Button 
        variant="ghost" 
        className="text-blue-500 hover:text-blue-600 font-medium p-0 h-auto w-full justify-start"
      >
        + Show More
      </Button>
    </div>
  );
};

export { WhoToFollow };