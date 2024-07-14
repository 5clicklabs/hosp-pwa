import { motion } from "framer-motion";
import { Spinner } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { fontSizeAtom } from "@/atoms/utils";

interface ChatBubbleProps {
  id: number;
  text: string;
  timestamp: string;
  sender: "user" | "assistant" | "system";
}

export default function ChatBubble({
  id,
  text,
  timestamp,
  sender,
}: ChatBubbleProps) {
  const isUser = sender === "user";
  const useFS = useRecoilValue(fontSizeAtom);

  const formatText = (text: string) => {
    return text.replace(/\n/g, "<br />");
  };

  return (
    <div
      className={`relative flex items-center ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <motion.div
        key={id}
        layout="position"
        className={`z-10 my-2 max-w-[70%] break-words rounded-2xl ${
          isUser ? "bg-gray-200 text-gray-900" : "bg-gray-800 text-gray-100"
        }`}
        layoutId={`container-${id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <p
          className={`px-3 py-2 text-[${useFS.fontSize}px] leading-[${useFS.fontSize}px]`}
        >
          {sender === "system" ? (
            <Spinner size="sm" />
          ) : (
            <span dangerouslySetInnerHTML={{ __html: formatText(text) }} />
          )}
        </p>
        <div
          className={`px-3 py-1 text-[${useFS.fontSize}px] leading-[${useFS.fontSize}px] text-gray-500`}
        >
          {timestamp}
        </div>
      </motion.div>
    </div>
  );
}
