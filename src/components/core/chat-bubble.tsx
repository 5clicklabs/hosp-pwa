import { motion } from "framer-motion";

export default function ChatBubble({
  id,
  text,
  timestamp,
  sender,
}: {
  id: number;
  text: string;
  timestamp: string;
  sender: "user" | "assistant";
}) {
  const isUser = sender === "user";

  return (
    <div
      className={`relative flex items-center ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <motion.div
        key={id}
        layout="position"
        className={`z-10 my-2 max-w-[250px] break-words rounded-2xl ${
          isUser ? "bg-gray-200 text-gray-900" : "bg-gray-800 text-gray-100"
        }`}
        layoutId={`container-${id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-3 py-2 text-[15px] leading-[15px]">{text}</div>
        <div className="px-3 py-1 text-[12px] leading-[12px] text-gray-500">
          {timestamp}
        </div>
      </motion.div>
    </div>
  );
}
