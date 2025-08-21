import { ChatProvider } from "@/contexts/ChatContext";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ChatProvider>{children}</ChatProvider>
    </div>
  );
}
