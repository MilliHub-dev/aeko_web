// components/Post/Post.tsx
"use client";

import { PostHeader } from "./card-header";
import { PostFooter } from "./card-footer";
import { CardImage } from "./card-image";
import { OverlayProvider } from "@/contexts/OverlayContext";

export type PostType = "text" | "image" | "video";

export interface PostProps {
  tag?: string;
  backgroundImage?: string;
}

const Card = ({
  tag = "Faith",
  backgroundImage = "/profile.jpeg",
}: PostProps) => {
  return (
    <div className="relative flex-1 w-full max-w-md md:max-w-lg lg:max-w-2xl mx-auto aspect-square rounded-4xl overflow-hidden">
      <OverlayProvider>
        <CardImage
          backgroundImage={backgroundImage}
          header={<PostHeader tag={tag} dropDownBackground="bg-primary" />}
          footer={<PostFooter />}
        />
      </OverlayProvider>
    </div>
  );
};

export { Card };
