import messagesAtom from "@/atoms/messagesAtom";
import { FrequentlyUsedCard, Message } from "@/lib/types";
import { Ambulance, ClipboardPlus, PhoneCall } from "lucide-react";
import { useRecoilState } from "recoil";

export default function useFrequentlyAskedOperations() {
  const [messages, setMessages] = useRecoilState(messagesAtom);

  const sendMessageToAI = async (text: string) => {
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
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: text }),
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
      }
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
        console.log("Make appointments was called");
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
        getCurrentLocation();
        sendMessageToAI("I have an emergency and need assistance.");
      },
    },
  ];

  return {
    options,
    sendMessageToAI,
  };
}
