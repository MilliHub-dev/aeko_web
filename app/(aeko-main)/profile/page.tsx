import { getProfile } from "@/lib/get-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LayoutGrid, Bookmark, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function ProfilePage() {
  const user = await getProfile();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Failed to load profile</p>
      </div>
    );
  }

  // Mock posts for grid
  const posts = [
    { id: 1, image: "/users/sarah-johnson.jpeg" },
    { id: 2, image: "/users/mike-chen.jpg" },
    { id: 3, image: "/users/alex-rivera.jpg" },
    { id: 4, image: "/users/sarah-johnson.jpeg" },
    { id: 5, image: "/users/mike-chen.jpg" },
    { id: 6, image: "/users/alex-rivera.jpg" },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0 bg-background">
      {/* Header / Cover */}
      <div className="relative h-48 md:h-64 w-full">
        <Image
          src="/cover.png" // You might want to add a real placeholder image to public/users/
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-4 left-4 z-10 md:hidden">
          <Link
            href="/home"
            className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white inline-flex">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </div>
      </div>

      <div className="px-4 relative">
        {/* Profile Info Header - Centered */}
        <div className="flex flex-col items-center -mt-16 mb-6">
          <Avatar className="h-32 w-32 border-4 border-background shadow-sm">
            <AvatarImage
              src={user.profilePicture}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="text-4xl">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="mt-3 text-center space-y-1">
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            {user.bio && (
              <p className="text-sm text-muted-foreground max-w-xs mx-auto text-center leading-relaxed">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Stats - Centered Row */}
        <div className="flex justify-center items-center gap-12 mb-8">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-foreground">
              {user.posts.length}
            </span>
            <span className="text-sm text-muted-foreground">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-foreground">
              {user.followers.length}
            </span>
            <span className="text-sm text-muted-foreground">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-foreground">
              {user.following.length}
            </span>
            <span className="text-sm text-muted-foreground">Following</span>
          </div>
        </div>
      </div>

      {/* Tabs with Icons */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="w-full flex h-12 p-0 bg-transparent border-b border-border/40">
          <TabsTrigger
            value="grid"
            className="flex-1 h-full bg-none rounded-none border-0 data-[state=active]:border-primary-foreground data-[state=active]:border-b-2 data-[state=active]:shadow-none">
            <LayoutGrid className="h-6 w-6" />
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="flex-1 h-full bg-none rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:shadow-none">
            <Bookmark className="h-6 w-6" />
          </TabsTrigger>
          <TabsTrigger
            value="likes"
            className="flex-1 h-full bg-none rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:shadow-none">
            <Heart className="h-6 w-6" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-0">
          {user.posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-0.5 md:gap-4 md:p-4">
              {user.posts.map((post) => (
                <div
                  key={post._id}
                  className="relative aspect-4/5 bg-muted overflow-hidden">
                  <Image
                    src={post.media || ""}
                    alt={`Post ${post._id}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground p-8">
              <div className="p-4 bg-muted rounded-full">
                <LayoutGrid className="h-8 w-8" />
              </div>
              <p>No posts yet. Share your first moment!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-0 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
            <div className="p-4 bg-muted rounded-full">
              <Bookmark className="h-8 w-8" />
            </div>
            <p>Save posts to view them later</p>
          </div>
        </TabsContent>

        <TabsContent value="likes" className="mt-0 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
            <div className="p-4 bg-muted rounded-full">
              <Heart className="h-8 w-8" />
            </div>
            <p>Posts you like will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
