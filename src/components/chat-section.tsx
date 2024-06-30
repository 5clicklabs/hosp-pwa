import { Button, Flex, Textarea } from "@chakra-ui/react";
import { ArrowUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    {
      id: number;
      text: string;
      timestamp: string;
    }[]
  >([]);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
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

  const handleMessageClick = (id: number) => {
    setSelectedMessage(selectedMessage === id ? null : id);
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
      <AnimatePresence mode="wait">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            layout="position"
            className="z-10 my-2 max-w-[250px] break-words rounded-2xl bg-gray-200 dark:bg-gray-800 cursor-pointer"
            layoutId={`container-${msg.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleMessageClick(msg.id)}
          >
            <div className="px-3 py-2 text-[15px] leading-[15px] text-gray-900 dark:text-gray-100">
              {msg.text}
            </div>
            {selectedMessage === msg.id && (
              <div className="px-3 py-1 text-[12px] leading-[12px] text-gray-500 dark:text-gray-400">
                {msg.timestamp}
              </div>
            )}
          </motion.div>
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
