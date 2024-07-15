import InputForm from "@/components/chat/input-form";
import { Button } from "@/components/ui/button";
import { Message } from "@/lib/types";
import { Flex } from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";

interface GeneralInquiryFlowProps {
  addMessage: (message: Message) => void;
  sendMessageToGPT: (
    message: string
  ) => Promise<{ response: string; departments: string[] }>;
  onFlowComplete: () => void;
}

export default function GeneralInquiryFlow({
  addMessage,
  sendMessageToGPT,
  onFlowComplete,
}: GeneralInquiryFlowProps) {
  const initialMessageSent = useRef(false);
  useEffect(() => {
    if (!initialMessageSent.current) {
      addMessage({
        id: Date.now(),
        text: "What can we help you with?",
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      });
      setStep("input");
      initialMessageSent.current = true;
    }
  }, [addMessage]);

  const [step, setStep] = useState<"input">("input");
  const [isFetching, setIsFetching] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);

  const handleSubmit = async (message: string) => {
    setIsFetching(true);
    addMessage({
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    });

    try {
      const { response, departments } = await sendMessageToGPT(message);

      if (departments.length > 0) {
        setDepartments(departments);
      }

      addMessage({
        id: Date.now(),
        text: response,
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error("Error getting GPT response:", error);
      toast.error(
        "Sorry, there was an error processing your request. Please try again."
      );
    } finally {
      setIsFetching(false);
      onFlowComplete();
    }
  };

  return (
    <Flex direction="column" gap={4}>
      {step === "input" && (
        <Flex mt={2}>
          <InputForm
            placeholder="Type your message"
            onSubmit={handleSubmit}
            isFetching={isFetching}
          />
        </Flex>
      )}
      {departments.length > 0 && (
        <>
          {departments.map((dept) => (
            <Button key={dept} className="w-full">
              Book an Appointment with our {dept} department
            </Button>
          ))}
        </>
      )}
    </Flex>
  );
}
