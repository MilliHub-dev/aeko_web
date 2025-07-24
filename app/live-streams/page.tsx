import { LiveStreamContent } from "@/components/live-streams/live-stream-content";

export default function LiveStreamsPage() {
  return (
    <div className="space-y-6 px-4">
      <h1 className="text-2xl font-bold text-blue-gem-50 dark:text-green-yellow-300 mb-6">
        Live Streams
      </h1>
      <LiveStreamContent />
    </div>
  );
}