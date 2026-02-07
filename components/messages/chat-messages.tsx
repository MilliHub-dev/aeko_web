"use client";

import { Send, Image, Smile, Mic, X, Play, Pause, CheckCheck, Video, Phone, Trash2, MoreVertical } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { useState, useEffect, useRef } from "react";
import { ChatHeader } from "./chat-header";
import { useChatStore } from "@/features/chat/stores/chat-store";
import { useUser } from "@/components/shared/user-context";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOtherParticipant } from "@/lib/chat-utils";

import { MediaViewerModal } from "./media-viewer-modal";
import { GroupInfoSidebar } from "./group-info-sidebar";

interface DisplayMessage {
  id: string;
  text: string;
  sent: boolean;
  time: string;
  readAt?: string;
  type?: 'text' | 'image' | 'video' | 'file' | 'emoji' | 'voice' | 'call';
  mediaUrl?: string;
  attachments?: { url: string; mimeType: string }[];
  voiceMessage?: {
    url: string;
    duration: number;
    waveform: number[];
  };
  call?: {
    type: 'voice' | 'video';
    duration?: number;
    status: 'missed' | 'ended' | 'declined';
  };
  deleted?: boolean;
}

interface MessageBubbleProps {
  message: DisplayMessage;
  onViewMedia: (url: string, type: 'image' | 'video') => void;
  onDelete: (messageId: string) => void;
}

const VoiceMessageBubble: React.FC<{ message: DisplayMessage }> = ({ message }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  if (!message.voiceMessage) return null;

  return (
    <div className="flex items-center gap-2 min-w-[200px]">
      <button 
        onClick={togglePlay}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
          message.sent 
            ? "bg-white/20 hover:bg-white/30 text-white" 
            : "bg-primary/10 hover:bg-primary/20 text-primary"
        }`}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div className="flex flex-col flex-1">
        <div className="h-8 flex items-center gap-1">
          {/* Simple visualization of waveform */}
          {message.voiceMessage.waveform?.map((peak, i) => (
             <div 
               key={i} 
               className="w-1 bg-current rounded-full opacity-50"
               style={{ height: `${Math.max(20, peak * 100)}%` }}
             />
          )) || <div className="h-1 w-full bg-current/20 rounded-full" />}
        </div>
        <span className="text-xs opacity-70">
          {formatDuration(message.voiceMessage.duration)}
        </span>
      </div>
      <audio 
        ref={audioRef} 
        src={message.voiceMessage.url} 
        onEnded={handleEnded}
        className="hidden" 
      />
    </div>
  );
};

const CallMessageBubble: React.FC<{ message: DisplayMessage }> = ({ message }) => {
  if (!message.call) return null;

  const { type, duration, status } = message.call;
  const isMissed = status === 'missed';
  const isDeclined = status === 'declined';
  
  const formatDuration = (ms?: number) => {
    if (!ms) return '';
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <div className="flex items-center gap-3 min-w-[180px] p-1">
      <div className={`p-2 rounded-full ${isMissed || isDeclined ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
        {type === 'video' ? <Video size={20} /> : <Phone size={20} />}
      </div>
      <div className="flex flex-col">
        <span className="font-medium">
          {isMissed ? 'Missed Call' : isDeclined ? 'Call Declined' : `${type === 'video' ? 'Video' : 'Voice'} Call`}
        </span>
        {duration ? (
          <span className="text-xs opacity-70">{formatDuration(duration)}</span>
        ) : (
          <span className="text-xs opacity-70">{status}</span>
        )}
      </div>
    </div>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onViewMedia, onDelete }) => {
  if (message.deleted) {
    return (
      <div className={`flex ${message.sent ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-xs lg:max-w-md ${
            message.sent ? "order-2" : "order-1"
          }`}>
          <div
            className={`rounded-2xl px-4 py-2 border border-border bg-background/50 text-muted-foreground italic text-sm ${
              message.sent
                ? "rounded-br-sm"
                : "rounded-bl-sm"
            }`}>
             This message was deleted
          </div>
          <div className={`flex items-center gap-1 mt-1 px-2 ${message.sent ? "justify-end" : "justify-start"}`}>
            <p className="text-xs text-muted-foreground">{message.time}</p>
          </div>
        </div>
      </div>
    );
  }

  // Helper to determine media to show (prefer attachments, fall back to mediaUrl)
  const mediaItem = message.attachments?.[0] || (message.mediaUrl ? { url: message.mediaUrl, mimeType: message.type === 'video' ? 'video/mp4' : 'image/jpeg' } : null);
  const isImage = mediaItem?.mimeType.startsWith('image/') || message.type === 'image';
  const isVideo = mediaItem?.mimeType.startsWith('video/') || message.type === 'video';
  const isFile = !isImage && !isVideo && (!!mediaItem || message.type === 'file');
  const isVoice = message.type === 'voice' && !!message.voiceMessage;

  return (
  <div className={`flex group ${message.sent ? "justify-end" : "justify-start"}`}>
    {message.sent && (
      <div className="order-1 flex items-center px-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-secondary rounded-full text-muted-foreground">
              <MoreVertical size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => onDelete(message.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )}
    <div
      className={`max-w-xs lg:max-w-md ${
        message.sent ? "order-2" : "order-1"
      }`}>
      <div
        className={`rounded-2xl px-4 py-2 ${
          message.sent
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-secondary text-foreground rounded-bl-sm"
        }`}>
        {mediaItem && isImage ? (
           <img 
             src={mediaItem.url} 
             alt="Image" 
             className="rounded-lg max-w-full h-auto mb-1 cursor-pointer hover:opacity-90 transition-opacity" 
             onClick={() => onViewMedia(mediaItem.url, 'image')}
           />
        ) : mediaItem && isVideo ? (
           <div className="relative cursor-pointer group" onClick={() => onViewMedia(mediaItem.url, 'video')}>
             <video src={mediaItem.url} className="rounded-lg max-w-full h-auto mb-1" />
             <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors rounded-lg">
               <Play className="w-8 h-8 text-white opacity-80 group-hover:opacity-100" />
             </div>
           </div>
        ) : mediaItem && isFile ? (
           <a href={mediaItem.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm underline mb-1">
             📎 Attachment
           </a>
        ) : isVoice ? (
           <VoiceMessageBubble message={message} />
        ) : message.type === 'call' ? (
           <CallMessageBubble message={message} />
        ) : null}
        {message.text && message.type !== 'voice' && message.type !== 'call' && (
           <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
             {message.text}
           </p>
        )}
      </div>
      <div className={`flex items-center gap-1 mt-1 px-2 ${message.sent ? "justify-end" : "justify-start"}`}>
        <p className="text-xs text-muted-foreground">{message.time}</p>
        {message.sent && (
          message.readAt ? (
            <CheckCheck className="w-4 h-4 text-blue-500" />
          ) : (
            <CheckCheck className="w-4 h-4 text-muted-foreground" />
          )
        )}
      </div>
    </div>
  </div>
  );
};

interface MessageListProps {
  messages: DisplayMessage[];
  isLoading: boolean;
  onViewMedia: (url: string, type: 'image' | 'video') => void;
  onDelete: (messageId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, onViewMedia, onDelete }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Scroll to bottom on window resize (e.g. keyboard open)
  useEffect(() => {
    const handleResize = () => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "auto" });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {isLoading ? (
        <div className="flex justify-center p-4">
           <span className="text-muted-foreground">Loading messages...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex justify-center p-4">
           <span className="text-muted-foreground">No messages yet. Say hi!</span>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onViewMedia={onViewMedia} onDelete={onDelete} />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
};

interface MessageInputProps {
  onSend: (text: string) => void;
  onSendMedia: (file: File) => void;
  onSendVoice: (voice: Blob, duration: number, waveform: number[]) => void;
  isSending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, onSendMedia, onSendVoice, isSending }) => {
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        // Generate mock waveform for now
        const waveform = Array.from({ length: 20 }, () => Math.random());
        onSendVoice(audioBlob, recordingDuration, waveform);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Override onstop to do nothing or handle differently if needed
      mediaRecorderRef.current.onstop = null;
      
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingDuration(0);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendMedia(file);
      
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isRecording) {
    return (
      <div className="border-t border-border px-4 py-1">
        <div className="flex items-center justify-between bg-secondary rounded-full px-4 py-2">
          <div className="flex items-center gap-2 text-red-500 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-sm font-medium">{formatDuration(recordingDuration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={cancelRecording}
              className="p-2 hover:bg-black/10 rounded-full transition-colors text-muted-foreground"
            >
              <X size={20} />
            </button>
            <button 
              onClick={stopRecording}
              className="p-2 bg-primary text-primary-foreground rounded-full transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-border px-4 py-1">
      <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
        />
        <button 
            className="p-1 hover:bg-secondary/80 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
        >
          <Image size={20} className="text-primary" />
        </button>
        
        <Popover open={showEmoji} onOpenChange={setShowEmoji}>
          <PopoverTrigger asChild>
            <button className="p-1 hover:bg-secondary/80 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSending}>
              <Smile size={20} className="text-primary" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 border-none" align="start">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </PopoverContent>
        </Popover>

        <input
          type="text"
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          className="flex-1 bg-transparent focus:outline-none px-2 text-foreground placeholder:text-muted-foreground disabled:opacity-50"
        />
        
        {message.trim() ? (
          <button 
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="p-1 hover:bg-secondary/80 rounded-full transition-colors disabled:opacity-50">
            <Send size={20} className="text-primary" />
          </button>
        ) : (
          <button 
            onClick={startRecording}
            disabled={isSending}
            className="p-1 hover:bg-secondary/80 rounded-full transition-colors disabled:opacity-50"
          >
            <Mic size={20} className="text-primary" />
          </button>
        )}
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="hidden lg:flex flex-col items-center justify-center h-full bg-background">
    <div className="text-6xl mb-4">💬</div>
    <h2 className="text-2xl font-bold text-foreground mb-2">
      Select a message
    </h2>
    <p className="text-muted-foreground">
      Choose from your existing conversations or start a new one
    </p>
  </div>
);

const ChatMessages = () => {
  const { selectedChat, showChatList, isInitializing } = useChat();
  const { messages, fetchMessages, sendMessage, sendMediaMessage, sendVoiceMessage, deleteMessage, isSendingMessage, isLoadingMessages } = useChatStore();
   const { user } = useUser();
   const [showGroupInfo, setShowGroupInfo] = useState(false);
   const [mediaViewer, setMediaViewer] = useState<{ url: string; type: 'image' | 'video'; isOpen: boolean }>({
     url: '',
     type: 'image',
     isOpen: false
   });
 
   useEffect(() => {
     if (selectedChat?.id) {
       fetchMessages(selectedChat.id);
     }
   }, [selectedChat?.id, fetchMessages]);
 
   const handleSend = (text: string) => {
    if (!selectedChat) return;
    const myId = user?._id || user?.id;
    const receiver = getOtherParticipant(selectedChat, myId);
    // Safe check for receiver ID
    const receiverId = receiver?.id || (receiver as any)?._id || (receiver as any)?.userId;
    
    sendMessage(text, receiverId);
  };

  const handleSendMedia = (file: File) => {
    if (!selectedChat) return;
    const myId = user?._id || user?.id;
    const receiver = getOtherParticipant(selectedChat, myId);
    const receiverId = receiver?.id || (receiver as any)?._id || (receiver as any)?.userId;
    
    sendMediaMessage(file, receiverId);
  };

  const handleSendVoice = (voice: Blob, duration: number, waveform: number[]) => {
    if (!selectedChat) return;
    const myId = user?._id || user?.id;
    const receiver = getOtherParticipant(selectedChat, myId);
    const receiverId = receiver?.id || (receiver as any)?._id || (receiver as any)?.userId;
    
    sendVoiceMessage(voice, duration, waveform, receiverId);
  };

  const handleViewMedia = (url: string, type: 'image' | 'video') => {
    setMediaViewer({ url, type, isOpen: true });
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (selectedChat?.id) {
      await deleteMessage(selectedChat.id, messageId);
    }
  };

  if (!selectedChat) {
    if (isInitializing) {
      return (
        <div className={`flex flex-col items-center justify-center h-full bg-background`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Starting conversation...</p>
        </div>
      );
    }
    return <EmptyState />;
  }

  const chatId = selectedChat.id;
  const chatMessages = messages[chatId] || [];
  const isLoading = isLoadingMessages[chatId];

  const displayMessages: DisplayMessage[] = chatMessages.map(m => ({
    id: m.id,
    text: m.content,
    sent: m.senderId === (user?._id || user?.id),
    time: new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    readAt: m.readAt,
    type: m.messageType,
    mediaUrl: m.mediaUrl,
    attachments: m.attachments,
    voiceMessage: m.voiceMessage,
    call: m.call,
    deleted: m.deleted
  }));

  return (
    <div className={`flex h-full ${showChatList ? 'hidden lg:flex' : 'flex'}`}>
      <div className="flex flex-col flex-1 h-full min-w-0 relative">
        <ChatHeader onToggleGroupInfo={() => setShowGroupInfo(!showGroupInfo)} />
        
        <MessageList 
          messages={displayMessages} 
          isLoading={isLoading} 
          onViewMedia={handleViewMedia}
          onDelete={handleDeleteMessage}
        />

        <MessageInput 
          onSend={handleSend} 
          onSendMedia={handleSendMedia}
          onSendVoice={handleSendVoice}
          isSending={isSendingMessage} 
        />
      </div>

      {showGroupInfo && selectedChat.isGroup && (
        <div className="w-80 border-l border-border h-full bg-background overflow-hidden absolute inset-y-0 right-0 z-20 shadow-xl xl:static xl:shadow-none xl:z-auto">
          <GroupInfoSidebar chat={selectedChat} onClose={() => setShowGroupInfo(false)} />
        </div>
      )}

      <MediaViewerModal 
        isOpen={mediaViewer.isOpen}
        onClose={() => setMediaViewer(prev => ({ ...prev, isOpen: false }))}
        url={mediaViewer.url}
        type={mediaViewer.type}
      />
    </div>
  );
};

export { ChatMessages };
