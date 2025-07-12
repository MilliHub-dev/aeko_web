import { Mic, Smile } from "lucide-react";
import { Button } from "./ui/button";

const CreatePost = () => {
  return (
    <div className="w-full border border-border dark:border-border/30 mx-auto p-4 rounded-2xl transition-all">
      <div className="flex items-center gap-3">
        {/* Paperclip Icon */}
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </div>
        
        {/* Input Field */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="What's on your mind right now?"
            className="w-full bg-transparent border-none focus:outline-none text-base placeholder:text-muted-foreground"
          />
        </div>
        
        {/* Right Side Icons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted w-10 h-10"
          >
            <Smile className="w-5 h-5 text-primary" strokeWidth={1.5}/>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted w-10 h-10"
          >
            <Mic className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </Button>
          
          <Button
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 font-medium"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}

export { CreatePost }