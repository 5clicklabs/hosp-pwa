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
  sender: "user" | "assistant" | "system";
  timestamp: string;
  action?: {
    type: "button";
    text: string;
    onClick: () => void;
  };
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

export interface AppointmentData {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientDOB: string;
  doctorId: number;
  doctorName: string;
  department: string;
  appointmentDate: Date;
  appointmentTime: string;
}
