import { MessageInput } from "../../components/MessageInput";

export const ChatPage = () => {
  const handleSendMessage = async (text: string) => {
    console.log("Send message:", text);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="mx-auto flex min-h-screen w-full max-w-160 flex-col justify-end p-6">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <MessageInput onSendMessage={handleSendMessage} isSending={false} />
        </div>
      </section>
    </main>
  );
};
