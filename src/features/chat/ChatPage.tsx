import bodyBg from "../../assets/body-bg.png";
import { Button } from "../../components/Button";
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
    retryInitialLoad,
  } = useChat({ currentUser: CURRENT_USER });

  const hasMessages = messages.length > 0;
  const showInitialErrorState =
    Boolean(error) && !isInitialLoading && !hasMessages;
  const showInlineError = Boolean(error) && hasMessages;

  return (
    <main
      className="min-h-screen bg-fixed bg-repeat"
      style={{ backgroundImage: `url(${bodyBg})` }}
    >
      <section
        aria-label="Chat conversation"
        className="mx-auto flex min-h-screen w-full max-w-160 flex-col p-6"
      >
        {showInitialErrorState ? (
          <section
            aria-labelledby="chat-error-title"
            className="flex flex-1 items-center justify-center"
          >
            <article className="w-full max-w-xl rounded-xl border border-border bg-white p-6 text-center shadow-sm backdrop-blur-sm">
              <header className="mb-2">
                <h1
                  id="chat-error-title"
                  className="text-xl font-semibold text-heading"
                >
                  Unable to load messages
                </h1>
              </header>

              <p className="mb-4 text-body-text">
                Please make sure the backend is running and try again.
              </p>

              <Button onClick={retryInitialLoad}>Retry</Button>
            </article>
          </section>
        ) : (
          <>
            {showInlineError && (
              <aside
                role="alert"
                className="mb-3 rounded-xl bg-error-bg px-4 py-3 text-error-text shadow-sm"
              >
                {error}
              </aside>
            )}

            <MessageList
              messages={messages}
              currentUser={currentUser}
              isInitialLoading={isInitialLoading}
            />
          </>
        )}
      </section>

      <footer className="sticky bottom-0 z-20 w-full bg-primary">
        <div className="mx-auto w-full max-w-160 p-2 sm:px-6">
          <MessageInput onSendMessage={sendMessage} isSending={isSending} />
        </div>
      </footer>
    </main>
  );
};
