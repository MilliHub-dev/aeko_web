import { SoundPage } from "@/components/sound/sound-page";

export default async function SoundRoute({ params }: { params: Promise<{ soundId: string }> }) {
  const { soundId } = await params;
  return <SoundPage soundId={soundId} />;
}
