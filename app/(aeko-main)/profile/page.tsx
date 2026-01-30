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

  return (
    <div className="flex flex-col min-h-screen -mt-24 pb-20 md:pb-0 md:mt-0 bg-background">
      {/* Header / Cover */}
      <div className="relative h-60 md:h-64 w-full">
        <Image
          src="/cover.png" // You might want to add a real placeholder image to public/users/
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
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
              <Image
                src="/profile_icon.jpg"
                alt="Profile"
                fill
                className="object-cover"
              />
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
              {user.posts?.length || 0}
            </span>
            <span className="text-sm text-muted-foreground">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-foreground">
              {user.followers?.length || 0}
            </span>
            <span className="text-sm text-muted-foreground">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-foreground">
              {user.following?.length || 0}
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
          {user.posts?.length > 0 ? (
            <div className="grid grid-cols-3 gap-0.5 md:gap-4 md:p-4">
              {user.posts.map((post) => {
                const getMediaSource = () => {
                  if (post.mediaUrls && post.mediaUrls.length > 0) return post.mediaUrls[0];
                  if (Array.isArray(post.media) && post.media.length > 0) return post.media[0];
                  if (typeof post.media === 'string') return post.media;
                  return post.mediaUrl;
                };
                const mediaUrl = getMediaSource();
                const isVideo = mediaUrl?.endsWith(".mp4") || mediaUrl?.endsWith(".webm") || mediaUrl?.endsWith(".mov") || post.type === "video";

                return (
                  <div
                    key={post._id}
                    className="relative aspect-4/5 bg-muted overflow-hidden group">
                    {mediaUrl && (
                      isVideo ? (
                        <div className="w-full h-full relative">
                          <video 
                            src={mediaUrl} 
                            className="w-full h-full object-cover" 
                            muted 
                            loop
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={mediaUrl}
                          alt={`Post ${post._id}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      )
                    )}
                  </div>
                );
              })}
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
