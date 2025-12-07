// Livestream Types
export interface LivestreamCreateData {
  title: string;
  description: string;
  category: string;
  streamType: string;
  features: Record<string, unknown>;
  quality: Record<string, unknown>;
  tags: string[];
  scheduledFor: string; // ISO date string
  monetization: Record<string, unknown>;
}

export interface LivestreamResponse {
  success: boolean;
  livestream: {
    _id: string;
    title: string;
    description: string;
    category: string;
    streamType: string;
    status: "created" | "live" | "ended";
    viewerCount?: number;
    thumbnailUrl?: string;
    streamUrl?: string;
    createdAt: string;
  };
  message?: string;
}

export interface MediaDeviceOption {
  deviceId: string;
  label: string;
  kind: "videoinput" | "audioinput";
}
