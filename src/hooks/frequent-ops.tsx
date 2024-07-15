import messagesAtom from "@/atoms/messagesAtom";
import { languageAtom } from "@/atoms/utils";
import { MANIPAL_DEPARTMENTS as PREDEFINED_DEPARTMENTS } from "@/lib/departments";
import { FrequentlyUsedCard } from "@/lib/types";
import { Ambulance, ClipboardPlus, PhoneCall } from "lucide-react";
import { useRecoilState, useRecoilValue } from "recoil";

export default function useFrequentlyAskedOperations() {
  const [messages, setMessages] = useRecoilState(messagesAtom);
  const useLS = useRecoilValue(languageAtom);

  const sendMessageToGPT = async (
    message: string
  ): Promise<{ response: string; departments: string[] }> => {
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: message,
          language: useLS.applicationLanguage,
          conversationHistory: messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // If the server didn't provide departments, extract them here
      if (!data.departments || data.departments.length === 0) {
        data.departments = extractDepartments(data.response);
      }

      return {
        response: data.response,
        departments: data.departments,
      };
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
        // Implement lab reports functionality here
      },
    },
    {
      logo: Ambulance,
      color: "#00B6F1",
      heading: "Make Appointments",
      subheading: "Book Appointments in seconds",
      directive: () => {
        // This will be handled in the main component now
      },
    },
    {
      logo: PhoneCall,
      color: "#A51514",
      heading: "Emergency",
      subheading: "Call the nearest Manipal Hospital",
      directive: () => {
        console.log("Phone call was called");
        // Implement emergency call functionality here
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
  // Method 1: Look for "department(s):" followed by a list
  const departmentRegex = /department[s]?:?\s*([\w\s,]+)(?=\.|\?|$)/i;
  const match = text.match(departmentRegex);
  if (match && match[1]) {
    const extracted = match[1]
      .split(/,|\sand\s/) // Split by comma or "and"
      .map((dept) => dept.trim())
      .filter(Boolean)
      .filter((dept) => dept.length > 1) // Filter out single-character departments
      .filter((dept) => PREDEFINED_DEPARTMENTS.includes(dept)); // Ensure only valid departments are included

    if (extracted.length > 0) return extracted;
  }

  // Method 2: Look for any mentions of predefined departments
  const mentionedDepartments = PREDEFINED_DEPARTMENTS.filter((dept) =>
    text.toLowerCase().includes(dept.toLowerCase())
  );
  if (mentionedDepartments.length > 0) {
    return mentionedDepartments;
  }

  // Method 3: Fallback to finding capitalized words that might be department names
  const words = text.split(/\s+/);
  const potentialDepartments = words
    .filter((word) => word.length > 1 && word[0] === word[0].toUpperCase())
    .filter((dept) => PREDEFINED_DEPARTMENTS.includes(dept));

  // If we still couldn't find any departments, return a subset of predefined departments
  if (potentialDepartments.length === 0) {
    return PREDEFINED_DEPARTMENTS.slice(0, 3); // Return first 3 as a fallback
  }

  return potentialDepartments;
};
