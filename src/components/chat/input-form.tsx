import React, { useState, useRef, useEffect } from "react";
import { Button, Flex, Textarea, Spinner } from "@chakra-ui/react";
import { ArrowUp } from "lucide-react";
import { toast } from "sonner";

interface InputFormProps {
  onSubmit: (message: string) => void;
  isFetching: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isFetching }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "20px";
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    autoResizeTextarea(event.target);
  };

  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.length > 500) {
      toast.error("This message is too long, please type a shorter message.");
      return;
    }

    if (message.trim() === "") {
      toast.info("You need to type a message first.");
      return;
    }

    onSubmit(message);
    setMessage("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Flex
        borderRadius={50}
        bg="white"
        justify="space-between"
        width="100%"
        align="center"
        px={2}
      >
        <Textarea
          ref={textareaRef}
          placeholder="Describe your symptoms..."
          _placeholder={{
            color: "gray.400",
            fontSize: "14px",
          }}
          _focusVisible={{ outline: "none", boxShadow: "none" }}
          borderRadius={50}
          border="none"
          resize="none"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          style={{
            overflow: "hidden",
            minHeight: "56px",
            maxHeight: "200px",
          }}
          disabled={isFetching}
        />
        <Button
          type="submit"
          bg="#D0D4DD"
          p={2}
          borderRadius={999}
          disabled={isFetching}
        >
          {isFetching ? (
            <Spinner size="sm" />
          ) : (
            <ArrowUp className="w-5 h-5 text-gray-600" />
          )}
        </Button>
      </Flex>
    </form>
  );
};

export default InputForm;
