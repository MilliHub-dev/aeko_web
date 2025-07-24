import { CreatePost } from "@/components/home/create-post";
import { Post } from "@/components/home/post";
import { Stories } from "@/components/home/stories";


export default function Home() {
  return (
    <div className="py-20 md:py-8">
      <Stories />
      <div className="max-w-2xl mx-auto px-4 md:px-2 snap-y snap-mandatory space-y-5 py-5">
        <CreatePost />
        <div className="space-y-6 ">
          {[1, 2, 3, 4, 5].map((item) => (
            <Post key={item} />
          ))}
        </div>
      </div>
    </div>
  );
}


