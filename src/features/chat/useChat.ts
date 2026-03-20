import { useCallback, useEffect, useState } from "react";
import { createMessage, getMessages } from "../../services/chatApi";
import type { Message } from "../../types/message";

const PAGE_SIZE = 5;

const byCreatedAt = (a: Message, b: Message) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

const getMessageKey = (message: Message) =>
  message._id ?? `${message.author}-${message.message}-${message.createdAt}`;

const mergeMessages = (messages: Message[]) =>
  Array.from(
    new Map(
      messages.map((message) => [getMessageKey(message), message])
    ).values()
  ).sort(byCreatedAt);

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const useChat = ({ currentUser }: { currentUser: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInitialMessages = useCallback(async () => {
    try {
      setError(null);
      setIsInitialLoading(true);

      const messagesData = await getMessages({ limit: PAGE_SIZE });
      setMessages(mergeMessages(messagesData));
    } catch (error) {
      setError(getErrorMessage(error, "Failed to load messages."));
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInitialMessages();
  }, [loadInitialMessages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText) return;

      const optimisticMessage: Message = {
        _id: `temp-${crypto.randomUUID()}`,
        author: currentUser,
        message: trimmedText,
        createdAt: new Date().toISOString(),
      };

      try {
        setError(null);
        setIsSending(true);

        setMessages((previousMessages) =>
          mergeMessages([...previousMessages, optimisticMessage])
        );

        const savedMessage = await createMessage({
          author: currentUser,
          message: trimmedText,
        });

        setMessages((previousMessages) =>
          mergeMessages([
            ...previousMessages.filter(
              (message) => message._id !== optimisticMessage._id
            ),
            savedMessage,
          ])
        );
      } catch (error) {
        setMessages((previousMessages) =>
          previousMessages.filter(
            (message) => message._id !== optimisticMessage._id
          )
        );

        setError(getErrorMessage(error, "Failed to send message."));
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [currentUser]
  );

  return {
    currentUser,
    messages,
    error,
    isInitialLoading,
    isSending,
    sendMessage,
    retryInitialLoad: loadInitialMessages,
  };
};
