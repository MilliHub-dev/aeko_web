import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "./config";

let socket: Socket | null = null;

export const getSocket = (token?: string): Socket => {
  if (!socket && token) {
    socket = io(API_BASE_URL, {
      auth: {
        token,
      },
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
  }
  return socket as Socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
