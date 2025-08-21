import { Button } from "@/components/ui/button";

interface PostHeaderProps {
  tag: string | undefined;
  className?: string;
  dropDownBackground?:
    | "bg-black/30 backdrop-blur-sm"
    | "bg-none"
    | "bg-secondary"
    | "bg-primary";
  tagText?: "text-white" | "text-primary";
}

const PostHeader = ({
  tag,
  className = "",
  dropDownBackground = "bg-black/30 backdrop-blur-sm",
  tagText = "text-white",
}: PostHeaderProps) => (
  <div className={`flex items-center justify-between ${className}`}>
    <div
      className={`flex items-center space-x-3 rounded-full px-2.5 py-1.75 w-[206px] h-13`}
    >
      <div className="flex flex-col">
        <span className={`${tagText} font-semibold text-lg`}>{tag}</span>
      </div>
    </div>

    <Button
      className={`w-25 flex items-center justify-center ${dropDownBackground} cursor-pointer text-secondary`}
    >
      Follow
    </Button>
  </div>
);

export { PostHeader };
