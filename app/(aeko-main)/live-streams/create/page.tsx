"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCamera } from "@/hooks/use-camera";
import { LiveStreamSetup } from "@/components/live-streams/live-stream-setup";
import { LiveStreamBroadcast } from "@/components/live-streams/live-stream-broadcast";
import { Loader2 } from "lucide-react";
import type { LivestreamCreateData } from "@/types/livestream";

export default function CreateLiveStreamPage() {
  const router = useRouter();
  const camera = useCamera({
    onError: (error) => {
      console.error("Camera error:", error);
      // You might want to show a toast or error message here
    },
  });

  const [step, setStep] = useState<"setup" | "broadcast">("setup");
  const [streamId, setStreamId] = useState<string | null>(null);
  const [streamData, setStreamData] = useState<LivestreamCreateData | null>(null);

  // Request camera access on mount
  useEffect(() => {
    camera.requestMediaAccess();
    // Cleanup handled by hook
  }, []);

  const handleStreamCreated = (id: string, data: LivestreamCreateData) => {
    setStreamId(id);
    setStreamData(data);
    setStep("broadcast");
  };

  const handleEndStream = () => {
    router.push("/live-streams");
  };

  if (camera.isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Initializing camera...</span>
      </div>
    );
  }

  if (camera.hasPermission === false) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 p-4 text-center">
        <h2 className="text-xl font-semibold">Camera Access Required</h2>
        <p className="max-w-md text-muted-foreground">
          Please allow camera and microphone access to start a live stream. 
          Check your browser settings if the prompt doesn't appear.
        </p>
        <button 
          onClick={() => camera.requestMediaAccess()}
          className="rounded-full bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4">
      {step === "setup" ? (
        <LiveStreamSetup 
          camera={camera} 
          onStreamCreated={handleStreamCreated} 
        />
      ) : (
        streamId && (
          <LiveStreamBroadcast
            streamId={streamId}
            camera={camera}
            streamData={streamData}
            isLive={true} // In a real app, this might start as false until "Go Live" is clicked inside broadcast
            onEndStream={handleEndStream}
            onBack={() => setStep("setup")}
          />
        )
      )}
    </div>
  );
}
