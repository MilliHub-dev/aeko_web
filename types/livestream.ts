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
  chatId?: string;
  hostName?: string;
  hostProfilePicture?: string;
}

export interface LivestreamResponse {
  success: boolean;
  message?: string;
  data?: {
    streamId?: string;
    _id?: string;
    stream?: {
      id?: string;
      _id?: string;
      title: string;
      description: string;
      category: string;
      streamType: string;
      status: "scheduled" | "created" | "live" | "ended";
      viewerCount?: number;
      thumbnailUrl?: string;
      streamUrl?: string;
      createdAt: string;
    };
  };
  livestream?: {
    _id?: string;
    id?: string;
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
}

export interface MediaDeviceOption {
  deviceId: string;
  label: string;
  kind: "videoinput" | "audioinput";
}
