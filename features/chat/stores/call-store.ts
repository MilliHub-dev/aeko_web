import { create } from "zustand";

export type CallStatus = "idle" | "calling" | "incoming" | "connected" | "ended";
export type CallType = "voice" | "video";

interface CallState {
  status: CallStatus;
  type: CallType | null;
  callerId: string | null;
  receiverId: string | null;
  remoteStream: MediaStream | null;
  localStream: MediaStream | null;
  isMuted: boolean;
  isVideoEnabled: boolean;
  
  // Actions
  startCall: (receiverId: string, type: CallType) => void;
  setIncomingCall: (callerId: string, type: CallType) => void;
  acceptCall: () => void;
  endCall: () => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  setStatus: (status: CallStatus) => void;
}

export const useCallStore = create<CallState>((set) => ({
  status: "idle",
  type: null,
  callerId: null,
  receiverId: null,
  remoteStream: null,
  localStream: null,
  isMuted: false,
  isVideoEnabled: true,

  startCall: (receiverId, type) => set({ 
    status: "calling", 
    type, 
    receiverId, 
    callerId: null, // I am the caller
    isMuted: false,
    isVideoEnabled: type === "video"
  }),

  setIncomingCall: (callerId, type) => set({ 
    status: "incoming", 
    type, 
    callerId,
    receiverId: null, // I am the receiver
    isMuted: false,
    isVideoEnabled: type === "video"
  }),

  acceptCall: () => set({ status: "connected" }),

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
        remoteStream: null, 
        localStream: null 
      };
    });
  },

  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),

  toggleMute: () => set((state) => {
    if (state.localStream) {
      state.localStream.getAudioTracks().forEach(track => {
        track.enabled = !state.isMuted;
      });
    }
    return { isMuted: !state.isMuted };
  }),

  toggleVideo: () => set((state) => {
    if (state.localStream) {
      state.localStream.getVideoTracks().forEach(track => {
        track.enabled = !state.isVideoEnabled;
      });
    }
    return { isVideoEnabled: !state.isVideoEnabled };
  }),
  
  setStatus: (status) => set({ status })
}));
