import React, { useEffect, useRef } from "react";
import { useCallStore } from "@/features/chat/stores/call-store";
import { useWebRTC } from "@/hooks/use-web-rtc";
import { 
  Phone, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  X,
  Maximize2,
  Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CallOverlay() {
  const { 
    status, 
    type, 
    callerId, 
    receiverId, 
    localStream, 
    remoteStream, 
    isMuted, 
    isVideoEnabled,
    endCall,
    toggleMute,
    toggleVideo
  } = useCallStore();

  const { acceptIncomingCall, terminateCall } = useWebRTC();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [otherUser, setOtherUser] = React.useState<{ name: string; avatar: string } | null>(null);

  useEffect(() => {
    const targetId = callerId || receiverId;
    if (!targetId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${targetId}`);
        if (res.ok) {
          const data = await res.json();
          // Handle different response structures based on inspection of other hooks
          const user = data.user || data.data;
          if (user) {
             setOtherUser({
               name: user.name || "Unknown User",
               avatar: user.profilePicture || user.avatar || ""
             });
          }
        }
      } catch (e) {
        console.error("Failed to fetch call user", e);
      }
    };
    fetchUser();
  }, [callerId, receiverId]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (status === "idle") return null;

  const isVideoCall = type === "video";
  const isIncoming = status === "incoming";
  const isConnected = status === "connected";

  return (
    <div className={cn(
      "fixed z-[100] transition-all duration-300 shadow-2xl rounded-xl overflow-hidden bg-background border border-border",
      isMinimized 
        ? "bottom-4 right-4 w-64 h-auto" 
        : "inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[800px] md:h-[600px] w-full h-full"
    )}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent text-white">
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            {isIncoming ? "Incoming Call..." : status === "calling" ? "Calling..." : "Connected"}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/20 rounded-full">
            {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
        {isConnected && isVideoCall ? (
          <>
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-4 right-4 w-32 h-48 bg-black rounded-lg overflow-hidden border-2 border-white shadow-lg">
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover" 
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24 border-4 border-white/10">
              <AvatarImage src={otherUser?.avatar || ""} />
              <AvatarFallback className="text-2xl text-black">
                {otherUser?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold text-white">
              {otherUser?.name || callerId || receiverId}
            </h2>
            <p className="text-white/60 capitalize">{type} Call</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center gap-6 z-20">
        {isIncoming ? (
          <>
             <button 
              onClick={terminateCall}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              <PhoneOff size={28} />
            </button>
            <button 
              onClick={acceptIncomingCall}
              className="p-4 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors animate-pulse"
            >
              <Phone size={28} />
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={toggleMute}
              className={cn(
                "p-3 rounded-full transition-colors",
                isMuted ? "bg-white text-black" : "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            
            {isVideoCall && (
              <button 
                onClick={toggleVideo}
                className={cn(
                  "p-3 rounded-full transition-colors",
                  !isVideoEnabled ? "bg-white text-black" : "bg-white/20 text-white hover:bg-white/30"
                )}
              >
                {!isVideoEnabled ? <VideoOff size={24} /> : <Video size={24} />}
              </button>
            )}

            <button 
              onClick={terminateCall}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              <PhoneOff size={28} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
