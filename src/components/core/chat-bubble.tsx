import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

export default function ChatBubble(msg: {
  id: number;
  text: string;
  timestamp: string;
}) {
  const [showTimestamp, setShowTimestamp] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const touchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    touchTimeout.current = setTimeout(() => {
      setShowTimestamp(true);
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart !== null) {
      const touchEnd = e.touches[0].clientX;
      if (touchEnd - touchStart > 50) {
        setShowTimestamp(true);
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchTimeout.current) {
      clearTimeout(touchTimeout.current);
    }
    setShowTimestamp(false);
    setTouchStart(null);
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="px-3 py-2 text-[15px] leading-[15px] text-gray-900 dark:text-gray-100">
        {msg.text}
      </div>
      <AnimatePresence>
        {showTimestamp && (
          <motion.div
            key="timestamp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3 py-1 text-[12px] leading-[12px] text-gray-500 dark:text-gray-400"
          >
            {msg.timestamp}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
