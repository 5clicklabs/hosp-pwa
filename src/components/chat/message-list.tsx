import { AnimatePresence } from "framer-motion";
import React from "react";
import { Message } from "../../lib/types";
import ChatBubble from "../core/chat-bubble";

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => (
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
);

export const simulateAIResponse = (userMessage: string): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: "Thank you for providing that information. Based on your symptoms, I recommend the following departments: Gastroenterology, Internal Medicine. Please choose one:",
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      };
      resolve(aiResponse);
    }, 1000);
  });
};

export default MessageList;
