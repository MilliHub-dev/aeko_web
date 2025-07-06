import { Image as ImageIcon, Link2, MapPin, Smile, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function CreatePost() {
  return (
    <div className="w-full bg-accent-foreground/80 backdrop-blur-md  mx-auto p-4 space-y-4 rounded-2xl">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder.svg" alt="user-profile" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-4">
          <textarea
            placeholder="What's happening?"
            className="w-full min-h-[60px] bg-transparent border-none focus:outline-none text-lg resize-none"
          />
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10 hover:text-primary"
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10 hover:text-primary"
            >
              <Video className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10 hover:text-primary"
            >
              <Link2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10 hover:text-primary"
            >
              <MapPin className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10 hover:text-primary"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <Button
          className="bg-primary hover:bg-primary/90 text-white rounded-full px-6"
        >
          Post
        </Button>
      </div>
    </div>
  );
}