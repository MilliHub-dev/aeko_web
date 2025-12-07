"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaDeviceOption } from "@/types/livestream";

interface UseCameraOptions {
  onError?: (error: Error) => void;
}

export function useCamera({ onError }: UseCameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceOption[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [isMuted, setIsMuted] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get available media devices
  const enumerateDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const cameras: MediaDeviceOption[] = [];
      const microphones: MediaDeviceOption[] = [];

      deviceList.forEach((device) => {
        if (device.kind === "videoinput") {
          cameras.push({
            deviceId: device.deviceId,
            label: device.label || `Camera ${cameras.length + 1}`,
            kind: "videoinput",
          });
        } else if (device.kind === "audioinput") {
          microphones.push({
            deviceId: device.deviceId,
            label: device.label || `Microphone ${microphones.length + 1}`,
            kind: "audioinput",
          });
        }
      });

      setDevices([...cameras, ...microphones]);

      // Set default devices
      if (cameras.length > 0 && !selectedCamera) {
        setSelectedCamera(cameras[0].deviceId);
      }
      if (microphones.length > 0 && !selectedMicrophone) {
        setSelectedMicrophone(microphones[0].deviceId);
      }
    } catch (error) {
      console.error("Error enumerating devices:", error);
      onError?.(error as Error);
    }
  };

  // Request camera and audio access
  const requestMediaAccess = async (
    videoDeviceId?: string,
    audioDeviceId?: string
  ) => {
    try {
      setIsLoading(true);

      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: videoDeviceId
          ? { deviceId: { exact: videoDeviceId } }
          : { facingMode: "user" },
        audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream);
      streamRef.current = stream;
      setHasPermission(true);

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Enumerate devices after permission granted
      await enumerateDevices();
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setHasPermission(false);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch camera
  const switchCamera = async (deviceId: string) => {
    setSelectedCamera(deviceId);
    await requestMediaAccess(deviceId, selectedMicrophone);
  };

  // Switch microphone
  const switchMicrophone = async (deviceId: string) => {
    setSelectedMicrophone(deviceId);
    await requestMediaAccess(selectedCamera, deviceId);
  };

  // Toggle mute
  const toggleMute = () => {
    if (mediaStream) {
      const audioTracks = mediaStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    requestMediaAccess();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    mediaStream,
    devices,
    selectedCamera,
    selectedMicrophone,
    isMuted,
    hasPermission,
    isLoading,
    switchCamera,
    switchMicrophone,
    toggleMute,
    requestMediaAccess,
  };
}
