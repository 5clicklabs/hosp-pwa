import { motion } from "framer-motion";

export default function ChatBubble(msg: {
  id: number;
  text: string;
  timestamp: string;
}) {
  return (
    <div className="relative flex items-center">
      <motion.div
        key={msg.id}
        layout="position"
        className="z-10 my-2 max-w-[250px] break-words rounded-2xl bg-gray-200 dark:bg-gray-800 cursor-pointer"
        layoutId={`container-${msg.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-3 py-2 text-[15px] leading-[15px] text-gray-900 dark:text-gray-100">
          {msg.text}
        </div>
      </motion.div>
    </div>
  );
}
