import { Post } from "@/components/post";

export default function Home() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((item) => (
        <Post key={item} />
      ))}
    </>
  );
}
