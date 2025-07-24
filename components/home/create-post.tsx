import { LucidePaperclip, Mic, Smile } from "lucide-react";
import { Button } from "../ui/button";

const CreatePost = () => {
  return (
    <div className="w-full border border-border dark:border-border/30 mx-auto p-4 rounded-2xl transition-all">
      <div className="flex items-center gap-3">
        {/* Paperclip Icon */}
        <div className="flex-shrink-0">
          <LucidePaperclip className="w-5 h-5 text-primary" strokeWidth={1}/>
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
            <Smile className="w-5 h-5 text-primary" strokeWidth={1}/>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted w-10 h-10"
          >
            <Mic className="w-5 h-5 text-primary" strokeWidth={1} />
          </Button>
          
          <Button
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 font-medium"
            variant={"outline"}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}

export { CreatePost }