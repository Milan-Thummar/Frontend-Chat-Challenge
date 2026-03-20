import { MessageInput } from "../../components/MessageInput";
import { MessageItem } from "../../components/MessageItem";
import type { Message } from "../../types/message";

const CURRENT_USER = "Milan";

const mockMessages: Message[] = [
  {
    _id: "1",
    author: "Alice",
    message: "Hi Milan, are you joining the standup?",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    _id: "2",
    author: CURRENT_USER,
    message: "Yes, I’ll be there in 2 minutes.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

export const ChatPage = () => {
  const handleSendMessage = async (text: string) => {
    console.log("Send message:", text);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="mx-auto flex min-h-screen w-full max-w-160 flex-col justify-end p-6">
        <div className="mb-4 space-y-3">
          {mockMessages.map((message) => {
            const isOwnMessage = message.author === CURRENT_USER;

            return (
              <div
                key={message._id}
                className={
                  isOwnMessage ? "flex justify-end" : "flex justify-start"
                }
              >
                <MessageItem message={message} isOwnMessage={isOwnMessage} />
              </div>
            );
          })}
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <MessageInput onSendMessage={handleSendMessage} isSending={false} />
        </div>
      </section>
    </main>
  );
};
