import { useEffect, useRef } from "react";
import type { Message } from "../types/message";
import { classNames } from "../utils/classNames";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  currentUser: string;
  isInitialLoading: boolean;
  isLoadingOlder: boolean;
  hasOlderMessages: boolean;
  onLoadOlder: () => void;
}

export const MessageList = ({
  messages,
  currentUser,
  isInitialLoading,
  isLoadingOlder,
  hasOlderMessages,
  onLoadOlder,
}: MessageListProps) => {
  const previousLengthRef = useRef(0);

  useEffect(() => {
    if (!messages.length) return;

    const previousLength = previousLengthRef.current;
    const currentLength = messages.length;

    const shouldScrollToBottom =
      previousLength === 0 ||
      (!isLoadingOlder && currentLength > previousLength);

    if (shouldScrollToBottom) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "auto",
        });
      });
    }

    previousLengthRef.current = currentLength;
  }, [messages, isLoadingOlder]);

  useEffect(() => {
    const handleScroll = () => {
      const isNearTop = window.scrollY <= 40;

      if (!isNearTop || isLoadingOlder || !hasOlderMessages) return;

      onLoadOlder();
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoadingOlder, hasOlderMessages, onLoadOlder]);

  const renderState = (text: string) => (
    <div
      className="flex min-h-50 items-center justify-center text-app-text"
      role="status"
    >
      {text}
    </div>
  );

  if (isInitialLoading) return renderState("Loading messages…");

  return (
    <section
      className="flex-1"
      aria-label="Chat messages"
      aria-busy={isLoadingOlder}
    >
      {!messages.length ? (
        renderState("No chat messages yet.")
      ) : (
        <ul className="m-0 list-none p-0">
          {isLoadingOlder && (
            <li>
              <div
                className="mb-4 text-center text-sm text-muted"
                role="status"
              >
                Loading older messages…
              </div>
            </li>
          )}

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
