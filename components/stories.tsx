import { Button } from "./ui/button";

export default function Stories() {
  return (
    <div className="w-full px-3 py-3 mx-auto bg-accent-foreground/80 backdrop-blur-md rounded-lg">
      <div className="max-w-screen-md mx-auto overflow-x-scroll no-scrollbar snap-x snap-mandatory">
        <div className="flex gap-4 w-max px-1">
          {/* Add Story Button */}
          <div className="flex flex-col items-center gap-1 snap-center">
            <Button
              variant="outline"
              className="w-16 h-16 rounded-full border-2 border-primary bg-muted shrink-0 hover:bg-primary/10"
            >
              +
            </Button>
            <p className="text-xs text-muted-foreground truncate w-16 text-center">
              Add Story
            </p>
          </div>

          {/* Story Circles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 snap-center"
            >
              <div className="w-16 h-16 rounded-full border-2 border-primary bg-muted shrink-0 cursor-pointer hover:border-primary/80 transition-colors" />
              <p className="text-xs text-muted-foreground truncate w-16 text-center">
                user_{i + 1}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

