import { useCallback, useEffect, useRef, useState } from "react";
import { createMessage, getMessages } from "../../services/chatApi";
import type { Message } from "../../types/message";

const PAGE_SIZE = 20;
const POLLING_LIMIT = 10;
const POLLING_INTERVAL = 2000;

const DEFAULT_ERROR_MESSAGES = {
  load: "Failed to load messages.",
  older: "Failed to load older messages.",
  send: "Failed to send message.",
  poll: "Failed to fetch new messages.",
};

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
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isPollingNew, setIsPollingNew] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasOlderMessages, setHasOlderMessages] = useState(true);

  const isPollingRef = useRef(false);
  const latestMessageDateRef = useRef<string | null>(null);

  const oldestMessageDate = messages[0]?.createdAt ?? null;
  const latestMessageDate = messages[messages.length - 1]?.createdAt ?? null;

  useEffect(() => {
    latestMessageDateRef.current = latestMessageDate;
  }, [latestMessageDate]);

  const loadInitialMessages = useCallback(async () => {
    try {
      setError(null);
      setIsInitialLoading(true);

      const messagesData = await getMessages({ limit: PAGE_SIZE });

      setMessages(mergeMessages(messagesData));
      setHasOlderMessages(messagesData.length === PAGE_SIZE);
    } catch (error) {
      setError(getErrorMessage(error, DEFAULT_ERROR_MESSAGES.load));
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInitialMessages();
  }, [loadInitialMessages]);

  const loadOlderMessages = useCallback(async () => {
    if (!oldestMessageDate || isLoadingOlder || !hasOlderMessages) return;

    try {
      setError(null);
      setIsLoadingOlder(true);

      const olderMessages = await getMessages({
        limit: PAGE_SIZE,
        before: oldestMessageDate,
      });

      if (olderMessages.length) {
        setMessages((previousMessages) =>
          mergeMessages([...olderMessages, ...previousMessages])
        );
      }

      setHasOlderMessages(olderMessages.length === PAGE_SIZE);
    } catch (error) {
      setError(getErrorMessage(error, DEFAULT_ERROR_MESSAGES.older));
    } finally {
      setIsLoadingOlder(false);
    }
  }, [oldestMessageDate, isLoadingOlder, hasOlderMessages]);

  const fetchNewMessages = useCallback(async () => {
    const latestDate = latestMessageDateRef.current;
    if (!latestDate || isPollingRef.current) return;

    try {
      isPollingRef.current = true;
      setIsPollingNew(true);

      const newerMessages = await getMessages({
        after: latestDate,
        limit: POLLING_LIMIT,
      });

      if (newerMessages.length) {
        setMessages((previousMessages) =>
          mergeMessages([...previousMessages, ...newerMessages])
        );
      }
    } catch (error) {
      setError(getErrorMessage(error, DEFAULT_ERROR_MESSAGES.poll));
    } finally {
      isPollingRef.current = false;
      setIsPollingNew(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialLoading || !latestMessageDate) return;

    void fetchNewMessages();

    const intervalId = setInterval(() => {
      void fetchNewMessages();
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchNewMessages, latestMessageDate, isInitialLoading]);

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

        setError(getErrorMessage(error, DEFAULT_ERROR_MESSAGES.send));
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
    isLoadingOlder,
    isPollingNew,
    isSending,
    hasOlderMessages,
    loadOlderMessages,
    sendMessage,
    retryInitialLoad: loadInitialMessages,
  };
};
