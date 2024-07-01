import { LucideIcon } from "lucide-react";

export interface FrequentlyUsedCard {
  logo: LucideIcon;
  color: string;
  heading: string;
  subheading: string;
  directive: () => void;
}

export interface Message {
  id: number;
  text: string;
  timestamp: string;
  sender: "user" | "assistant" | "system";
}
