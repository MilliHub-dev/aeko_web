"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCamera } from "@/hooks/use-camera";
import { LiveStreamSetup } from "@/components/live-streams/live-stream-setup";
import { LiveStreamBroadcast } from "@/components/live-streams/live-stream-broadcast";
import { Loader2, Sparkles } from "lucide-react";
import type { LivestreamCreateData } from "@/types/livestream";

export default function CreateLiveStreamPage() {
  const router = useRouter();
  const camera = useCamera({
    onError: (error) => {
      console.error("Camera error:", error);
      // You might want to show a toast or error message here
    },
  });

  const [step, setStep] = useState<"setup" | "ready" | "live">("setup");
  const [streamId, setStreamId] = useState<string | null>(null);
  const [streamData, setStreamData] = useState<LivestreamCreateData | null>(null);

  const handleStreamCreated = (id: string, data: LivestreamCreateData) => {
    setStreamId(id);
    setStreamData(data);
    setStep("ready");
  };

  const handleEndStream = () => {
    router.push("/live-streams");
  };

  const handleGoLive = () => {
    setStep("live");
  };

  if (camera.isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="rounded-[32px] border border-border/60 bg-card/70 px-8 py-10 text-center shadow-sm">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <span className="mt-4 block text-muted-foreground">Initializing camera...</span>
        </div>
      </div>
    );
  }

  if (camera.hasPermission === false) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4 text-center">
        <div className="max-w-lg rounded-[32px] border border-border/60 bg-card/70 px-8 py-10 shadow-sm">
          <h2 className="text-xl font-semibold">Camera Access Required</h2>
          <p className="mt-3 text-muted-foreground">
            Please allow camera and microphone access to start a live stream.
            Check your browser settings if the prompt does not appear.
          </p>
          <button
            onClick={() => camera.requestMediaAccess()}
            className="mt-6 rounded-full bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-x-hidden p-3 sm:p-4">
      {step === "setup" && (
        <div className="mx-auto mb-4 flex w-full max-w-6xl flex-col items-start gap-3 rounded-[28px] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,247,0.92))] px-4 py-4 shadow-sm sm:px-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Broadcast Setup
            </div>
            <h1 className="text-xl font-semibold text-foreground md:text-2xl">
              Create a live stream
            </h1>
          </div>
        </div>
      )}
      {step === "setup" ? (
        <LiveStreamSetup 
          camera={camera} 
          onStreamCreated={handleStreamCreated} 
        />
      ) : step === "ready" ? (
        streamId && (
          <LiveStreamBroadcast
            streamId={streamId}
            camera={camera}
            streamData={streamData}
            isLive={false}
            onGoLive={handleGoLive}
            onBack={() => setStep("setup")}
          />
        )
      ) : (
        streamId && (
          <LiveStreamBroadcast
            streamId={streamId}
            camera={camera}
            streamData={streamData}
            isLive={true}
            onEndStream={handleEndStream}
          />
        )
      )}
    </div>
  );
}
