import { fontSizeAtom } from "@/atoms/utils";
import { Message } from "@/lib/types";
import { Spinner } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { Button } from "../ui/button";

export default function ChatBubble({
  id,
  text,
  timestamp,
  sender,
  action,
}: Message) {
  const isUser = sender === "user";
  const useFS = useRecoilValue(fontSizeAtom);

  const formatText = (text: string) => {
    return text.replace(/\n/g, "<br />");
  };

  const fontSize = useFS.fontSize;

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
        <p className={`px-3 py-2 text-[${fontSize}px] leading-[${fontSize}px]`}>
          {sender === "system" ? (
            <Spinner size="sm" />
          ) : (
            <span dangerouslySetInnerHTML={{ __html: formatText(text) }} />
          )}
        </p>
        {action && action.type === "button" && (
          <div className="p-2">
            <Button
              onClick={action.onClick}
              className="bg-white text-black hover:bg-gray-300"
            >
              {action.text}
            </Button>
          </div>
        )}
        <div
          className={`px-3 py-1 text-[${useFS.fontSize}px] leading-[${useFS.fontSize}px] text-gray-500`}
        >
          {timestamp}
        </div>
      </motion.div>
    </div>
  );
}
