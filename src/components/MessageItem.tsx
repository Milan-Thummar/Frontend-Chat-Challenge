import { memo } from "react";
import type { Message } from "../types/message";
import { classNames } from "../utils/classNames";
import { formatMessageDateTime } from "../utils/date";
import { decodeHtmlEntities } from "../utils/text";

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageItem = memo(
  ({ message, isOwnMessage }: MessageItemProps) => {
    const formattedDateTime = formatMessageDateTime(message.createdAt);

    return (
      <article
        className={classNames(
          "max-w-[86%] rounded-md border border-border p-4 shadow-xs sm:max-w-[75%]",
          isOwnMessage && "bg-own-msg",
          !isOwnMessage && "bg-white"
        )}
        aria-label={
          isOwnMessage
            ? `Your message sent at ${formattedDateTime}`
            : `Message from ${message.author} sent at ${formattedDateTime}`
        }
      >
        {!isOwnMessage && (
          <p className="mb-1 text-base text-muted">{message.author}</p>
        )}

        <p className="mb-2 whitespace-pre-wrap wrap-break-word text-base leading-6 text-body-text">
          {decodeHtmlEntities(message.message)}
        </p>

        <time
          className={classNames(
            "block text-base text-muted",
            isOwnMessage && "text-right"
          )}
          dateTime={message.createdAt}
          aria-label={`Sent at ${formattedDateTime}`}
        >
          {formattedDateTime}
        </time>
      </article>
    );
  }
);
