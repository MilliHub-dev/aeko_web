"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaDeviceOption } from "@/types/livestream";

interface UseCameraOptions {
  onError?: (error: Error) => void;
}

export function useCamera({ onError }: UseCameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const playRequestIdRef = useRef(0);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceOption[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [isMuted, setIsMuted] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const attachStreamToVideo = useCallback(async (stream: MediaStream | null) => {
    if (!videoRef.current || !stream) {
      return;
    }

    const requestId = ++playRequestIdRef.current;

    if (videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream;
    }

    try {
      await new Promise<void>((resolve) => {
        if (!videoRef.current) {
          resolve();
          return;
        }

        if (videoRef.current.readyState >= 1) {
          resolve();
          return;
        }

        const handleLoadedMetadata = () => {
          videoRef.current?.removeEventListener("loadedmetadata", handleLoadedMetadata);
          resolve();
        };

        videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata, { once: true });
      });

      if (requestId !== playRequestIdRef.current || !videoRef.current) {
        return;
      }

      await videoRef.current.play();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.warn("Unable to autoplay camera preview yet:", error);
    }
  }, []);

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
      await attachStreamToVideo(stream);

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

  useEffect(() => {
    attachStreamToVideo(mediaStream);
  }, [attachStreamToVideo, mediaStream]);

  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;

    if (node && streamRef.current) {
      attachStreamToVideo(streamRef.current);
    }
  }, [attachStreamToVideo]);

  return {
    videoRef,
    setVideoRef,
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
