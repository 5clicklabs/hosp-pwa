import React, { useEffect, useRef, useState } from "react";
import { Button, Flex, VStack, Textarea, Spinner } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { toast } from "sonner";
import ChatBubble from "./core/chat-bubble";
import CText from "./core/ctext";

interface Message {
  id: number;
  text: string;
  sender: "user" | "assistant";
  timestamp: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [message, setMessage] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [showInputForm, setShowInputForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: 1,
      text: "Welcome to Manipal Hospital. How may I help you?",
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    };
    setMessages([welcomeMessage]);
    setShowOptions(true);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "20px";
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOptionSelect = (option: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: `${option}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setShowOptions(false);

    if (option === "Book an appointment") {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        text: "What can we help you with?",
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      setShowInputForm(true);
    }
    // Handle other options here
  };

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

    const userMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setMessage("");
    setIsFetching(true);
    setShowInputForm(false); // Hide the input form after submission

    // Here you would call your AI service
    // For now, let's just simulate a response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: "Thank you for providing that information. Based on your symptoms, I recommend the following departments: Gastroenterology, Internal Medicine. Please choose one:",
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsFetching(false);
      // Here you would typically show department selection options
    }, 1000);
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
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              id={message.id}
              text={message.text}
              sender={message.sender}
              timestamp={message.timestamp}
            />
          ))}
        </AnimatePresence>
        {showOptions && (
          <VStack align="stretch" spacing={2} mt={4}>
            <Button
              size="md"
              bg="#1f2937"
              color="white"
              onClick={() => handleOptionSelect("Book an appointment")}
            >
              <CText>Book an appointment</CText>
            </Button>
            <Button
              size="md"
              bg="#1f2937"
              color="white"
              onClick={() => handleOptionSelect("Get Lab Reports")}
            >
              <CText>Get Lab Reports</CText>
            </Button>
            <Button
              size="md"
              bg="#1f2937"
              color="white"
              onClick={() => handleOptionSelect("General Inquiry")}
            >
              <CText>General Inquiry</CText>
            </Button>
          </VStack>
        )}
        <div ref={messagesEndRef} />
      </Flex>
      {showInputForm && (
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
              placeholder="Describe your symptoms..."
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
      )}
    </Flex>
  );
};

export default Chat;
