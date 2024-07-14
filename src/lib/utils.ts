import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DayAvailability } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAvailability(
  startDate: Date = new Date()
): DayAvailability[] {
  const availability: DayAvailability[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const availableSlots = Math.floor(Math.random() * 16); // 0 to 15 slots
    const slots: string[] = [];

    for (let j = 0; j < availableSlots; j++) {
      const hour = Math.floor(Math.random() * (18 - 8 + 1)) + 8; // 8 AM to 6 PM
      const minute = Math.random() < 0.5 ? "00" : "30"; // Either on the hour or half past
      slots.push(`${hour.toString().padStart(2, "0")}:${minute}`);
    }

    slots.sort();

    availability.push({ date, availableSlots, slots });
  }

  return availability;
}
