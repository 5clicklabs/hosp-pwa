import messagesAtom from "@/atoms/messagesAtom";
import { languageAtom } from "@/atoms/utils";
import { FrequentlyUsedCard, Message } from "@/lib/types";
import { Ambulance, ClipboardPlus, PhoneCall } from "lucide-react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";

export default function useFrequentlyAskedOperations() {
  const [messages, setMessages] = useRecoilState(messagesAtom);
  const useLS = useRecoilValue(languageAtom);

  const sendMessageToAI = async (text: string): Promise<void> => {
    const timestamp = new Date().toLocaleString();
    const id = new Date().getTime();

    const userMessage: Message = {
      id,
      text,
      timestamp,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const systemMessage: Message = {
      id: id + 1,
      text: "",
      timestamp,
      sender: "system",
    };

    setMessages((prevMessages) => [...prevMessages, systemMessage]);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: text,
          language: useLS.applicationLanguage,
          conversationHistory: messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let content = "";
      let done = false;

      while (!done) {
        const { value, done: doneReading } = (await reader?.read()) ?? {
          value: new Uint8Array(),
          done: true,
        };
        done = doneReading;
        const chunk = decoder.decode(value);
        content += chunk;

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === id + 1
              ? { ...msg, text: content, sender: "assistant" }
              : msg
          )
        );

        if (content.includes("Appointment booked successfully")) {
          toast.success("Appointment booked successfully!");
          console.log("Appointment booked!");
        }
      }

      return new Promise((resolve) => {
        const checkMessage = () => {
          const latestMessage = messages[messages.length - 1];
          if (latestMessage && latestMessage.sender === "assistant") {
            resolve();
          } else {
            setTimeout(checkMessage, 100);
          }
        };
        checkMessage();
      });
    } catch (error) {
      console.error(error);
      const failedMessage: Message = {
        id: id + 1,
        text: "Failed to fetch AI response.",
        timestamp,
        sender: "assistant",
      };
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === id + 1 ? failedMessage : msg))
      );
    }
  };

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("POSITION: ", position);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  const options: Array<FrequentlyUsedCard> = [
    {
      logo: ClipboardPlus,
      color: "#FF6B04",
      heading: "Access Lab Reports",
      subheading: "Access reports",
      directive: () => {
        console.log("Access lab is being called");
        sendMessageToAI("I would like to access my lab reports.");
      },
    },
    {
      logo: Ambulance,
      color: "#00B6F1",
      heading: "Make Appointments",
      subheading: "Book Appointments in seconds",
      directive: () => {
        sendMessageToAI("I would like to make an appointment.");
      },
    },
    {
      logo: PhoneCall,
      color: "#A51514",
      heading: "Emergency",
      subheading: "Call the nearest Manipal Hospital",
      directive: () => {
        console.log("Phone call was called");
        // getCurrentLocation();
        sendMessageToAI("I have an emergency and need assistance.");
      },
    },
  ];

  return {
    options,
    sendMessageToAI,
  };
}
