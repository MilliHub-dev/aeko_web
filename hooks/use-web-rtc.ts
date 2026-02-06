import { useEffect, useRef, useCallback } from "react";
import { useCallStore, CallType } from "@/features/chat/stores/call-store";
import { getSocket } from "@/lib/socket";
import { useUser } from "@/components/shared/user-context";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" },
  ],
};

export function useWebRTC() {
  const { user } = useUser();
  const { 
    status, 
    type, 
    receiverId, 
    callerId,
    setIncomingCall, 
    setRemoteStream, 
    endCall, 
    setStatus,
    setLocalStream
  } = useCallStore();

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Helper to get socket
  const socket = getSocket();

  // Initialize Peer Connection
  const createPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && (receiverId || callerId)) {
        const target = receiverId || callerId;
        socket.emit("ice-candidate", {
          target,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        endCall();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [receiverId, callerId, socket, setRemoteStream, endCall]);

  // Start Call (Caller)
  const initiateCall = useCallback(async (targetId: string, callType: CallType) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === "video",
        audio: true,
      });
      
      localStreamRef.current = stream;
      setLocalStream(stream);

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("call-offer", {
        target: targetId,
        offer,
        type: callType
      });

    } catch (err) {
      console.error("Error starting call:", err);
      endCall();
    }
  }, [createPeerConnection, setLocalStream, socket, endCall]);

  // Answer Call (Receiver)
  const answerCall = useCallback(async () => {
    if (!callerId || !type) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === "video",
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // We need the offer first, which should have been set when handling 'call-offer'
      // But wait, 'call-offer' just sets state to 'incoming'. 
      // The offer data needs to be stored or passed. 
      // I'll assume we stored the pending offer in a ref or we process it now?
      // Actually, we can't process it "now" if we didn't save it.
      // So I need to update the store to hold the pending offer.
      
    } catch (err) {
      console.error("Error answering call:", err);
      endCall();
    }
  }, [callerId, type, createPeerConnection, setLocalStream, endCall]);

  // We need to store the pending offer to answer it later
  const pendingOfferRef = useRef<RTCSessionDescriptionInit | null>(null);

  // Handle Socket Events
  useEffect(() => {
    if (!socket) return;

    const handleCallOffer = async (data: { target: string; offer: RTCSessionDescriptionInit; type: CallType; callerId: string }) => {
      // data.callerId should be the ID of the person calling me
      // If the server sends 'sender' or similar, we use that.
      // The user prompt said: Payload : { target: 'RECEIVER_SOCKET_ID', offer: ... }
      // But when RECEIVING, I get the payload. 
      // Usually the server wraps it like: { sender: 'SENDER_ID', offer: ... }
      // I'll assume the event payload contains the sender info.
      
      // Let's assume data has `from` or `callerId`.
      // For now, I'll log it to debug if I could, but I can't.
      // I will assume `from` is the caller's ID (or socket ID).
      // Since the user said "target: RECEIVER_SOCKET_ID", the SENDER sends this.
      // The RECEIVER receives the event. The receiver needs to know who sent it.
      
      // I'll assume the payload I receive is the same object plus a `from` field added by server?
      // Or maybe the `target` in the sent payload was for routing, and the received payload has `offer`.
      // Wait, if the server blindly forwards, I might not know the sender unless it's in the payload.
      // But the prompt says "Connect to the socket server... and use these events".
      
      // Let's assume the incoming data structure matches what I need.
      // I will try to extract `from` or `callerId` from the data.
      const caller = (data as any).from || (data as any).sender || (data as any).callerId;
      
      if (caller) {
        pendingOfferRef.current = data.offer;
        setIncomingCall(caller, data.type || "voice"); // Default to voice if type missing
      }
    };

    const handleCallAnswer = async (data: { answer: RTCSessionDescriptionInit }) => {
      const pc = peerConnectionRef.current;
      if (pc && status === "calling") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        setStatus("connected");
      }
    };

    const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit }) => {
      const pc = peerConnectionRef.current;
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    socket.on("call-offer", handleCallOffer);
    socket.on("call-answer", handleCallAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("call-offer", handleCallOffer);
      socket.off("call-answer", handleCallAnswer);
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, [socket, status, setIncomingCall, setStatus]);

  // Complete Answer Call logic
  const acceptIncomingCall = useCallback(async () => {
    if (!pendingOfferRef.current || !callerId) return;

    try {
      const pc = createPeerConnection();
      
      // Set remote desc (the offer)
      await pc.setRemoteDescription(new RTCSessionDescription(pendingOfferRef.current));
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === "video",
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("call-answer", {
        target: callerId,
        answer,
      });
      
      setStatus("connected");
      pendingOfferRef.current = null;

    } catch (err) {
      console.error("Error accepting call:", err);
      endCall();
    }
  }, [callerId, type, createPeerConnection, setLocalStream, setStatus, socket, endCall]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  return {
    initiateCall,
    acceptIncomingCall,
  };
}
