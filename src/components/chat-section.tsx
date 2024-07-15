import React, { useState, useEffect, useRef } from "react";
import { Flex } from "@chakra-ui/react";
import { Message } from "../lib/types";
import MessageList from "./chat/message-list";
import WelcomeOptions from "./chat/welcome-options";
import useFrequentlyAskedOperations from "@/hooks/frequent-ops";
import AppointmentFlow from "@/flows/appointment-flow";

const Chat: React.FC = () => {
  const { sendMessageToGPT, messages, setMessages } =
    useFrequentlyAskedOperations();
  const [showOptions, setShowOptions] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<
    "none" | "appointment" | "labReports" | "generalInquiry"
  >("none");
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
      setCurrentFlow("appointment");
    } else if (option === "Get Lab Reports") {
      setCurrentFlow("labReports");
      // Implement lab reports flow
    } else if (option === "General Inquiry") {
      setCurrentFlow("generalInquiry");
      // Implement general inquiry flow
    }
  };

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <Flex
      className="rounded-2xl items-end border-2 border-gray-300 shadow-xl"
      bg="#F5F5F5"
      height={{ base: "85%", "2xl": "95%" }}
      // justify="flex-end"
      direction="column"
      p={2}
    >
      <Flex
        height="97%"
        width="100%"
        direction="column"
        overflowY="auto"
        // p={2}
        mb={2}
      >
        <MessageList messages={messages} />
        {showOptions && <WelcomeOptions onOptionSelect={handleOptionSelect} />}
        {currentFlow === "appointment" && (
          <AppointmentFlow
            addMessage={addMessage}
            sendMessageToGPT={sendMessageToGPT}
            onFlowComplete={() => {
              setCurrentFlow("none");
              setShowOptions(true);
            }}
          />
        )}
        <div ref={messagesEndRef} />
      </Flex>
    </Flex>
  );
};

export default Chat;
