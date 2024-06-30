import { Button, Flex, Textarea } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ChatBubble from "./core/chat-bubble";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    {
      id: number;
      text: string;
      timestamp: string;
    }[]
  >([]);

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.length > 500) {
      toast.error("This message is too long, please type a shorter message.");
      return;
    }

    if (message.trim() === "") return;

    const timestamp = new Date().toLocaleString();
    const id = new Date().getTime();
    setMessages([...messages, { id, text: message, timestamp }]);
    setMessage("");
  };

  return (
    <Flex
      className="rounded-2xl items-end"
      bg="#F5F5F5"
      flexGrow={1}
      // overflow="auto"
      justify="flex-end"
      direction="column"
      p={2}
    >
      <AnimatePresence>
        {messages.map((msg) => (
          <ChatBubble
            id={msg.id}
            text={msg.text}
            timestamp={msg.timestamp}
            key={msg.id}
          />
        ))}
      </AnimatePresence>

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
          />

          <Button type="submit" bg="#D0D4DD" p={2} borderRadius={999}>
            <ArrowUp className="w-5 h-5 text-gray-600" />
          </Button>
        </Flex>
      </form>
    </Flex>
  );
}
