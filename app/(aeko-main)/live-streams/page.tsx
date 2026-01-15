"use client";

import { useState } from "react";
import { LiveStreamSetup } from "@/components/live-streams/live-stream-setup";
import { LiveStreamBroadcast } from "@/components/live-streams/live-stream-broadcast";
import { useCamera } from "@/hooks/use-camera";
import type { LivestreamCreateData } from "@/types/livestream";

type BroadcastState = "setup" | "ready" | "live" | "ended";

export default function BroadcastPage() {
  const [state, setState] = useState<BroadcastState>("setup");
  const [streamId, setStreamId] = useState<string | null>(null);
  const [streamData, setStreamData] = useState<LivestreamCreateData | null>(
    null
  );

  const camera = useCamera({
    onError: (error) => {
      console.error("Camera error:", error);
    },
  });

  const handleStreamCreated = (id: string, data: LivestreamCreateData) => {
    setStreamId(id);
    setStreamData(data);
    setState("ready");
  };

  const handleGoLive = () => {
    setState("live");
  };

  const handleEndStream = () => {
    setState("ended");
    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = "/home";
    }, 2000);
  };

  const handleBack = () => {
    setState("setup");
    setStreamId(null);
    setStreamData(null);
  };

  // Setup state - create and configure livestream
  if (state === "setup") {
    return (
      <LiveStreamSetup camera={camera} onStreamCreated={handleStreamCreated} />
    );
  }

  // Ready state - preview before going live
  if (state === "ready" && streamId) {
    return (
      <LiveStreamBroadcast
        streamId={streamId}
        camera={camera}
        streamData={streamData}
        onGoLive={handleGoLive}
        onBack={handleBack}
        isLive={false}
      />
    );
  }

  // Live state - broadcasting
  if (state === "live" && streamId) {
    return (
      <LiveStreamBroadcast
        streamId={streamId}
        camera={camera}
        streamData={streamData}
        onEndStream={handleEndStream}
        isLive={true}
      />
    );
  }

  // Ended state
  if (state === "ended") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground">
            Stream Ended
          </h2>
          <p className="mt-2 text-muted-foreground">
            Redirecting to live streams...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
