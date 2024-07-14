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

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  dob: string;
}

export interface Doctor {
  fullName: string;
  specialty: string;
  department: string;
  short_description: string;
  profile_picture: string;
  id: number;
}

export interface DayAvailability {
  date: Date;
  availableSlots: number;
  slots: string[];
}
