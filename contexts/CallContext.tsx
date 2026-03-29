"use client";

import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { useWebRTC } from "@/hooks/use-web-rtc";
import { CallOverlay } from "@/components/messages/call-overlay";
import { CallType } from "@/features/chat/stores/call-store";
import { getSocket } from "@/lib/socket";

interface CallContextType {
  startCall: (receiverId: string, type: CallType, receiverUserId?: string | null) => void;
}

const CallContext = createContext<CallContextType | null>(null);

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
}

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const initSocket = async () => {
      try {
        const res = await fetch("/api/auth/token");
        if (res.ok) {
          const { token } = await res.json();
          if (token) {
            getSocket(token);
            setSocketConnected(true);
          }
        }
      } catch (e) {
        console.error("Failed to init socket in CallProvider", e);
      }
    };
    initSocket();
  }, []);

  const { initiateCall } = useWebRTC();

  const startCall = useCallback((receiverId: string, type: CallType, receiverUserId?: string | null) => {
    initiateCall(receiverId, type, receiverUserId);
  }, [initiateCall]);

  return (
    <CallContext.Provider value={{ startCall }}>
      {children}
      <CallOverlay />
    </CallContext.Provider>
  );
}
