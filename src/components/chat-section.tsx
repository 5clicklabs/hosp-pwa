import { Button, Flex, Textarea, Spinner } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ChatBubble from "./core/chat-bubble";
import { Message } from "@/lib/types";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "20px";
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    autoResizeTextarea(event.target);
  };

  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (message.length > 500) {
      toast.error("This message is too long, please type a shorter message.");
      return;
    }

    if (message.trim() === "") {
      toast.info("You need to type a message first.");
      return;
    }

    const timestamp = new Date().toLocaleString();
    const id = new Date().getTime();
    const userMessage: Message = {
      id,
      text: message,
      timestamp,
      sender: "user",
    };

    setMessages([...messages, userMessage]);
    setMessage("");
    setIsFetching(true);

    const systemMessage: Message = {
      id: id + 1,
      text: "",
      timestamp,
      sender: "system",
    };
    setMessages((prevMessages) => [...prevMessages, systemMessage]);

    await fetchAIResponse(message, id + 1);
    setIsFetching(false);
  };

  const fetchAIResponse = async (
    userMessage: string,
    systemMessageId: number
  ): Promise<void> => {
    const timestamp = new Date().toLocaleString();
    const id = systemMessageId;

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let content = "";
      let done = false;

      while (!done) {
        const { value, done: doneReading } = (await reader?.read()) ?? {
          value: new Uint8Array(),
          done: true,
        };
        done = doneReading;
        const chunk = decoder.decode(value);
        content += chunk;

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === id ? { ...msg, text: content, sender: "assistant" } : msg
          )
        );
      }
    } catch (error) {
      console.error(error);
      const failedMessage: Message = {
        id,
        text: "Failed to fetch AI response.",
        timestamp,
        sender: "assistant",
      };
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === id ? failedMessage : msg))
      );
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as React.FormEvent);
    }
  };

  return (
    <Flex
      className="rounded-2xl items-end"
      bg="#F5F5F5"
      height={{ base: "85%", "2xl": "95%" }}
      justify="flex-end"
      direction="column"
      p={2}
    >
      <Flex
        height="95%"
        width="100%"
        direction="column"
        overflowY="auto"
        p={2}
        mb={2}
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              id={msg.id}
              text={msg.text}
              timestamp={msg.timestamp}
              sender={msg.sender}
            />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Flex>

      <form onSubmit={handleSubmit} className="w-full">
        <Flex
          borderRadius={50}
          bg="white"
          justify="space-between"
          width="100%"
          align="center"
          px={2}
        >
          <Textarea
            ref={textareaRef}
            placeholder="Ask me a question..."
            _placeholder={{
              color: "gray.400",
              fontSize: "14px",
            }}
            _focusVisible={{ outline: "none", boxShadow: "none" }}
            borderRadius={50}
            border="none"
            resize="none"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            style={{
              overflow: "hidden",
              minHeight: "56px",
              maxHeight: "200px",
            }}
            disabled={isFetching}
          />

          <Button
            type="submit"
            bg="#D0D4DD"
            p={2}
            borderRadius={999}
            disabled={isFetching}
          >
            {isFetching ? (
              <Spinner size="sm" />
            ) : (
              <ArrowUp className="w-5 h-5 text-gray-600" />
            )}
          </Button>
        </Flex>
      </form>
    </Flex>
  );
}
