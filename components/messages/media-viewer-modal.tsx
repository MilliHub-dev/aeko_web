"use client";

import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import Image from "next/image";

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  type: "image" | "video";
}

export const MediaViewerModal = ({ isOpen, onClose, url, type }: MediaViewerModalProps) => {
  if (!url) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-screen-xl w-full h-[90vh] p-0 bg-transparent border-none shadow-none flex items-center justify-center overflow-hidden ring-0 outline-none"
        showCloseButton={false}
      >
        <div className="sr-only">
            <DialogTitle>Media Viewer</DialogTitle>
            <DialogDescription>View full size media</DialogDescription>
        </div>

        <DialogClose 
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer outline-none ring-0"
          onClick={onClose}
        >
          <X size={24} />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        {type === "image" ? (
          <div className="relative w-full h-full pointer-events-none">
            <Image 
              src={url} 
              alt="Full size media" 
              fill 
              className="object-contain pointer-events-auto" 
              priority
            />
          </div>
        ) : (
          <video 
            src={url} 
            controls 
            autoPlay 
            className="max-w-full max-h-full object-contain" 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
