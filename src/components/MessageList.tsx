import type { Message } from "../types/message";
import { classNames } from "../utils/classNames";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  currentUser: string;
  isInitialLoading: boolean;
}

export const MessageList = ({
  messages,
  currentUser,
  isInitialLoading,
}: MessageListProps) => {
  const renderState = (text: string) => (
    <div
      className="flex min-h-50 items-center justify-center text-app-text"
      role="status"
    >
      {text}
    </div>
  );

  if (isInitialLoading) {
    return renderState("Loading messages…");
  }

  return (
    <section className="flex-1" aria-label="Chat messages">
      {!messages.length ? (
        renderState("No chat messages yet.")
      ) : (
        <ul className="m-0 list-none p-0">
          {messages.map((message) => {
            const key =
              message._id ??
              `${message.author}-${message.message}-${message.createdAt}`;

            const isOwn = message.author === currentUser;

            return (
              <li
                key={key}
                className={classNames(
                  "mb-3 flex",
                  isOwn ? "justify-end" : "justify-start"
                )}
              >
                <MessageItem message={message} isOwnMessage={isOwn} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
