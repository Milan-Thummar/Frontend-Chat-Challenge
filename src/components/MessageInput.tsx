import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, SyntheticEvent } from "react";
import { Button } from "./Button";

interface Props {
  onSendMessage: (text: string) => Promise<void>;
  isSending: boolean;
}

export const MessageInput = ({ onSendMessage, isSending }: Props) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const isSubmitDisabled = isSending || !value.trim();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submitMessage = async () => {
    const trimmed = value.trim();
    if (!trimmed || isSending) return;

    await onSendMessage(trimmed);
    setValue("");
    inputRef.current?.focus();
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitMessage();
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await submitMessage();
    }
  };

  return (
    <form
      className="grid grid-cols-[1fr_auto] items-center gap-2"
      onSubmit={handleSubmit}
    >
      <label htmlFor="message" className="sr-only">
        Message
      </label>

      <textarea
        ref={inputRef}
        id="message"
        className="min-h-14 w-full resize-none rounded-md border-[3px] border-input-border bg-white px-3 py-4 text-body-text outline-none placeholder:text-muted focus:border-primary-dark"
        placeholder="Message"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSending}
        autoComplete="off"
        aria-label="Message input"
        rows={1}
      />

      <Button
        type="submit"
        isLoading={isSending}
        disabled={isSubmitDisabled}
        aria-label="Send message"
      >
        Send
      </Button>
    </form>
  );
};
