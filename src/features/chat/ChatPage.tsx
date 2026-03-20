import { MessageInput } from "../../components/MessageInput";
import { MessageList } from "../../components/MessageList";
import { useChat } from "./useChat";

const CURRENT_USER: string = "Milan";

export const ChatPage = () => {
  const {
    currentUser,
    messages,
    error,
    isInitialLoading,
    isSending,
    sendMessage,
  } = useChat({ currentUser: CURRENT_USER });

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="mx-auto flex min-h-screen w-full max-w-160 flex-col p-6">
        {error && (
          <div
            role="alert"
            className="mb-3 rounded-xl bg-error-bg px-4 py-3 text-error-text"
          >
            {error}
          </div>
        )}

        <MessageList
          messages={messages}
          currentUser={currentUser}
          isInitialLoading={isInitialLoading}
        />

        <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
          <MessageInput onSendMessage={sendMessage} isSending={isSending} />
        </div>
      </section>
    </main>
  );
};
