import messagesAtom from "@/atoms/messagesAtom";
import { languageAtom } from "@/atoms/utils";
import { MANIPAL_DEPARTMENTS as PREDEFINED_DEPARTMENTS } from "@/lib/departments";
import { FrequentlyUsedCard, Message } from "@/lib/types";
import { Ambulance, ClipboardPlus, PhoneCall } from "lucide-react";
import { useRecoilState, useRecoilValue } from "recoil";

export default function useFrequentlyAskedOperations() {
  const [messages, setMessages] = useRecoilState(messagesAtom);
  const useLS = useRecoilValue(languageAtom);

  const sendMessageToGPT = async (
    message: string,
    onChunk: (chunk: string) => void
  ): Promise<string[]> => {
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: message,
          language: "en",
          conversationHistory: messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        onChunk(chunk);
      }

      console.log("Full response:", fullResponse);
      const departments = extractDepartments(fullResponse);
      console.log("Extracted departments:", departments);

      return departments;
    } catch (error) {
      console.error("Error calling GPT API:", error);
      throw error;
    }
  };

  const options: Array<FrequentlyUsedCard> = [
    {
      logo: ClipboardPlus,
      color: "#FF6B04",
      heading: "Access Lab Reports",
      subheading: "Access reports",
      directive: () => {
        console.log("Access lab is being called");
        // sendMessageToAI("I would like to access my lab reports.");
      },
    },
    {
      logo: Ambulance,
      color: "#00B6F1",
      heading: "Make Appointments",
      subheading: "Book Appointments in seconds",
      directive: () => {
        // sendMessageToAI("I would like to make an appointment.");
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
        // sendMessageToAI("I have an emergency and need assistance.");
      },
    },
  ];

  return {
    options,
    sendMessageToGPT,
    messages,
    setMessages,
  };
}

const extractDepartments = (text: string): string[] => {
  console.log("Extracting departments from:", text);

  // Method 1: Look for "department(s):" followed by a list
  const departmentRegex = /department[s]?:?\s*([\w\s,]+)(?=\.|\?|$)/i;
  const match = text.match(departmentRegex);
  if (match && match[1]) {
    const extracted = match[1]
      .split(/,|\sand\s/) // Split by comma or "and"
      .map((dept) => dept.trim())
      .filter(Boolean)
      .filter((dept) => dept.length > 1); // Filter out single-character departments
    console.log("Extracted using regex:", extracted);
    if (extracted.length > 0) return extracted;
  }

  // Method 2: Look for any mentions of predefined departments
  const mentionedDepartments = PREDEFINED_DEPARTMENTS.filter((dept) =>
    text.toLowerCase().includes(dept.toLowerCase())
  );
  if (mentionedDepartments.length > 0) {
    console.log("Extracted using predefined list:", mentionedDepartments);
    return mentionedDepartments;
  }

  // Method 3: Fallback to finding capitalized words that might be department names
  const words = text.split(/\s+/);
  const potentialDepartments = words.filter(
    (word) => word.length > 1 && word[0] === word[0].toUpperCase()
  );
  console.log(
    "Potential departments from capitalized words:",
    potentialDepartments
  );

  // If we still couldn't find any departments, return a subset of predefined departments
  if (potentialDepartments.length === 0) {
    console.log("No departments found, using default subset");
    return PREDEFINED_DEPARTMENTS.slice(0, 3); // Return first 3 as a fallback
  }

  return potentialDepartments;
};
