import { Button, Flex, Textarea } from "@chakra-ui/react";
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "20px";
    }
  }, []);

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

    await fetchAIResponse(message, id);
    setIsFetching(false);
  };

  const fetchAIResponse = async (
    userMessage: string,
    userMessageId: number
  ): Promise<void> => {
    const timestamp = new Date().toLocaleString();
    const id = userMessageId + 1;

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

      const assistantMessage: Message = {
        id,
        text: "",
        timestamp,
        sender: "assistant",
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

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
            msg.id === id ? { ...msg, text: content } : msg
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

  return (
    <Flex
      className="rounded-2xl items-end"
      bg="#F5F5F5"
      flexGrow={1}
      justify="flex-end"
      direction="column"
      p={2}
    >
      <div className="flex flex-col w-full">
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
      </div>

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
            <ArrowUp className="w-5 h-5 text-gray-600" />
          </Button>
        </Flex>
      </form>
    </Flex>
  );
}
