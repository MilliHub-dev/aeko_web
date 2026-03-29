import { create } from "zustand";

export type CallStatus = "idle" | "calling" | "incoming" | "connected" | "ended";
export type CallType = "voice" | "video";

interface CallState {
  status: CallStatus;
  type: CallType | null;
  callerId: string | null;
  receiverId: string | null;
  callerUserId: string | null;
  receiverUserId: string | null;
  remoteStream: MediaStream | null;
  localStream: MediaStream | null;
  isMuted: boolean;
  isVideoEnabled: boolean;
  startTime: number | null;
  
  // Actions
  startCall: (receiverId: string, type: CallType, receiverUserId?: string | null) => void;
  setIncomingCall: (callerId: string, type: CallType, callerUserId?: string | null) => void;
  acceptCall: () => void;
  endCall: () => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  setStatus: (status: CallStatus) => void;
  setType: (type: CallType | null) => void;
}

export const useCallStore = create<CallState>((set) => ({
  status: "idle",
  type: null,
  callerId: null,
  receiverId: null,
  callerUserId: null,
  receiverUserId: null,
  remoteStream: null,
  localStream: null,
  isMuted: false,
  isVideoEnabled: true,
  startTime: null,

  startCall: (receiverId, type, receiverUserId) => set({ 
    status: "calling", 
    type, 
    receiverId, 
    receiverUserId: receiverUserId || null,
    callerId: null, // I am the caller
    callerUserId: null,
    isMuted: false,
    isVideoEnabled: type === "video"
  }),

  setIncomingCall: (callerId, type, callerUserId) => set({ 
    status: "incoming", 
    type, 
    callerId,
    callerUserId: callerUserId || null,
    receiverId: null, // I am the receiver
    receiverUserId: null,
    isMuted: false,
    isVideoEnabled: type === "video"
  }),

  acceptCall: () => set({ status: "connected", startTime: Date.now() }),

  endCall: () => {
    // Cleanup streams
    set((state) => {
      if (state.localStream) {
        state.localStream.getTracks().forEach(track => track.stop());
      }
      return { 
        status: "idle", 
        type: null, 
        callerId: null, 
        receiverId: null, 
        callerUserId: null,
        receiverUserId: null,
        remoteStream: null, 
        localStream: null,
        startTime: null
      };
    });
  },

  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),

  toggleMute: () => set((state) => {
    const newIsMuted = !state.isMuted;
    if (state.localStream) {
      state.localStream.getAudioTracks().forEach(track => {
        track.enabled = !newIsMuted;
      });
    }
    return { isMuted: newIsMuted };
  }),

  toggleVideo: () => set((state) => {
    if (state.localStream) {
      state.localStream.getVideoTracks().forEach(track => {
        track.enabled = !state.isVideoEnabled;
      });
    }
    return { isVideoEnabled: !state.isVideoEnabled };
  }),
  
  setStatus: (status) => set((state) => ({ 
    status,
    startTime: status === "connected" && !state.startTime ? Date.now() : state.startTime
  })),

  setType: (type) => set({ type })
}));
