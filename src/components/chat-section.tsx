import React, { useState, useEffect, useRef } from "react";
import { Flex } from "@chakra-ui/react";
import { Message } from "../lib/types";
import WelcomeOptions from "./chat/welcome-options";
import InputForm from "./chat/input-form";
import MessageList, { simulateAIResponse } from "./chat/message-list";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showInputForm, setShowInputForm] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
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

  const handleSubmit = async (message: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setShowInputForm(false);
    setIsFetching(true);

    const aiResponse = await simulateAIResponse(message);
    setMessages((prevMessages) => [...prevMessages, aiResponse]);
    setIsFetching(false);
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
        <MessageList messages={messages} />
        {showOptions && <WelcomeOptions onOptionSelect={handleOptionSelect} />}
        <div ref={messagesEndRef} />
      </Flex>
      {showInputForm && (
        <InputForm onSubmit={handleSubmit} isFetching={isFetching} />
      )}
    </Flex>
  );
};

export default Chat;
