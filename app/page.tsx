import { Post } from "@/components/post";

export default function Home() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5].map((item) => (
        <Post key={item} />
      ))}
    </div>
  );
}
