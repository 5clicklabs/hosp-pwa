import { Button, Flex, VStack } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    // Here you would typically handle the next step based on the selected option
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
    </Flex>
  );
};

export default Chat;
