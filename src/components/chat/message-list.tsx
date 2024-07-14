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
      <ChatBubble key={message.id} {...message} />
    ))}
  </AnimatePresence>
);

export default MessageList;
