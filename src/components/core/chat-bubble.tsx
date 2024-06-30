import { motion } from "framer-motion";
import { useState } from "react";

export default function ChatBubble(msg: {
  id: number;
  text: string;
  timestamp: string;
}) {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  const handleMessageClick = (id: number) => {
    setSelectedMessage(selectedMessage === id ? null : id);
  };

  return (
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
  );
}
